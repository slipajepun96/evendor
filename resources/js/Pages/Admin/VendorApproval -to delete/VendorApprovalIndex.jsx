import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';


export default function VendorApprovalIndex({ unapproved_vendors}) 
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
                    <PrimaryButton
                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDelete(row.id)}
                    >
                        Tolak Permohonan
                    </PrimaryButton>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Permohonan Menjadi Vendor
                </h2>
            }
        >
            <Head title="Permohonan Menjadi Vendor" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">

                <DataTable columns={columns} data={unapproved_vendors} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
