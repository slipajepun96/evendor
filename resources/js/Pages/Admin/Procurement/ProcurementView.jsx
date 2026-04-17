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
import ProcurementAddProcurement from './Partials/ProcurementAddProcurement';


export default function ProcurementView({procurement}) 
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
            Header: 'Tender / Sebutharga',
            accessor: ['procurement_title'],
            Cell: ({ row }) => (
                
                    <div className="flex flex-col">
                        <div className='font-semibold'>{row.procurement_title}</div>
                        <div className='text-sm'>{row.procurement_description}</div>
                        <a href={row.procurement_pdf_address} target="_blank" className="flex items-center gap-1 text-blue-500 hover:underline mt-1">
                            Lihat Dokumen
                        </a>
                    </div>
                )
        },
        {
            Header: 'Tempoh Dibuka',
            accessor: ['procurement_open_date', 'procurement_close_date'],
            Cell: ({ row }) => {
                return ( 
                    <div className="flex justify-center">
                        {formatDate(row.procurement_open_date)} - {formatDate(row.procurement_close_date)}  
                    </div>
                )
            }
        },
        {
            Header: 'Jenis Perolehan',
            accessor: ['procurement_type'],
            Cell: ({ row }) => {
                return ( 
                    <div className="flex justify-center">
                        {row.procurement_type === 'tender' && (
                            <div className="flex items-center bg-green-200 rounded-xl font-bold px-2 py-0.5 text-green-800 uppercase text-xs font-semibold">
                                Tender
                            </div>
                        )}
                        {row.procurement_type === 'quotation' && (
                            <div className="flex items-center bg-blue-200 rounded-xl font-bold px-2 py-0.5 text-blue-800 uppercase text-xs font-semibold">
                                Sebutharga
                            </div>
                        )}
                    </div>
                )
            }
        },
        {
            Header: 'Status',
            accessor: ['procurement_status'],
            Cell: ({ row }) => {
                return ( 
                    <div className="flex justify-center">
                        {row.procurement_status === 'running' && (
                            <div className="flex items-center bg-green-300 rounded-xl font-bold px-2 py-0.5 text-green-800 uppercase text-xs font-semibold">
                                Berjalan
                            </div>
                        )}
                        {row.procurement_status === 'suspended' && (
                            <div className="flex items-center bg-yellow-300 rounded-xl font-bold px-2 py-0.5 text-yellow-800 uppercase text-xs font-semibold">
                                Digantung
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
                        Senarai Perolehan
                    </h2>
                </div>

            }
        >
            <Head title="Senarai Perolehan" />
            <div className="pb-12 pt-4 px-2">
                <div className="mx-auto max-w-7xl lg:px-8">
                    <ProcurementAddProcurement />
                    <DataTable columns={columns} data={procurement} className='mt-4'/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
