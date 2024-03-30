/* eslint-disable react/no-unescaped-entities */
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import { AnonAadhaarCore, serialize, init, verify } from '@anon-aadhaar/core';
import { SerializedPCD } from '@pcd/pcd-types';
import { Dispatch, useEffect, SetStateAction } from "react";
import { useRouter } from "next/router";
import { UserStatus } from "@/interface";
import { useAccount } from "wagmi";
import { useState, useCallback } from "react";
import { useDropzone, Accept } from 'react-dropzone';
import { Header } from "@/components/Header";



function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const type: Accept = {
  json: ['.json']
}

type HomeProps = {
  setUserStatus: Dispatch<SetStateAction<UserStatus>>;
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
};

type AnonAadhaarState = {
  status: 'logged-out' | 'logged-in' | 'logging-in';
  serializedAnonAadhaarProof?: SerializedPCD<AnonAadhaarCore>;
  anonAadhaarProof?: AnonAadhaarCore;
};

const initParams = {
  wasmURL: `https://d1re67zv2jtrxt.cloudfront.net/aadhaar-verifier.wasm`,
  zkeyURL: `https://d1re67zv2jtrxt.cloudfront.net/circuit_final.zkey`,
  vkeyURL: `https://d1re67zv2jtrxt.cloudfront.net/vkey.json`,
  artifactsOrigin: 0,
}

function Index({ setUserStatus, setUseTestAadhaar, useTestAadhaar }: HomeProps) {
  const [anonAadhaar] = useAnonAadhaar();
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const [proof, setProof] = useState<AnonAadhaarCore>();
  const [triggerVerification, setTriggerVerification] = useState(false);

  // Activated when user clicks on AnonAadhar login button
  useEffect(() => {
    anonAadhaar.status === "logged-in"
      ? setUserStatus(UserStatus.LOGGED_IN)
      : setUserStatus(UserStatus.LOGGED_OUT);
  }, [anonAadhaar, setUserStatus]);

  useEffect(() => {
    if (!triggerVerification) {
      return
    };

    const callVerifyProof = async () => {
      try {
        const isValidProof = await verifyProof(proof!);
        if (isValidProof) {
          setProof(proof);
        }
      } catch (error) {
        console.error('Error in backend fetch operation:', error);
      }
    };
    callVerifyProof();
    router.reload()
  }, [triggerVerification]);

  // Executed on API response
  useEffect(() => {
    if (proof) {
      loadSerializedProof(proof);
      setUserStatus(UserStatus.LOGGED_IN);
      setTriggerVerification(true)
    }
  }, [proof]);

  const verifyProof = async (proof: AnonAadhaarCore) => {
    try {
      console.log("Verifying proof....")
      const anonAadharClaim = {
        pubKey: proof.claim.pubKey,
        signalHash: proof.claim.signalHash
      }

      const anonAadhaarProof = {
        groth16Proof: proof.proof.groth16Proof,
        identityNullifier: proof.proof.identityNullifier,
        userNullifier: proof.proof.userNullifier,
        timestamp: proof.proof.timestamp,
        pubkeyHash: proof.proof.pubkeyHash,
        signalHash: proof.proof.signalHash
      };

      const pcd = new AnonAadhaarCore(proof.id, anonAadharClaim, anonAadhaarProof);
      await init(initParams);
      const isValid = await verify(pcd);
      console.log('Is the proof valid?', isValid);
      return isValid
    } catch (e) {
      console.log("Error: ", e)
      return false
    }
  }

  // Utility functions for setting login state in browser
  const loadSerializedProof = async (proof: AnonAadhaarCore) => {
    const serializedProof: SerializedPCD<AnonAadhaarCore> = await serialize(proof);
    const pcd: AnonAadhaarCore = proof;
    const newState: AnonAadhaarState = {
      status: 'logged-in',
      serializedAnonAadhaarProof: serializedProof,
      anonAadhaarProof: pcd
    }
    console.log(`[ANON-AADHAAR] new state: ${newState.status}`);
    console.log(`[ANON-AADHAAR] writing to local storage, status ${newState.status}`);

    const serialize2 = (state: AnonAadhaarState) => {
      const { status } = state;
      let serState;
      if (status === "logged-in") {
        serState = {
          status,
          serializedAnonAadhaarProof: state.serializedAnonAadhaarProof,
          anonAadhaarProof: state.anonAadhaarProof
        };
      } else {
        serState = {
          status: "logged-out"
        };
      }
      return JSON.stringify(serState);
    }

    localStorage.setItem('anonAadhaar', serialize2(newState));
  };

  // Switching between real and test Aadhaar
  const switchAadhaar = () => {
    setUseTestAadhaar(!useTestAadhaar);
  };

  // Drag-and-drop box logic for manual proof.json input verification
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      try {
        const jsonProof = JSON.parse(binaryStr as string);
        console.log('File contents: ', jsonProof);
        setProof(jsonProof);
        setTriggerVerification(true);
        router.push('/creditform');
      } catch (error) {
        console.error('Error parsing the proof JSON', error);
      }
    };
    reader.readAsText(file);
  }, [setProof, setTriggerVerification]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: type
  });

  useEffect(() => {
    const isConnected = () => {
      if (anonAadhaar.status === 'logged-in') {
        router.push('/creditform')
      }
    }
    isConnected();
  },[anonAadhaar.status])

  return (
    <div>
      <Header />
      <div className='flex h-screen items-center mt-20 flex-col'>
        <img src="aa.jpg" className="h-[100px] w-[150px] mb-10" />
        <div className="flex w-full place-content-center gap-8">
          {isConnected ? (
            <LogInWithAnonAadhaar signal={address} />
          ) : (
            <button
              disabled={true}
              type="button"
              className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            >
              You need to connect your wallet first ⬆️
            </button>
          )}
        </div>
        {anonAadhaar.status !== "logged-in" ? (
          <>
            <button
              onClick={switchAadhaar}
              type="button"
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {useTestAadhaar ? "Using test Aadhaar" : "Using real Aadhaar"}. Switch for {useTestAadhaar ? "real" : "test"}
            </button>
          </>
        ) : (
          <></>
        )}
        <p className="mt-4">or</p>

        <div
          {...getRootProps()}
          className="border-2 mt-10 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-500 transition duration-300 ease-in-out"
        >
          <input {...getInputProps()} />
          <p>Drag and drop or click to select a proof.json file here for manual verification</p>
        </div>
      </div>
    </div>
  )
}

export default Index;