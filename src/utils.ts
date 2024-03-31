import { ethers } from "ethers";
import { abi } from "../public/AadhaarNFT.json";
import { useContractWrite } from 'wagmi'

// Type exports for Anon Aadhaar

type BigNumberish = string | bigint

export type PackedGroth16Proof = [
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish
]

// Exports for calling smart contract functions

const providerUrl = `${process.env.NEXT_PUBLIC_SEPOLIA_RPC}`;
const provider = ethers.getDefaultProvider(providerUrl);

export const isValidAadhaar = async (
    identityNullifier: string,
    userNullifier: string,
    timestamp: string,
    signal: string,
    PackedGroth16Proof: PackedGroth16Proof
): Promise<boolean> => {
    console.log("Provider: ", provider)
    const aadhaarNFT = new ethers.Contract(
        `0x${process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS}`,
        abi,
        provider
    );

    return await aadhaarNFT.isAadhaarValid(
        identityNullifier,
        userNullifier,
        timestamp,
        signal,
        PackedGroth16Proof
    );
};

export const viewCreditScoreInternal = async (
    borrower: String
): Promise<number> => {
    const scoreContract = new ethers.Contract(
        `0x${process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS}`,
        abi,
        provider
    );

    return await scoreContract.viewCreditScoreInternal(borrower);
};

export const calculateLoanParameters = async (
    lender: String,
    borrower: String,
    loanPrincipalAmount: Number,
    loanDuration: Number
): Promise<number> => {
    const scoreContract = new ethers.Contract(
        `0x${process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS}`,
        abi,
        provider
    );

    return await scoreContract.calculateLoanParameters(lender, borrower, loanPrincipalAmount, loanDuration);
};

export const useContractFunction = (functionName: string, args: any[]) => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS || ""}`,
        abi: abi,
        functionName,
    });

    const callContract = async () => {
        write({ args });
    };

    return { callContract, data, isLoading, isSuccess };
};