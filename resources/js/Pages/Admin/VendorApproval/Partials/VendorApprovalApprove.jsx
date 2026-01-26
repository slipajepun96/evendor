// import { Inertia } from '@inertiajs/inertia'; 
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';

import { useForm } from '@inertiajs/react';



export default function VendorApprovalApprove({vendor_id , vendor_name}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_id: vendor_id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // const submit = (e) => {
    //     e.preventDefault();
    //     console.log('onSuccess', data);

    //     post(route('lots.add'), {
    //         onSuccess: () => {
    //             reset(
    //                 'lot_num',
    //                 'lot_file_num',
    //                 'lot_description',
    //                 'lot_area_size',
    //                 'location_radius',
    //                 'lot_current_administrator_uuid',
    //             );
    //             // Close the dialog
    //             console.log('onSuccess', data);
    //             setIsDialogOpen(false);
    //         },
    //     });
    // };

    const handleApprove = (e) => {
        e.preventDefault();

        post(route('vendor-approval.approve', {
            // data: {
                vendor_id: data.vendor_id,
                status: 'approved',
            // }
        }))
    }

    const handleReject = (e) => {
        e.preventDefault();

        post(route('vendor-approval.approve', {
            vendor_id: data.vendor_id,
            status: 'rejected',
        }))
    }

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
                <PrimaryButton variant="outline">
                    Lulus / Tolak
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Luluskan Permohonan Vendor</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    Luluskan permohonan {vendor_name} untuk menjadi vendor ? 

                    <form action="" className='flex gap-2'>
                        <PrimaryButton onClick={handleApprove} disabled={processing}>Lulus</PrimaryButton>
                        <SecondaryButton onClick={handleReject} disabled={processing} className='border-red-300 text-red-500 border-2 '>Tolak</SecondaryButton>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
