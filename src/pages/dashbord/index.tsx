import { Header } from '@/components/Header'
import { ProviderTable } from '@/components/ProviderTable'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BorrowerTable } from '@/components/BorrowerTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
const formSchema = z.object({
    firstInterest: z.string().min(2).max(50),
    secondInterest: z.string().min(2).max(50),
    thirdInterest: z.string().min(2).max(50),
    fourthInterest: z.string().min(2).max(50),
    pancardnumber: z.string().min(2).max(50),
    adress: z.string().min(2).max(50),
    gender: z.string().min(2).max(50),
    dob: z.date(),
})
const Index = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstInterest: "",
            secondInterest: "",
            thirdInterest: "",
            fourthInterest: ""
        },
    })
    const router = useRouter();
    const [edit, setEdit] = useState(false)
    function onSubmit() {
        setEdit(true);
    }
    return (
        <div className='h-screen w-[98vw] bg-[#fff] '>
            <Header />
            <h1 className='font-bold text-[2rem] pl-20 mb-4'>My Dashboard</h1>
            <div className='relative flex flex-row space-x-6 ml-[5%]'>
                <div className='w-[30%] p-4 border-2 rounded-[10px]'>
                    <h1 className='text-[1.2rem] font-bold mb-6'>Set Your Interest Rates</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="w-[90%]">
                                <FormField
                                    control={form.control}
                                    name="firstInterest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>For Credit Score 0 - 500</FormLabel>
                                            <FormControl>
                                                <Input  {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-[90%]">
                                <FormField
                                    control={form.control}
                                    name="secondInterest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>For Credit Score 501 - 600</FormLabel>
                                            <FormControl>
                                                <Input  {...field} className="" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-[100%]">
                                <FormField
                                    control={form.control}
                                    name="thirdInterest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>For Credit Score 601 - 749</FormLabel>
                                            <FormControl>
                                                <Input p {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-[100%]">
                                <FormField
                                    control={form.control}
                                    name="fourthInterest"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>For Credit Score 750+</FormLabel>
                                            <FormControl>
                                                <Input  {...field} className="" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" onClick={() => onSubmit()}>Save</Button>
                        </form>
                    </Form>
                </div>
                <div className='w-[70%] relative flex' >
                    {!edit && <div className='absolute inset-0 flex items-center justify-center'>
                        <h1 className='bg-[#000] text-[#fff] p-2 rounded-lg z-50'>Note: To view borrowers list please set your interest rates</h1>
                    </div>}
                    <div className={`relative w-[100%] ${!edit && 'blur-sm'} flex`}>
                        <div className='w-[70%]'>
                            <h1 className='font-bold text-[1.5rem] mb-6'>My Borrowers</h1>
                            <BorrowerTable />
                        </div>
                        <div className='w-[30%]'>
                            <h1 className='font-bold text-[1.5rem] mb-6 ml-6'>My Funds</h1>
                            <div className='border-2 p-2 m-4 rounded-lg mt-8'>
                                <div className='flex items-center'>
                                    <p className='font-bold text-[1rem] mb-6'>Your Balance :</p>
                                    <p className=' text-[2rem] mb-6'>$100</p>
                                </div>
                                <div className='space-x-4'>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className='text-[0.625rem] h-10 w-22 p-4 bg-[#32CD32] text-[#fff]'>Top Up Balance</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Top Up Your Balance</DialogTitle>
                                            </DialogHeader>
                                            <Input />
                                            <DialogFooter>
                                                <Button type="submit">Top Up</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button className='text-[0.625rem] h-10 w-22 p-1 bg-[#C70039]'>Withdraw Funds</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='w-[30%] '>
                        <h1 className='font-bold text-[1.5rem] mb-6'>My Funds</h1>
                        <div className='border-2 w-[100%] rounded-lg'>
                            <div className='flex items-center justify-center'>
                                <p className='font-bold text-[1rem] mb-6'>Your Fund :</p>
                                <p className='font-bold text-[1.5rem] mb-6'>$100</p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Index