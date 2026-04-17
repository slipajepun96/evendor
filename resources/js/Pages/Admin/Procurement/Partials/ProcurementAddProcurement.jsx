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


export default function ProcurementAddProcurement({ }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        procurement_title: '',
        procurement_type: '',
        procurement_description: '',
        procurement_pdf_address: '',
        procurement_open_date: '',
        procurement_close_date: '',
        procurement_status: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [openStart, setOpenStart] = useState(false);
    const [openClose, setOpenClose] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");
    const submit = (e) => {
        e.preventDefault();
        console.log('Procurement data:', data);

        // Call the parent callback to add the procurement
        post(route('procurement.add'), {
            onSuccess: () => {
                reset(
                    'procurement_title',
                    'procurement_type',
                    'procurement_description',
                    'procurement_pdf_address',
                    'procurement_open_date',
                    'procurement_close_date',
                    'procurement_status',
                );
                setIsDialogOpen(false);
            }
        });
    };
        
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
              'procurement_title',
              'procurement_type',
              'procurement_description',
              'procurement_pdf_address',
              'procurement_open_date',
              'procurement_close_date',
              'procurement_status',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    Tambah Perolehan Baru
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Perolehan Baru</DialogTitle>
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
                                        value="Tajuk Perolehan"
                                    />
                                    <TextInput
                                        id="procurement_title"
                                        name="procurement_title"
                                        value={data.procurement_title}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData('procurement_title', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.procurement_title}
                                        className="mt-2"
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
                                    value={data.procurement_description}
                                    className="mt-1 block w-full"
                                    isFocused={false}
                                    onChange={(e) =>
                                        setData(
                                            'procurement_description',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.procurement_description}
                                    className="mt-2"
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <InputLabel
                                        htmlFor="procurement_open_date"
                                        value="Tarikh Buka Perolehan"
                                    />
                                    <Popover open={openStart} onOpenChange={setOpenStart} modal={false}>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className={cn(
                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                    !data.procurement_open_date && "text-muted-foreground"
                                                )}
                                            >
                                                { data.procurement_open_date ? format(data.procurement_open_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                            <Calendar
                                                mode="single"
                                                selected={data.procurement_open_date ? new Date(data.procurement_open_date) : undefined}
                                                onSelect={selectedDate => {
                                                        setData('procurement_open_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                        setOpenStart(false);
                                                    }}
                                                captionLayout={dropdown}
                                                fromYear={2023}
                                                toYear={2100}
                                                className="rounded-lg border shadow-sm"
                                            />
                                            </PopoverContent>
                                        </Popover>
                                    {/* <TextInput
                                        id="procurement_open_date"
                                        name="procurement_open_date"
                                        value={data.procurement_open_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData('procurement_open_date', e.target.value)
                                        }
                                        required
                                    /> */}
                                    <InputError
                                        message={errors.procurement_open_date}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="procurement_close_date"
                                        value="Tarikh Tutup Perolehan"
                                    />
                                    <Popover open={openClose} onOpenChange={setOpenClose} modal={false}>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className={cn(
                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                    !data.procurement_close_date && "text-muted-foreground"
                                                )}
                                            >
                                                { data.procurement_close_date ? format(data.procurement_close_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                            <Calendar
                                                mode="single"
                                                selected={data.procurement_close_date ? new Date(data.procurement_close_date) : undefined}
                                                onSelect={selectedDate => {
                                                        setData('procurement_close_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                        setOpenClose(false);
                                                    }}
                                                captionLayout={dropdown}
                                                fromYear={2023}
                                                toYear={2100}
                                                className="rounded-lg border shadow-sm"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {/* <TextInput
                                        id="procurement_close_date"
                                        name="procurement_close_date"
                                        value={data.procurement_close_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData('procurement_close_date', e.target.value)
                                        }
                                        required
                                    /> */}
                                    <InputError
                                        message={errors.procurement_close_date}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="procurement_type"
                                    value="Jenis Perolehan"
                                />
                                <RadioGroup
                                    name="procurement_type"
                                    value={data.procurement_type}
                                    onChange={(value) => setData('procurement_type', value)}
                                    options={[
                                        { value: 'tender', label: 'Tender' },
                                        { value: 'quotation', label: 'Sebutharga' },
                                    ]}
                                    columns={2}
                                    className=""
                                />
                                <InputError
                                    message={errors.procurement_type}
                                    className="mt-2"
                                />
                            </div>

                            
                            <div>
                                <InputLabel
                                    htmlFor="procurement_pdf_address"
                                    value="Pautan ke PDF Iklan Perolehan"
                                />
                                <TextInput
                                    id="procurement_pdf_address"
                                    name="procurement_pdf_address"
                                    value={data.procurement_pdf_address}
                                    className="mt-1 block w-full"
                                    isFocused={false}
                                    onChange={(e) =>
                                        setData(
                                            'procurement_pdf_address',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.procurement_pdf_address}
                                    className="mt-2"
                                />
                            </div>

                            {(data.vendor_board_citizenship === 'malaysian') && (
                                <div>
                                    <InputLabel
                                        htmlFor="vendor_board_ethnic"
                                        value="Status Bumiputera"
                                    />
                                    <RadioGroup
                                        name="vendor_board_ethnic"
                                        value={data.vendor_board_ethnic}
                                        onChange={(value) => setData('vendor_board_ethnic', value)}
                                        options={[
                                            { value: 'bumiputera', label: 'Bumiputera' },
                                            { value: 'non-bumiputera', label: 'Bukan Bumiputera' },
                                        ]}
                                        columns={2}
                                        className=""
                                    />
                                    <InputError
                                        message={errors.vendor_board_ethnic}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                        </div>
                        <PrimaryButton disabled={processing}>
                            Tambah
                        </PrimaryButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
