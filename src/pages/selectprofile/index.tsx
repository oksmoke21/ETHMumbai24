import { Header } from '@/components/Header';
import React from 'react';

const Index = () => {
    return (
        <div className='h-screen w-screen bg-[#fff]'>
            <Header />
            <div className=''>
                <p className='text-center text-[1.2rem] font-bold '>
                    Our platform serves both lenders and borrowers.
                </p>
                <p className='text-center text-[1.2rem] font-bold '>
                    Please let us know who you are.
                </p>
            </div>
            <div className='flex space-x-8 items-center justify-center'>
                <div>
                    <button className='rounded-xl border-2 h-[100px] w-[100px] '>
                        Lender
                    </button>
                </div>
                <div>
                    <button className='rounded-xl border-2 h-[100px] w-[100px]'>
                        Borrower
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Index