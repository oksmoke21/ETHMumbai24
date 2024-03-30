// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";

/**
 * @title On-chain credit score from your country's credit bureau for better web3 loans
 * @author https://github.com/oksmoke21
 * @notice There are two distinct platform stages in the contract.
 * @notice In the first stage, the borrower onramps their credit score from
 * their national credit bureau. This score is made visible to a lender
 * when a loan agreement is reached with the borower. The lender is charged
 * for the platform's services each time a credit score retrieval is made.
 * @notice In the second stage, the borrower's credit history is tracked for 
 * the purpose of updating their credit score in accordance to their loan
 * repayment history. Timely loan payments are rewarded with an increase
 * in the credit score, while defaults lead to a slashed score.
 * @notice In this version, only USDT is accepted for payments.
 */

contract Score is Ownable, Pausable, ReentrancyGuard {
    IERC20 public USDT;
    uint256 public decimals = 18;
    address public anonAadhaarVerifierAddress;

    // A fee of 5 USDT per credit score pull is charged to lenders
    uint256 public lenderFeesPerScorePull = 5;

    enum LoanStatus {
        ongoing,
        defaulted,
        repayed
    }

    struct Borrower {
        uint256 userNullifier;
        uint256[] loanIds;
    }

    /**
     * @dev For the hackathon, the score to loan parameters mapping is hardcoded to 4 credit score brackets: 0-500, 501-600, 601-750, and 750+. This is highlighted in the function "scoreToLenderLoanTerms()"
     */
    struct Lender {
        uint256 deposit; // ! Subtract and transfer fees each time a loan is started
        uint256[4] scoreVsRatesData;
        uint256[4] scoreVscollateralRatioData;
    }

    struct Loan {
        address borrower;
        address lender;
        uint256 loanPrincipalAmount;
        uint256 loanDuration;
        uint256 loanInterestRate;
        uint256 collateralAmount;
        LoanStatus status;
    }

    // Mapping that checks timestamp till when a lender has read access for a borrower's credit score.
    mapping(address lender => mapping(address borrower => uint256 timestamp)) private readAccess;

    // Mapping to track loans through loanID
    mapping(uint256 loanId => Loan) public loanIdToLoan;

    // Mapping that stores a borrower's credit score against his userNullifier
    mapping(uint256 nullifier => uint256 creditScore) private creditScores;

    // Mapping that stores borrower details against their address
    mapping(address => Borrower) private borrowerDetails;
    
    // Mapping that stores lender details against their address
    mapping(address => Lender) private lenderDetails;

    constructor(address usdtAddress, address _verifierAddr) Ownable(msg.sender) {
        USDT = IERC20(usdtAddress);
        anonAadhaarVerifierAddress = _verifierAddr;
    }

    // Platform functions:

    /**
     * @dev Sets the borrower's credit score against their userNullifier
     * @param borrower Address of the borrower.
     * @param creditScore Credit score of the user obtained from credit bureau.
     * @param identityNullifier Hash of last the 4 digits + DOB, name, gender and pin code.
     * @param userNullifier Hash of the last 4 digits + photo.
     * @param timestamp Timestamp of when the QR code was signed.
     * @param signal Signal used while generating the proof, should be equal to msg.sender.
     * @param groth16Proof SNARK Groth16 proof.
     */
    function setCreditScore(address borrower, uint256 creditScore, uint identityNullifier, uint userNullifier, uint timestamp, uint signal, uint[8] memory groth16Proof) external onlyOwner whenNotPaused{
        require(addressToUint256(msg.sender) == signal, "[AnonAadhaar]: Wrong user signal sent.");
        require(isLessThan3HoursAgo(timestamp) == true, "[AnonAadhaar]: Proof must be generated with Aadhaar data less than 3 hours ago.");
        require(IAnonAadhaar(anonAadhaarVerifierAddress).verifyAnonAadhaarProof(identityNullifier, userNullifier, timestamp, signal, groth16Proof) == true, "[AnonAadhaar]: Proof sent is not valid.");
        require(creditScores[userNullifier] == 0, "[AnonAadhaar]: User has already set their credit score");

        borrowerDetails[borrower].userNullifier = userNullifier;
        creditScores[userNullifier] = creditScore;

        // emit CreditScoreSet(borrower);
    }

    // For updating after loan repayment/default
    // Updates the credit score after any loan is completed
    function updateCreditScore(address borrower, uint256 newCreditScore) external onlyOwner whenNotPaused {
        require(newCreditScore != 0, "Credit score cannot be zero");
        creditScores[borrowerDetails[borrower].userNullifier] = newCreditScore;
        // emit CreditScoreUpdated(borrower);
    }

    // TODO: Debit balance from lender's deposit WHERE this function is being called
    /**
     * @dev Provides borrower's credit score if the caller has read access.
     * @param borrower Address of borrower.
     * @return Credit score of the borrower.
     * @notice The caller must have read access to view borrower's credit score.
     */
    function viewCreditScore(address borrower) external view canRead(borrower) returns (uint256) {
        return creditScores[borrowerDetails[borrower].userNullifier];
    }

    function calculateLoanParameters(address lender, address borrower, uint256 loanPrincipalAmount, uint256 loanDuration) 
      public view returns (uint256 repaymentAmount, uint256 collateralAmount) {
        // Retrieve loan terms offered by lender to borrower
        (uint256 interestRate, uint256 collateralRatio) = scoreToLenderLoanTerms(lender, borrower);
        
        // Calculate loan parameters from given data
        uint256 totalInterest = (loanPrincipalAmount * interestRate * loanDuration * 100) / 365; // Assuming daily interest
        repaymentAmount = loanPrincipalAmount + totalInterest;
        collateralAmount = (loanPrincipalAmount * collateralRatio) / 100;
    }

    // Lender functions:

    function registerLender(uint256[4] memory scoreVsRatesData, uint256[4] memory scoreVscollateralRatioData) external payable nonReentrant {
        for (uint i = 0; i < 4; i++) {
            require(scoreVsRatesData[i] > 0 && scoreVsRatesData[i] < 100, "Lender interest rates must be between 0 and 100");
            require(scoreVscollateralRatioData[i] > 0 && scoreVscollateralRatioData[i] < 200, "Lender collateral ratio must be between 0 and 200");
        }
        lenderDetails[msg.sender].scoreVsRatesData = scoreVsRatesData;
        lenderDetails[msg.sender].scoreVscollateralRatioData = scoreVscollateralRatioData;

        // emit LenderRegistered(msg.sender);

        uint256 depositAmount = 500 * (10 ** decimals);
        lenderDetails[msg.sender].deposit += depositAmount;
        USDT.transferFrom(msg.sender, address(this), depositAmount);
        
        // emit LenderDeposit(msg.sender, amount);
    }

    function lenderDeposit(uint256 amount) external payable nonReentrant {
        require(amount > 0, "Deposit value cannot be zero");
        lenderDetails[msg.sender].deposit += amount;
        USDT.transferFrom(msg.sender, address(this), amount);
        
        // emit LenderDeposit(msg.sender, amount);
    }

    function lenderWithdraw(uint256 amount) external nonReentrant {
        require(lenderDetails[msg.sender].deposit >= amount, "Withdraw amount exceeds deposit balance");
        lenderDetails[msg.sender].deposit -= amount;
        USDT.transferFrom(msg.sender, address(this), amount);
        
        // emit LenderWithdraw(msg.sender, amount);
    }

    // TODO: Create loan function where all the other functions are called

    // Read permission functions =>

    // TODO: Call during loan initiation
    /**
     * @dev Grants a lender read access to a given borrower's credit score until a certain timestamp.
     * @param lender The lender address that is being granted read access.
     * @param borrower The borrower address.
     * @param until The timestamp until which the read access is valid.
     * @notice Only the contract owner can grant read access.
     * @notice Emits a {ReadAccessGranted} event upon success.
     */
    function grantReadAccess(address lender, address borrower, uint256 until) public onlyOwner {
        require(until >= block.timestamp, "Invalid duration given for granting read access");

        readAccess[lender][borrower] = until;
        // emit ReadAccessGranted(lender, borrower, until);
    }

    /**
     * @dev Revokes read access of the given borrower's credit score from the lender.
     * @param lender The lender address that is being granted read access.
     * @param borrower The borrower address.
     * @notice Only the contract owner can revoke read access.
     * @notice Emits a {ReadAccessRevoked} event upon success.
     */
    function revokeReadAccess(address lender, address borrower) public onlyOwner {
        require(readAccess[msg.sender][borrower] > block.timestamp, "Lender doesn't have any revokable view access for borrower");

        delete readAccess[lender][borrower];
        // emit ReadAccessRevoked(lender, borrower);
    }

    /**
     * @dev Checks if the caller has read access to a borrower's credit score.
     * @param borrower The borrower address to check for read access.
     */
    modifier canRead(address borrower) {
        require(creditScores[borrowerDetails[borrower].userNullifier] > 0, "Given borrower address is not a member of Score platform");
        require(readAccess[msg.sender][borrower] > block.timestamp, "Caller does not have view access to user's credit score");
        _;
    }

    // Util functions
    
    /**
     * @dev Convert an address to uint256, used to check against signal.
     * @param _addr Address of msg.sender.
     * @return Address msg.sender's address in uint256
     */
    function addressToUint256(address _addr) private pure returns (uint256) {
        return uint256(uint160(_addr));
    }

    /**
     * @dev Check if the timestamp is more recent than (current time - 3 hours)
     * @param timestamp: msg.sender address.
     * @return bool
     */
    function isLessThan3HoursAgo(uint timestamp) private view returns (bool) {
        return timestamp > (block.timestamp - 3 * 60 * 60);
    }

    // Returns loan terms set by the lender according to the borrower's credit score
    function scoreToLenderLoanTerms(address lender, address borrower) public view returns (uint256 interestRate, uint256 collateralRatio) {
        uint256 index;
        uint256 borrowerCreditScore = creditScores[borrowerDetails[borrower].userNullifier];
        Lender memory _lender = lenderDetails[lender];

        if (borrowerCreditScore < 500) {
            index = 0;
        } else if (borrowerCreditScore >= 500 && borrowerCreditScore < 600) {
            index = 1;
        } else if (borrowerCreditScore >= 600 && borrowerCreditScore < 750) {
            index = 2;
        } else if (borrowerCreditScore >= 750) {
            index = 3;
        }

        return (_lender.scoreVscollateralRatioData[index], _lender.scoreVsRatesData[index]);
    }
}