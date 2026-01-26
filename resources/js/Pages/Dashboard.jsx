import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { BadgeCheck, Clock } from 'lucide-react';
const now = new Date();
import { Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DataTable from '@/Components/DataTable';

const hours = now.getHours();
console.log(`Current hour: ${hours}`);


export default function Dashboard({ unapproved_vendors, approved_vendors }) 
{
    const columns = [
        // { Header: 'Nama', accessor: 'allottee_name' },
        // { Header: 'No. Fail / Geran', accessor: 'lot_file_num' },
        {
            Header: 'Nama Vendor',
            accessor: ['vendor_name', 'vendor_id_num'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.vendor_name}</div>
                    <div className='text-sm'>{row.vendor_id_num}</div> 
                </div>
            ),
        },
        {
            Header: 'Jenis Entiti',
            accessor: ['vendor_type',],
            Cell: ({ row }) => (
                <div className="flex flex-col text-sm">
                    {row.vendor_type === 'company' && ('Syarikat')}
                    {row.vendor_type === 'gov_entity' && ('Perbadanan / Entiti Kerajaan')}
                    {row.vendor_type === 'cooperation' && ('Koperasi')}
                    {row.vendor_type === 'organisation' && ('Pertubuhan / Kelab')}
                <p> </p>
                    {row.vendor_company_type === 'bhd' && ('Berhad')}
                    {row.vendor_company_type === 'sdn-bhd' && ('Sendirian Berhad')}
                    {row.vendor_company_type === 'partnership' && ('Perkongsian')}
                    {row.vendor_company_type === 'sole-ownership' && ('Milikan Tunggal')}
                </div>
            ),
        },
        { Header: 'No. Telefon', accessor: 'vendor_phone' },
        {
            Header: 'Tindakan',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2 gap-2">
                    {/* <AllotteeEdit allottee={row} /> */}
                    <Link href={route('vendor-approval.view', row.id)}>
                        <PrimaryButton
                            className="px-2 py-1 text-white"
                        >
                            Lihat Butiran
                        </PrimaryButton>
                    </Link>
                    {/* <PrimaryButton
                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDelete(row.id)}
                    >
                        Tolak Permohonan
                    </PrimaryButton> */}
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
                    <DataTable columns={columns} data={approved_vendors} className='mt-4'/>
                    {/* {approved_vendors} */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
