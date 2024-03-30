import { ethers, artifacts } from "hardhat";

async function main() {
    const contractArtifact = await artifacts.readArtifact("USDT");
    const contractAddress = "0x713Ab3e9479cF2c3B48BC9d8e357CdAFd529d079";

    // Provider and signer setup
    const provider = ethers.getDefaultProvider('sepolia');
    const signer = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
    const USDT = new ethers.Contract(contractAddress, contractArtifact.abi, signer);

    // Calling mint function in USDT contract
    try {
        const amount = ethers.parseUnits("2000", 18);
        const transaction = await USDT.mint(amount);
        await transaction.wait();
        console.log("Function called successfully!");
    } catch (error) {
        console.error("Error calling function:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });