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
} from '@/Components/ui/dialog';

import { useForm } from '@inertiajs/react';
import RadioGroup from '@/Components/RadioGroup';
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
// import { Input } from '@/Components/ui/input';
// import { Label } from '@/Components/ui/label';


export default function DashboardReactivateCert({vendor_cert_uuid,vendor_name}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_name : vendor_name || '',
        vendor_cert_uuid : vendor_cert_uuid || '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openClose, setOpenClose] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");
    const submit = (e) => {
        e.preventDefault();

        post(route('vendor.suspend.reactivate'), {
            onSuccess: () => {
                reset(
                    'vendor_cert_uuid',
                );
                setIsDialogOpen(false);
            }
        });
    };
        
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
                'vendor_cert_uuid',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    Aktifkan Kembali Perakuan
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Aktifkan Kembali Perakuan</DialogTitle>
                    {/* <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription> */}
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2 my-2">
                        <div>
                            <InputLabel
                                htmlFor="vendor_cert_uuid"
                                value="UUID Perakuan "
                            />
                            <TextInput
                                id="vendor_cert_uuid"
                                name="vendor_cert_uuid"
                                value={data.vendor_cert_uuid}
                                className="mt-1 block w-full"
                                isFocused={false}
                                disabled
                            />
                            <InputError
                                message={errors.vendor_cert_uuid}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="vendor_name"
                                value="Nama Vendor "
                            />
                            <TextInput
                                id="vendor_name"
                                name="vendor_name"
                                value={data.vendor_name}
                                className="mt-1 block w-full"
                                isFocused={false}
                                disabled
                            />
                            <InputError
                                message={errors.vendor_name}
                                className="mt-2"
                            />
                        </div>

                    </div>
                    <PrimaryButton disabled={processing}>
                        Aktifkan Kembali
                    </PrimaryButton>
                </form>
            </DialogContent>
        </Dialog>
    );
}
