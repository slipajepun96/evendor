// import { Inertia } from '@inertiajs/inertia'; 
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from '@/Components/ui/dialog';
import { useForm } from '@inertiajs/react';

export default function VendorApplication({vendor_details_id, vendor_id, }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_details_id: vendor_details_id,
        vendor_id: vendor_id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const submit = (e) => {
        e.preventDefault();

        // Call the parent callback to add the board member
        post(route('vendor.submit-application'), {
            onSuccess: () => {
                reset(
                    'vendor_details_id',
                    'vendor_id',
                );
            },
        });

        // Reset form and close dialog
        reset(
            'vendor_details_id',
            'vendor_id',
        );
        setIsDialogOpen(false);
    };
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
              'vendor_board_name',
              'vendor_board_ic_num',
              'vendor_board_citizenship',
              'vendor_board_ethnic',
              'vendor_board_position',
              'vendor_board_address',
              'vendor_board_phone_num',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline" className=" text-sm">
                    Mohon menjadi Vendor
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Mohon menjadi Vendor?</DialogTitle>
                    <DialogDescription>
                        Sila pastikan maklumat profail anda adalah tepat dan terkini sebelum menghantar permohonan. Maklumat yang tidak tepat akan menyebabkan permohonan anda ditolak dan perlu memohon semula.
                    </DialogDescription>
                </DialogHeader>
                <div className="items-center space-y-2">
                    <PrimaryButton onClick={submit} disabled={processing}>
                        Mohon Menjadi Vendor
                    </PrimaryButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
