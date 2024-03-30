// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IScore {
    function setCreditScore(address user, uint256 creditScore) external;
    function beginLoan(uint256 loanId, address lender, address borrower) external;
    function scoreToLenderLoanTerms(address lender, address borrower) external view returns (uint256 interestRate, uint256 collateralRatio);
    function calculateLoanParameters(address lender, address borrower, uint256 loanPrincipalAmount, uint256 loanDuration) external view returns (uint256 repaymentAmount, uint256 collateralAmount);
    function viewCreditScore(address borrower) external view returns (uint256);
    function updateCreditScore(address borrower, uint256 newCreditScore) external;
    function setCreditScore(address borrower, uint256 creditScore, uint identityNullifier, uint userNullifier, uint timestamp, uint signal, uint[8] memory groth16Proof) external;
}