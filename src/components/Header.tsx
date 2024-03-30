import { FunctionComponent } from "react";
import Image from "next/image";
import imgGithub from "../../public/github-mark.png";
import imgPSE from "../../public/pse.png";
import { VoteResults } from "./VoteResults";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useAccount } from "wagmi";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const Header: FunctionComponent = () => {
  const { isConnected } = useAccount();
  return (
    <header className="flex justify-between items-center">
      <div>
        <img src="SCORE.png" className="h-16 w-20 ml-10"/>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-row gap-3 items-center justify-end m-5">
          {process.env.NEXT_PUBLIC_AADHAAR_NFT_CONTRACT_ADDRESS ? (
            <a
              href={`https://sepolia.scrollscan.com/address/0x${process.env.NEXT_PUBLIC_AADHAAR_NFT_CONTRACT_ADDRESS}`}
              target={"_blank"}
              className="text-black font-light text-sm hover:underline "
            >
              {shortenAddress(
                "0x" + process.env.NEXT_PUBLIC_AADHAAR_NFT_CONTRACT_ADDRESS
              )}
            </a>
          ) : null}
          <div className="">
            <a target={"_blank"} rel={"noreferrer"} href="https://pse.dev/">
              <Image alt="pse" src={imgPSE} width={25} height={25}></Image>
            </a>
          </div>
          <div className="">
            <a
              target={"_blank"}
              rel={"noreferrer"}
              href="https://github.com/privacy-scaling-explorations/anon-aadhaar"
            >
              <Image alt="github" src={imgGithub} width={25} height={25}></Image>
            </a>
          </div>
        </div>
        <div className="flex m-5 items-center space-x-2">
          <Web3Button />
          {isConnected && <Web3NetworkSwitch />}
        </div>
      </div>
    </header>
  );
};
