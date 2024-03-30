import { ethers } from "ethers";
import { abi } from "../public/AadhaarNFT.json";

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

// const providerUrl = `${process.env.NEXT_PUBLIC_SCROLL_SEPOLIA_RPC}`;
// const provider = ethers.getDefaultProvider(providerUrl);

// export const isValidAadhaar = async (
//     identityNullifier: string,
//     userNullifier: string,
//     timestamp: string,
//     signal: string,
//     PackedGroth16Proof: PackedGroth16Proof
// ): Promise<boolean> => {
//     console.log("Provider: ", provider)
//     const aadhaarNFT = new ethers.Contract(
//         `0x${process.env.NEXT_PUBLIC_AADHAAR_NFT_CONTRACT_ADDRESS}`,
//         abi,
//         provider
//     );

//     return await aadhaarNFT.isAadhaarValid(
//         identityNullifier,
//         userNullifier,
//         timestamp,
//         signal,
//         PackedGroth16Proof
//     );
// };
