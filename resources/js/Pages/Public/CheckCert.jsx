import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function CheckCert({ certExists, cert_id, certDetails }) {

    return (
        <>
            <Head title="Check Certificate" />
            <div className="bg-gray-50 text-black/50" style={{
                backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #3ABCC2 100%)
                `,
                backgroundSize: "100% 100%",
                }}> 

                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">

                        <main className="mt-6">
                            <section className=" ">
                                <div className=" py-2 md:py-8 px-2 md:mx-auto md:max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
                                    <div className="flex flex-col">
                                        <h1 className="mb-2 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">E-Vendor</h1>
                                        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl">PKPP Agro Sdn. Bhd.</p>

                                    </div>
                                    <div>

                                    </div>
                                </div>
                            </section>
                            {certExists ? (
                                <div className='border border-gray-200 p-4 rounded-xl bg-green-700 mb-8 flex flex-row gap-4 items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:h-20 h-10 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <h1 className="text-xl font-bold text-white ">
                                        Perakuan Aktif
                                    </h1>  
                                </div>
                            ) : (
                                <div className='border border-gray-200 p-4 rounded-xl bg-red-600 mb-8 flex flex-row gap-4 items-center justify-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:h-20 h-10 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <h1 className="text-xl font-bold text-white ">
                                        Perakuan Tidak Wujud
                                    </h1>  
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            <footer className="text-center text-sm text-black border-t py-4">
                PKPP Agro Sdn Bhd © 2025 Hak Cipta Terpelihara
            </footer>
        </>
    );
}
