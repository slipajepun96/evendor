// import { Inertia } from '@inertiajs/inertia'; 
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/Components/ui/dialog';
import { router, useForm } from '@inertiajs/react';

export default function VendorEditProfileStartDialog({ vendor_details_id, vendor_id, vendor_cert_id }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_id : vendor_id || '',
    });

    const handleAgree = () => {
        router.get(route('vendor.update-profile', { vendor_id }), {
            onSuccess: () => {
                reset(
                    'vendor_id',
                );
                setIsDialogOpen(false);
            },
        });
    };

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            reset(
                'vendor_id',
            );
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                {/* <div className='border h-20 p-2 rounded-xl bg-white shadow-md w-1/6 text-lg'> */}
                <PrimaryButton>Kemaskini Profail Vendor</PrimaryButton>
                    
                {/* </div> */}
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Kemaskini Profail Vendor</DialogTitle>
                    <DialogDescription className="text-gray-800">
                        Sila ambil maklum bahawa : <br />
                        <ol type="1" start="1">
                            <li>1. Dengan mengemaskini profail vendor, perakuan semasa akan terbatal dan perlu memohon semula.</li>
                            <li>2. Penyata Akaun Bank perlulah dikemaskini kepada yang terkini pada setiap kemaskini profail vendor.</li>
                            <li>3. Selepas selesai kemaskini, sila klik "Mohon Menjadi Vendor" untuk memohon perakuan vendor baharu.</li>
                        </ol>
                        <br />
                        Klik butang di bawah sekiranya anda bersetuju
                    </DialogDescription>
                </DialogHeader>
                <div className="items-center space-y-2">
                    <PrimaryButton onClick={handleAgree} disabled={processing}>
                        Setuju & Ingin Mengemaskini
                    </PrimaryButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
