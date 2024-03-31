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
import { calculateLoanParameters } from "@/utils"
import { useAccount } from "wagmi";
const formSchema = z.object({
    amount: z.string(),
})
const LoanForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
        },
    })
    const router = useRouter()
    const { account } = useAccount();
    async function onSubmit(value:any) {
        console.log(value)

        const loanDuration = 30*24*60*60;
        // const lender = "0x";

        // const results = await calculateLoanParameters(account, account, value.amount, loanDuration);
        // console.log(results);
        
    }
    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="w-[100%]">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter The Loan Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <p className="font-bold text-[0.625rem]">Note: Standard loan Duration is 30 days</p>
                    </div>
                    <div className="flex space-x-10">
                        <p className="font-bold">Repayment Amount</p>
                        <p className="font-bold">Collateral Amount</p>
                    </div>
                    <div className="flex space-x-44">
                        <p>100</p>
                        <p className="">120</p>
                    </div>
                    <Button type="submit" className="w-[100%]" onClick={() => onSubmit(form.getValues())}>Transfer Collateral & Get Loan</Button>
                </form>
            </Form>
        </div>
    )
}

export default LoanForm