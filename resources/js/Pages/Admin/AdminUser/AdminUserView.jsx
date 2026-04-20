import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import ValueView from '@/Components/ValueView';
import { useState, useEffect } from 'react';
import VendorAttachmentViewer from './Partials/VendorAttachmentViewer';
import SecondaryButton from '@/Components/SecondaryButton';
// import VendorApprovalApprove from './Partials/VendorApprovalApprove';
import { Upload, X, FileIcon, ChevronLeft } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AdminUserAddAdmin from './Partials/AdminUserAddAdmin';
import AdminUserDeleteAdmin from './Partials/AdminUserDeleteAdmin';



export default function AdminUserView({users}) 
{
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

        const columns = [
        {
            Header: 'Nama',
            accessor: ['name'],
            Cell: ({ row }) => (
                
                    <div className="flex flex-col">
                        <div className='font-semibold'>{row.name}</div>

                    </div>
                )
        },
        // { Header: 'No. Telefon', accessor: 'vendor_phone' },
        {
            Header: 'Tindakan',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2 gap-2">
                    <AdminUserDeleteAdmin user={row} />
                    {/* <Link href={route('vendor.view', row.vendor_id)}>
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
                    </PrimaryButton> */}
                </div>
            ),
        },
    ];


    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Senarai Pentadbir
                    </h2>
                </div>

            }
        >
            <Head title="Senarai Pentadbir" />
            <div className="pb-12 pt-4 px-2">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <AdminUserAddAdmin />
                    <DataTable columns={columns} data={users} className='mt-4'/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
