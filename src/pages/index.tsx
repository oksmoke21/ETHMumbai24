/* eslint-disable react/no-unescaped-entities */
"use client"
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import { AnonAadhaarCore, serialize, init, verify } from '@anon-aadhaar/core';
import { SerializedPCD } from '@pcd/pcd-types';
import { Dispatch, useEffect, SetStateAction } from "react";
import { useRouter } from "next/router";
import { UserStatus } from "@/interface";
import { useAccount } from "wagmi";
import { useState, useCallback } from "react";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { Header } from "@/components/Header";
import { useDropzone, Accept } from 'react-dropzone';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export default function Home({ setUserStatus, setUseTestAadhaar, useTestAadhaar }: HomeProps) {
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
                setTriggerVerification(true); // auto-trigger proof verification
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


    const [selectedUer, setSelectedUser] = useState('');
    const onBorrowerSelect = (value: string) => {
        setSelectedUser(value);
    }


    useEffect(() => {
        const checkConnected = () => {
            if (isConnected && selectedUer === 'borrower') {
                router.push('/aadhar');
            } else if (isConnected && selectedUer === 'lender') {
                router.push('/dashbord');
            }
        }
        checkConnected()
    }, [isConnected]);
    return (
        <>
            <main className="bg-[#fff] h-screen w-screen flex flex-col items-center rounded-2xl p-4 sm:p-8 justify-between">
                <div>
                    <img src="SCORE.png" className="h-[400px] w-[400px]" />
                </div>
                <div>
                    <p className="text-center font-bold text-[1.6rem]">Anonymously onramp your TradFi Credit Score</p>
                    <p className="text-center font-bold text-[1.6rem]">and get access to <b>better DeFi Loans
                        </b></p>
                </div>
                <div className="mb-[100px]">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Let's Start</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Please let us know who you are.</DialogTitle>
                                <DialogDescription>
                                    Our platform serves both lenders and borrowers.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='flex space-x-8 items-center justify-center'>
                                <div>
                                    <button className={`rounded-xl border-2 h-[100px] w-[100px] ${selectedUer === 'lender' ? 'bg-[#000] text-[#fff]' : 'hover:bg-[#000] hover:text-[#fff]'}`} onClick={() => { onBorrowerSelect('lender') }}>
                                        Lender
                                    </button>
                                </div>
                                <div>
                                    <button
                                        className={`rounded-xl border-2 h-[100px] w-[100px] ${selectedUer === 'borrower' ? 'bg-[#000] text-[#fff]' : 'hover:bg-[#000] hover:text-[#fff]'}`}
                                        onClick={() => { onBorrowerSelect('borrower') }}
                                    >
                                        Borrower
                                    </button>
                                </div>
                            </div>
                            {selectedUer &&
                                <div className="flex items-center justify-center">
                                    <div className="">
                                        <Web3Button />
                                        {isConnected && <Web3NetworkSwitch />}
                                    </div>
                                </div>
                            }
                        </DialogContent>
                    </Dialog>
                </div>
                {/* {anonAadhaar.status !== "logged-in" && isConnected ? (
                    <> */}
                {/* <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-gray-500 transition duration-300 ease-in-out"
                >
                    <input {...getInputProps()} />
                    <p>Drag and drop or click to select a proof.json file here for manual verification</p>
                </div> */}

                {/* </>
                ) : (
                    <>
                    </>
                )} */}
            </main>
        </>
    );
}
