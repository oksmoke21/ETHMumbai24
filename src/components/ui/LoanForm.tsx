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
const formSchema = z.object({
    amount: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    phoneNumber: z.string().min(2).max(50),
    emailAddress: z.string().min(2).max(50),
    pancardnumber: z.string().min(2).max(50),
    adress: z.string().min(2).max(50),
    gender: z.string().min(2).max(50),
    dob: z.date(),
})
const LoanForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
        },
    })
    const router = useRouter()
    function onSubmit() {

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
                    </div>
                    <Button type="submit" onClick={() => onSubmit()}>Submit</Button>
                </form>
            </Form>
        </div>
    )
}

export default LoanForm