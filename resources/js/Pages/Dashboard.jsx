import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';
const now = new Date();
import { Link, useForm } from '@inertiajs/react';

const hours = now.getHours();
console.log(`Current hour: ${hours}`);


export default function Dashboard() {
    const user = usePage().props.auth.user;
    return (
        <AuthenticatedLayout
            // header={
            //     <h2 className="text-xl font-semibold leading-tight text-gray-800">
            //         Dashboard
            //     </h2>
            // }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-2xl">
                        <div className="p-4 text-gray-900 font-semibold">
                            {hours == 0 && hours == 1 ? "Selamat Tengah Malam" : hours >= 2 && hours <= 11 ? "Selamat Pagi" : hours >= 12 && hours <= 13 ? "Selamat Tengah Hari" : hours >= 14 && hours <= 18 ? "Selamat Petang" : "Selamat Malam"}, {user.name}!
                        </div>

                        <div className="flex flex-row gap-2 ml-4 mr-4 mb-4">
                            <div className='bg-lime-300 h-24 w-1/4 p-4 rounded-xl '>
                                <p className='font-bold text-green-800'>Vendor Disahkan</p>
                                <div className='flex w-full justify-between'>
                                    <p className='text-4xl font-bold'>27</p>
                                    <p className='text-4xl font-bold'><BadgeCheck size='48' color="#166534" /></p>
                                </div>

                            </div>
                            <div className='bg-amber-300 h-24 w-1/4 p-4 rounded-xl '>
                                <p className='font-bold text-amber-800'>Vendor Dalam Proses</p>
                                <p className='justify-self-end text-4xl font-bold'>27</p>
                            </div>
                            <div className='bg-red-300 h-24 w-1/4 p-4 rounded-xl '>
                                <p className='font-bold text-red-800'>Vendor Ditolak</p>
                                <p className='justify-self-end text-4xl font-bold'>27</p>
                            </div>
                            <div className='bg-green-300 h-24 w-1/4 p-4 rounded-xl '>
                                <p className='font-bold text-green-800'>Vendor Disahkan</p>
                                <p className='justify-self-end text-4xl font-bold'>27</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
