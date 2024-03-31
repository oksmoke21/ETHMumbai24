import { Header } from '@/components/Header'
import React, { useEffect, useState } from 'react'
import ReactSpeedometer from "react-d3-speedometer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProviderTable } from '@/components/ProviderTable'
import { LoansTable } from '@/components/LoansTable'

import { useAccount, useContractWrite } from "wagmi";

import { viewCreditScoreInternal } from '@/utils'

const Index = () => {
    const { isConnected, address } = useAccount();
    const [myScore, setMyScore] = useState<number>(0);

    // useEffect(() => {
    //     const readCredit = async () => {
    //         const creditScoreRead = await viewCreditScoreInternal(`${address}`);
    //         setMyScore(creditScoreRead);
    //     }
    //     readCredit();
    // }, [myScore])
    return (
        <div>
            <Header />
            <div className='h-screen flex'>
                <div className='w-[35%]'>
                    <div style={{
                        width: "500px",
                        height: "300px",
                        background: "#EFEFEF"
                    }}
                        className='w-[25%] ml-10 mt-10 h-[100px]'>
                        <ReactSpeedometer
                            maxValue={900}
                            customSegmentStops={[0, 500, 700, 800, 900]}
                            segmentColors={["red", "tomato", "gold", "limegreen"]}
                            height={500}
                            width={400}
                            value={783}
                        />
                    </div>
                </div>
                <div className='w-[75%] border-b-2'>
                    <Tabs defaultValue="account" className="w-[100%]">
                        <TabsList className='w-full'>
                            <TabsTrigger value="account" className='w-[50%]'>Get a Loan (under over collaterized)</TabsTrigger>
                            <TabsTrigger value="password" className='w-[50%]'>Improve Your Credit Score</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account"><ProviderTable /></TabsContent>
                        <TabsContent value="password">Change your password here.</TabsContent>
                    </Tabs>

                    <h1 className='font-bold text-[1.5rem] mb-4'>My Loans</h1>
                    <LoansTable />
                </div>
            </div>
        </div>
    )
}

export default Index