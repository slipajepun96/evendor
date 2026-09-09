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


export default function ProcurementDeleteProcurement({ procurement }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        procurement_id: procurement.id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openClose, setOpenClose] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");
    const submit = (e) => {
        e.preventDefault();

        // Call the parent callback to add the procurement
        post(route('procurement.delete'), {
            onSuccess: () => {
                reset(
                    'procurement_id',
                );
                setIsDialogOpen(false);
            }
        });
    };
        
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
              'procurement_id',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="alert">
                    Padam
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Padam Perolehan Ini ? </DialogTitle>
                    {/* <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription> */}
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                        <div className="grid flex-1 gap-2">
                            <div className='grid grid-cols-1 gap-2'>
                                <div>
                                    <InputLabel
                                        htmlFor="procurement_title"
                                        value="Kod Perolehan"
                                    />
                                    <TextInput
                                        id="procurement_title"
                                        name="procurement_title"
                                        value={procurement.procurement_title}
                                        className="mt-1 block w-full"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="procurement_description"
                                    value="Keterangan Perolehan"
                                />
                                <TextArea
                                    id="procurement_description"
                                    name="procurement_description"
                                    value={procurement.procurement_description}
                                    className="mt-1 block w-full"
                                    isFocused={false}
                                    disabled
                                />
                            </div>

                        </div>
                        <PrimaryButton disabled={processing}>
                            Padam
                        </PrimaryButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
