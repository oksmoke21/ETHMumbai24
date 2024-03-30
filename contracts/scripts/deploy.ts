import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";
require("dotenv").config({ path: "../../.env.local" });

async function main() {
    // First, we deploy the USDT contract
    const usdtContract = await ethers.deployContract("USDT");

    await usdtContract.waitForDeployment();

    console.log(`USDT contract deployed to ${await usdtContract.getAddress()}`);

    // Second, we deploy the Score contract
    const scoreContract = await ethers.deployContract("Score", [
        `${await usdtContract.getAddress()}`,
        "0x" + process.env.NEXT_PUBLIC_ANON_AADHAAR__SEPOLIA_CONTRACT_ADDRESS
    ]);

    await scoreContract.waitForDeployment();

    console.log(`SCORE contract deployed to ${await scoreContract.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
