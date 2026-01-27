import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VendorAuthenticatedLayout from '@/Layouts/VendorAuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';
import VendorApplication from './Partials/VendorApplication';
const now = new Date();

const hours = now.getHours();
// console.log(`Current hour: ${hours}`);


export default function VendorDashboard({ vendor, vendor_details }) {
    // const { vendor } = usePage().props.auth;
    console.log(vendor_details);

    let vendor_profile_completed = false;
    if (vendor_details) {
        vendor_profile_completed = true;
    }


    return (
        <VendorAuthenticatedLayout
            // header={
            //     <h2 className="text-xl font-semibold leading-tight text-gray-800">
            //         Dashboard
            //     </h2>
            // }
        >
            <Head title="Dashboard" />
            <div className="pb-12 pt-4 px-2">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
                        <div className="p-4 text-gray-900 font-semibold">
                            {hours == 0 && hours == 1 ? "Selamat Tengah Malam" : hours >= 2 && hours <= 11 ? "Selamat Pagi" : hours >= 12 && hours <= 13 ? "Selamat Tengah Hari" : hours >= 14 && hours <= 18 ? "Selamat Petang" : "Selamat Malam"} , {vendor}!
                        </div>

                        {/* {vendor_details.vendor_name} */}
                        <div className="flex flex-row gap-2 ml-4 mr-4 mb-4">
                            {!vendor_details ? (
                            <div className='bg-yellow-300 h-30 w-full md:w-1/4 p-4 rounded-xl relative'>
                                <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl'></div>
                                <div className='relative z-10'>
                                    <p className='font-bold text-green-800'>Status Profail</p>
                                    <div className='flex w-full justify-between'>
                                        <div>
                                            <p className='text-2xl font-bold'>Belum Lengkap</p>
                                            <Link className='text-xs underline hover:font-bold' href={route('vendor.complete-registration')}>Lengkapkan Pendaftaran Anda</Link>
                                       </div>
                                        

                                        <p className='text-4xl font-bold'><BadgeCheck size='48' color="#166534" /></p>
                                    </div>
                                </div>
                            </div>
                            ) : (
                            <div className='bg-lime-300 h-30 w-full md:w-1/4 p-4 rounded-xl relative'>
                                <div className='absolute inset-0 bg-gradient-to-br from-lime-400/20 to-green-400/20 rounded-xl'></div>
                                <div className='relative z-10'>
                                    <p className='font-bold text-green-800'>Status Profail</p>
                                    <div className='flex w-full justify-between'>
                                        <div>
                                            <p className='text-2xl font-bold'>Lengkap</p>
                                            {/* <Link className='text-xs underline hover:font-bold' href={route('vendor.complete-registration')}>Kemaskini Pendaftaran Anda</Link> */}
                                       </div>
                                       <div><p className='text-4xl font-bold'><BadgeCheck size='48' color="#166534" /></p></div>
                                    </div>
                                </div>
                            </div>
                            ) }

                            {vendor_profile_completed ? (
                            <div className='bg-red-400 h-30 w-full md:w-1/4 p-4 rounded-xl relative'>
                                <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl'></div>
                                <div className='relative z-10'>
                                    <p className='font-bold text-gray-50'>Permohonan Vendor</p>
                                    <div className='flex w-full justify-between'>
                                        <div>
                                            <p className='text-2xl font-bold text-white'>Tiada</p>
                                            <VendorApplication />
                                       </div>
                                        

                                        <p className='text-4xl font-bold'><BadgeCheck size='48' color="#166534" /></p>
                                    </div>
                                </div>
                            </div>
                            ) : (
                                <div></div>
                            ) } 
                            
                            {/* <div className='bg-amber-300 h-24 w-1/4 p-4 rounded-xl '>
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
                            </div> */}
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-2xl mt-4">
                        <div className="p-4 text-gray-900 font-semibold">
                            Tender / Sebut Harga Yang Sedang Dibuka
                        </div>
                             - akan datang-

                        {/* <div className="flex flex-row gap-2 ml-4 mr-4 mb-4">
                            <div className='bg-lime-300 h-24 w-1/2 p-4 rounded-xl '>
                                <p className='font-bold text-lime-800'>Tender</p>
                                <p className='justify-self-end text-4xl font-bold'>27</p>
                            </div>
                            <div className='bg-lime-300 h-24 w-1/2 p-4 rounded-xl '>
                                <p className='font-bold text-lime-800'>Sebut Harga</p>
                                <p className='justify-self-end text-4xl font-bold'>27</p>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </VendorAuthenticatedLayout>
    );
}
