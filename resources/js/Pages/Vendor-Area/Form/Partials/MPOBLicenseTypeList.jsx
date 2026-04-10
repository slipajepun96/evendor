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
// import { Input } from '@/Components/ui/input';
// import { Label } from '@/Components/ui/label';


export default function MPOBLicenseTypeList() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <p variant="outline" className='underline cursor-pointer text-xs'>
                    Keterangan Jenis Lesen MPOB
                </p>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Lembaga Pengarah</DialogTitle>
                    {/* <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription> */}
                </DialogHeader>
                <p>CF - Kilang Pelumat Isirung Sawit</p>
                <p>CM - Kilang Oleokimia Sawit</p>
                <p>DA - Peniaga Asid Lemak Sawit</p>
                <p>DF - Peniaga Buah Kelapa Sawit</p>
                <p>DK - Peniaga Isirung Sawit</p>
                <p>DL - Peniaga Minyak Sawit</p>
                <p>DM - Peniaga Oleokimia Sawit</p>
                <p>DN - Peniaga Biji Benih Kelapa Sawit dan Anak Benih Kelapa Sawit</p>
                <p>DT - Peniaga Tumbuh-tumbuhan daripada Tisu Kelapa Sawit</p>
                <p>ET - Estet</p>
                <p>KB - Memulakan pembinaan kemudahan simpanan pukal</p>
                <p>KS - kemudahan simpanan pukal</p>
                <p>LB - Makmal (ujian keluaran kelapa sawit)</p>
                <p>MB - Memulakan pembinaan Kilang Buah Kelapa Sawit</p>
                <p>MF - Kilang Buah Kelapa Sawit</p>
                <p>NN - Tapak Semaian</p>
                <p>NS - Penghasil Biji Benih Kelapa Sawit</p>
                <p>NT - Penghasil Tumbuh-tumbuhan daripada Tisu Kelapa Sawit</p>
                <p>PM - Pengimport Keluaran Kelapa Sawit</p>
                <p>PX - Pengeksport Keluaran Kelapa Sawit</p>
                <p>RF - Kilang Penapis</p>
                <p>SH - Kebun kecil</p>
                <p>TL - Pengangkutan Minyak Kelapa Sawit</p>
                <p>UK - Pengukuran Keluaran Kelapa Sawit</p>



            </DialogContent>
        </Dialog>
    );
}
