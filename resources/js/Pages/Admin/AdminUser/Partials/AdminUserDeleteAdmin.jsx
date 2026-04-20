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


export default function AdminUserAddAdmin({ user }) {
    // console.log(user);

    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openClose, setOpenClose] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const submit = (e) => {
        e.preventDefault();

        // Call the parent callback to add the procurement
       post(route('admin.user.delete', { user: user.id }), {
            onSuccess: () => {
                setIsDialogOpen(false);
            }
        });
    };
        
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline" className="bg-red-500 hover:bg-red-600 text-white">
                    Padam
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Padam Pentadbir</DialogTitle>
                    <DialogDescription>
                        Pasti untuk memadam {user.name} sebagai pentadbir?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="mt-4 flex items-center justify-end">
                        <PrimaryButton className="ms-4 bg-red-500 hover:bg-red-600 text-white" disabled={processing}>
                            Saya Pasti & Padam
                        </PrimaryButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
