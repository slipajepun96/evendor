import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VendorAuthenticatedLayout from '@/Layouts/VendorAuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';
import VendorApplication from './Partials/VendorApplication';
const now = new Date();
import PrimaryButton from '@/Components/PrimaryButton';
import { Download, ClockAlert, X, ClockFading} from 'lucide-react';
import {
  Button,
  Timeline,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";
// import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";

const hours = now.getHours();
// console.log(`Current hour: ${hours}`);

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};


export default function VendorDashboard({ vendor, vendor_details, vendor_applications, vendor_active_cert }) {
    // const { vendor } = usePage().props.auth;

    const vendor_profile_completed = !!vendor_details;
    const vendor_application_status = vendor_applications.length > 0 ? vendor_applications[0].application_status : null;
    


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
                    <div className="overflow-hidden bg-white shadow-lg rounded-2xl border border-gray-200">
                        <div className="p-4 text-gray-900 font-semibold">
                            {hours == 0 && hours == 1 ? "Selamat Tengah Malam" : hours >= 2 && hours <= 11 ? "Selamat Pagi" : hours >= 12 && hours <= 13 ? "Selamat Tengah Hari" : hours >= 14 && hours <= 18 ? "Selamat Petang" : "Selamat Malam"} , {vendor}!
                        </div>
                        {/* {vendor_applications[0].application_status} */}
                        {(vendor_application_status !== 'approved') && (
                        <div className='p-4'>
                            <p className=" text-gray-900 font-semibold">
                                Terima kasih atas minat anda untuk menjadi vendor dengan kami!</p>
                            <p className="text-sm text-gray-600 mb-4">
                                Terdapat beberapa lagi langkah yang perlu dilakukan untuk melengkapkan pendaftaran vendor anda. 
                            </p>
                            <div className='grid md:grid-cols-3 gap-2'>
                                    {/* <p className='uppercase text-sm font-bold text-gray-700 text-center'>Langkah Sekarang</p> */}
                                    <div className="rounded-lg border-gray-200 shadow border p-4 bg-white">
                                        <p className="font-bold text-gray-700">1. Lengkapkan Profil Vendor Anda</p>
                                        {!vendor_details ? ( <p className='bg-green-600 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Perlu Tindakan</p>
                                        ) : (
                                            <p className='bg-sky-600 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Selesai</p>
                                        )}
                                        <p className='mt-2 text-sm'>Sila lengkapkan maklumat profil anda untuk memulakan proses pendaftaran permohonan menjadi vendor.</p>
                                    </div>
                                    <div className="rounded-lg border-gray-200 shadow border p-4">
                                        <p className="font-bold text-gray-700">2. Hantar Permohonan Menjadi Vendor</p>
                                        {vendor_profile_completed && (vendor_application_status === null) ? ( <p className='bg-green-600 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Perlu Tindakan</p>
                                        ) : vendor_profile_completed && (vendor_application_status !== null) ? (<p className='bg-sky-600 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Selesai</p>
                                        ) : (
                                            <p className='bg-gray-400 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Profil Tidak Lengkap</p>
                                        )}
                                        <p className='mt-2 text-sm'>Setelah profil anda telah lengkap, anda boleh menghantar permohonan untuk menjadi vendor.</p>
                                    </div>
                                    <div className="rounded-lg border-gray-200 shadow border p-4">
                                        <p className="font-bold text-gray-700">Selesai</p>
                                        {vendor_profile_completed && (vendor_application_status === 'pending') ? ( <p className='bg-green-600 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Tunggu Keputusan</p>
                                        ) : vendor_profile_completed && (vendor_application_status === 'approved') ? (<p className='bg-sky-600 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Selesai</p>
                                        ) : (
                                            <p className='bg-gray-400 rounded text-white px-1 text-xs font-bold uppercase inline-block'>Tiada Permohonan</p>
                                        )}
                                        <p className='mt-2 text-sm'>Jika permohonan anda diluluskan, anda boleh memuat turun Perakuan Pendaftaran Vendor anda dan boleh menyertai semua sebut harga / tender yang ditawarkan.</p>
                                    </div>
                            </div>
                        </div>
                        )} 

                        {/* {vendor_details.vendor_name} */}
                        <div className="md:grid md:grid-cols-3 gap-2 p-3">
                            {!vendor_details ? (
                            <div className='bg-yellow-300 h-30 p-4 rounded-xl relative'>
                                <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl'></div>
                                <div className='relative z-10'>
                                    <p className='font-bold text-green-800'>Status Profail</p>
                                    <div className='flex w-full justify-between'>
                                        <div>
                                            <p className='text-2xl font-bold'>Belum Lengkap</p>
                                            <Link className='text-xs underline hover:font-bold' href={route('vendor.complete-registration')}>Lengkapkan Pendaftaran Anda</Link>
                                       </div>
                                        

                                        <p className='text-4xl font-bold'><ClockAlert size='48' color="#166534" /></p>
                                    </div>
                                </div>
                            </div>
                            ) : (
                            <div className='bg-lime-300 h-30 p-4 rounded-xl relative'>
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

                            {vendor_profile_completed && (vendor_application_status === null) && (
                            <div className='bg-gray-300 h-30 p-4 rounded-xl relative'>
                                <div className='relative z-10'>
                                    <p className='font-bold text-gray-700'>Permohonan Vendor</p>
                                    <div className='flex w-full justify-between'>
                                        <div>
                                            <p className='text-2xl font-bold text-gray-700'>Tiada</p>
                                            <VendorApplication vendor_details_id={vendor_details?.id} vendor_id={vendor_details?.vendor_account_id} />
                                       </div>
                                        <p className='text-4xl font-bold'><X size='48' color="#6a6a6a" /></p>
                                    </div>
                                </div>
                            </div>
                            ) }

                            { vendor_profile_completed && (vendor_application_status !== null && vendor_applications[0].application_status === 'pending' ) && (
                            <div className='bg-amber-500 h-30 p-4 rounded-xl relative'>
                                <div className='relative z-10'>
                                    <p className='font-bold text-white'>Permohonan Vendor</p>
                                    <div className='flex w-full justify-between'>
                                        <div>
                                            <p className='text-2xl font-bold text-white'>Dalam Proses</p>
                                       </div>
                                        <p className='text-4xl font-bold'><ClockFading size='48' color="#FFFFFF" /></p>
                                    </div>
                                </div>
                            </div>
                            )}

                            { vendor_profile_completed && (vendor_application_status !== null && vendor_applications[0].application_status === 'approved' ) && (
                            <div className='bg-lime-300 h-30 p-4 rounded-xl relative'>
                                <div className='absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl'></div>
                                <div className='relative z-10'>
                                    <p className='font-bold text-gray-700'>Permohonan Vendor</p>
                                    <div className='flex w-full justify-between'>
                                        <div>
                                            <p className='text-2xl font-bold text-gray-700'>Diluluskan</p>
                                            <p className='uppercase text-xs font-semibold'>Tamat Pada {formatDate(vendor_active_cert?.cert_end_date)}</p>
                                       </div>
                                        <p className='text-4xl font-bold'><BadgeCheck size='48' color="#166534" /></p>
                                    </div>
                                </div>
                            </div>
                            
                            )}
                            
                               
                            
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
                    { vendor_profile_completed && (vendor_application_status !== null && vendor_applications[0].application_status === 'approved' ) && (
                        <div className="overflow-hidden bg-white shadow-lg rounded-2xl mt-4 p-4">
                            <p className=" text-gray-900 font-semibold">
                                Perakuan Pendaftaran Vendor
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                Perakuan Pendaftaran Vendor ini perlu dibawa semasa membeli borang tender/sebut harga dan ianya perlu dilampirkan bersama borang tender/sebutharga semasa penghantaran borang tersebut.
                            </p>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = route('vendor.download-cert', { vendor_id: vendor_details?.vendor_account_id });
                                }}
                            >
                                <PrimaryButton className="gap-2"><Download /> Muat Turun Perakuan Pendaftaran Vendor</PrimaryButton>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </VendorAuthenticatedLayout>
    );
}
