"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useRouter } from "next/router";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAnonAadhaar } from "@anon-aadhaar/react";
import { AnonAadhaarCore, packGroth16Proof } from "@anon-aadhaar/core";
import { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Ratings } from "@/components/Ratings";
import { Stepper } from "@/components/Stepper";
import { Loader } from "@/components/Loader";
import { useAccount, useContractWrite } from "wagmi";
import { abi } from "../../../public/AadhaarNFT.json";
import { UserStatus } from "@/interface";
import { PackedGroth16Proof } from "@/utils";
import { type Config } from 'wagmi'


const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    emailAddress: z.string(),
    pancardnumber: z.string(),
    address: z.string(),
    gender: z.string(),
    dob: z.date(),
})

const Index = () => {
    const [anonAadhaar] = useAnonAadhaar();
    const [anonAadhaarCore, setAnonAadhaarCore] = useState<AnonAadhaarCore>();

    const { isConnected, address } = useAccount();

    const { data, isLoading, isSuccess, write } = useContractWrite({
        // address: `0x${process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS || ""}`,
        address: `0x${process.env.NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS || ""}`,
        abi: abi,
        functionName: "setCreditScore",
    });

    useEffect(()=>{
        const check = ()=>{
            if(isSuccess){
                router.push("/myprofile")
            }
        }
        check()
    },[isSuccess]);

    useEffect(() => {
        if (anonAadhaar.status === "logged-in")
            setAnonAadhaarCore(anonAadhaar.anonAadhaarProof);
    }, [anonAadhaar]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            emailAddress: "",
            pancardnumber: "",
            address: "",
            gender: "",
            dob: ""
        },
    })
    const router = useRouter();

    const setContractWrite = async(_anonAadhaarCore: AnonAadhaarCore, creditScore: Number) => {
        const identityNullifier = _anonAadhaarCore.proof.identityNullifier
        const userNullifier = _anonAadhaarCore.proof.userNullifier
        const timestamp = _anonAadhaarCore.proof.timestamp
        const PackedGroth16Proof = packGroth16Proof(_anonAadhaarCore.proof.groth16Proof);

        const args: any[] = [
            address,
            creditScore,
            identityNullifier,
            userNullifier,
            timestamp,
            "1",
            PackedGroth16Proof
        ]

        write({ args: args });
    }


    const onSubmit = async () => {
        const creditScore = Math.floor(Math.random() * (850 - 600 + 1)) + 500;
        
        console.log("Credit score: ", creditScore)

        // Call to smart contract's setCreditScore function
        if (anonAadhaarCore !== undefined) {
            console.log("Setting credit score on-chain");
            await setContractWrite(anonAadhaarCore, creditScore);
        }

        // router.push("/myprofile")
    }
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Header />
            <div className="w-full flex">
                <div className="w-[50%]">
                    <img src="score.jpg" />
                    <p className="font-bold text-[1.5rem] text-center">To Get Your Credit Score and storing it on chain</p>
                    <p className="font-bold text-[1.5rem] text-center"> Please Fill up Form</p>
                </div>
                <div className="w-[50%] pt-10 pl-2 pr-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex w-full">
                                <div className="w-[50%] pr-8">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-[50%] pl-8">
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} className="" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full">
                                <div className="w-[50%]">
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel className="text-left">Phone Number</FormLabel>
                                                <FormControl className="w-full">
                                                    <PhoneInput placeholder="Enter your phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-[50%] pl-8">
                                    <FormField
                                        control={form.control}
                                        name="emailAddress"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel className="text-left">Email Address</FormLabel>
                                                <FormControl className="w-full">
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full">
                                <div className="w-[50%]">
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel className="text-left">Gender</FormLabel>
                                                <FormControl className="w-full">
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-[50%] pl-8">
                                    <FormField
                                        control={form.control}
                                        name="pancardnumber"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel className="text-left">Pan Card Number</FormLabel>
                                                <FormControl className="w-full">
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full">
                                <div className="w-[50%]">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-start">
                                                <FormLabel className="text-left">Address</FormLabel>
                                                <FormControl className="w-full">
                                                    <Input placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-[50%] pl-8">
                                    <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Date of birth</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    " pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex">
                                <p className="text-[0.825rem]"><span className="font-bold">Note :</span> We will only be storing your credit score details. The information provided above will solely be used to fetch your credit score.</p>
                            </div>
                            <Button type="submit" onClick={() => onSubmit()}>Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>


        </div>
    );
};

export default Index;
