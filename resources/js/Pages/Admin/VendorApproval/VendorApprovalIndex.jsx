import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';


export default function VendorApprovalIndex({ unapproved_vendors }) 
{
    console.log(unapproved_vendors);
    const columns = [
        // { Header: 'Nama', accessor: 'allottee_name' },
        // { Header: 'No. Fail / Geran', accessor: 'lot_file_num' },
        {
            Header: 'Nama Vendor',
            accessor: ['id'],
            Cell: ({ row }) => {
                const dataSnapshot = JSON.parse(row.application_data_snapshot);
                return (
                    <div className="flex flex-col">
                        
                        <div className='font-semibold'>{dataSnapshot.vendor_name}</div>
                        <div className='font-base text-sm'> Application ID : {row.id}</div>
                        {/* <div className='font-semibold'>{vendorName}</div> */}
                    </div>
                );
            },
        },
        {
            Header: 'Tindakan',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2 gap-2">
                    <Link href={route('vendor-approval.view', row.vendor_id)}>
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



