import { Header } from '@/components/Header'
import React from 'react'
import ReactSpeedometer from "react-d3-speedometer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProviderTable } from '@/components/ProviderTable'
import { LoansTable } from '@/components/LoansTable'

const Index = () => {
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
              value={900}
            />
          </div>
        </div>
        <div className='w-[75%] border-b-2'>
          <Tabs defaultValue="account" className="w-[100%]">
            <TabsList className='w-full'>
              <TabsTrigger value="account" className='w-[50%]'>Get a Loan (under over collaterized)</TabsTrigger>
              <TabsTrigger value="password" className='w-[50%]'>Improve Your Credit Score</TabsTrigger>
            </TabsList>
            <TabsContent value="account"><ProviderTable/></TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>

          <h1 className='font-bold text-[1.5rem] mb-4'>My Loans</h1>
          <LoansTable/>
        </div>
      </div>
    </div>
  )
}

export default Index