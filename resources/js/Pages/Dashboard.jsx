import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { BadgeCheck, Clock } from 'lucide-react';
const now = new Date();
import { Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DataTable from '@/Components/DataTable';
import { Download } from 'lucide-react';

const hours = now.getHours();
console.log(`Current hour: ${hours}`);


export default function Dashboard({ unapproved_vendors, approved_vendors }) 
{
    // console.log(approved_vendors[0].cert_data_snapshot['vendor_name']);

    const columns = [
        {
            Header: 'Nama Vendor',
            accessor: ['vendor_name', 'vendor_id_num'],
            Cell: ({ row }) => (
                
                    <div className="flex flex-col">
                        <div className='font-semibold'>{row.cert_data_snapshot['vendor_name']}</div>
                        <div className='text-sm'>{row.cert_data_snapshot['vendor_id_num']}</div>
                    </div>
                )
        },
        {
            Header: 'Jenis Entiti',
            accessor: ['vendor_type',],
            Cell: ({ row }) => {
                const snap = row.cert_data_snapshot ?? {};
                return (
                    <div className="flex flex-col text-sm">
                        {snap['vendor_type'] === 'company' && ('Syarikat')}
                        {snap['vendor_type'] === 'gov_entity' && ('Perbadanan / Entiti Kerajaan')}
                        {snap['vendor_type'] === 'cooperation' && ('Koperasi')}
                        {snap['vendor_type'] === 'organisation' && ('Pertubuhan / Kelab')}
                <p> </p>
                    {snap['vendor_company_type'] === 'bhd' && ('Berhad')}
                    {snap['vendor_company_type'] === 'sdn-bhd' && ('Sendirian Berhad')}
                    {snap['vendor_company_type'] === 'partnership' && ('Perkongsian')}
                    {snap['vendor_company_type'] === 'sole-ownership' && ('Milikan Tunggal')}
                </div>
                )
            }
        },
        {
            Header: 'Status',
            accessor: ['vendor_type',],
            Cell: ({ row }) => {
                return ( 
                    <div className="flex justify-center">
                        {row.cert_status === 'approved' && (
                            <div className="flex items-center bg-green-300 rounded-xl font-bold px-2 py-0.5 text-green-800 uppercase text-xs font-semibold">
                                Lulus
                            </div>
                        )}
                        {row.cert_status === 'suspended' && (
                            <div className="flex items-center bg-yellow-300 rounded-xl font-bold px-2 py-0.5 text-yellow-800 uppercase text-xs font-semibold">
                                Digantung
                            </div>
                        )}
                        {row.cert_status === 'rejected' && (
                            <div className="flex items-center bg-red-300 rounded-xl font-bold px-2 py-0.5 text-red-800 uppercase text-xs font-semibold">
                                Ditolak
                            </div>
                        )}
                    </div>
                )
            }
        },
        // { Header: 'No. Telefon', accessor: 'vendor_phone' },
        {
            Header: 'Tindakan',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2 gap-2">
                    {/* <AllotteeEdit allottee={row} /> */}
                    <Link href={route('vendor.view', row.vendor_id)}>
                        <PrimaryButton
                            className="px-2 py-1 text-white"
                        >
                            Lihat Butiran
                        </PrimaryButton>
                    </Link>
                    
                    <PrimaryButton
                        className="gap-2"
                        onClick={() => window.open(route('vendor.download-vendor-cert', { vendor_id: row.vendor_id }), '_blank')}
                    >
                        <Download /> Perakuan
                    </PrimaryButton>
                    <PrimaryButton
                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDelete(row.id)}
                    >
                        Tarik Perakuan
                    </PrimaryButton>
                </div>
            ),
        },
    ];
    const number_of_unapproved_vendors = unapproved_vendors.length;
    const number_of_approved_vendors = approved_vendors.length;
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
                            <div className='bg-lime-300 h-30 w-1/3 p-4 rounded-xl '>
                                <p className='font-bold text-green-800'>Vendor Disahkan</p>
                                <div className='flex w-full justify-between'>
                                    <p className='text-4xl font-bold'>{number_of_approved_vendors}</p>
                                    <p className='text-4xl font-bold'><BadgeCheck size='48' color="#166534" /></p>
                                </div>
                            </div>
                            <div className='bg-amber-300 h-30 w-1/3 p-4 rounded-xl '>
                                <p className='font-bold text-green-800'>Permohonan Memerlukan Perhatian</p>
                                <div className='flex w-full justify-between'>
                                    <p className='text-4xl font-bold'>{number_of_unapproved_vendors}</p>
                                    <p className='text-4xl font-bold'><Clock size='48' color="#FF8F00" /></p>
                                </div>
                                <Link className='text-xs underline hover:font-bold' href={route('vendor-approval.index')}>
                                <PrimaryButton className="bg-gray-800">Lihat Senarai</PrimaryButton></Link>
                            </div>

                            <div className='bg-red-300 h-30 w-1/3 p-4 rounded-xl '>
                                <p className='font-bold text-red-800'>Vendor Ditolak</p>
                                <p className='justify-self-end text-4xl font-bold'>27</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white p-3 mt-8 rounded-2xl shadow-lg '>
                        <h2 className="text-2xl font-semibold text-gray-900">Senarai Vendor Disahkan</h2>
                        <DataTable columns={columns} data={approved_vendors} className='mt-4'/>
                    </div>

                    {/* {approved_vendors.id} */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
