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


export default function VendorAddBoard({ onAddBoard }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_board_name: '',
        vendor_board_ic_num: '',
        vendor_board_citizenship: '',
        vendor_board_ethnic: '',
        vendor_board_position: '',
        vendor_board_address: '',
        vendor_board_phone_num: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        console.log('Board data:', data);

        // Call the parent callback to add the board member
        if (onAddBoard) {
            onAddBoard({
                id: Date.now(), // Generate unique ID
                ...data
            });
        }

        // Reset form and close dialog
        reset(
            'vendor_board_name',
            'vendor_board_ic_num',
            'vendor_board_citizenship',
            'vendor_board_ethnic',
            'vendor_board_position',
            'vendor_board_address',
            'vendor_board_phone_num',
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
                <PrimaryButton variant="outline">
                    Tambah Lembaga Pengarah
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Tambah Lembaga Pengarah</DialogTitle>
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
                                        htmlFor="vendor_board_name"
                                        value="Nama Lembaga Pengarah"
                                    />
                                    <TextInput
                                        id="vendor_board_name"
                                        name="vendor_board_name"
                                        value={data.vendor_board_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData('vendor_board_name', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.vendor_board_name}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                                <div>
                                    <InputLabel
                                        htmlFor="vendor_board_ic_num"
                                        value="No. Kad Pengenalan"
                                    />
                                    <TextInput
                                        id="vendor_board_ic_num"
                                        name="vendor_board_ic_num"
                                        value={data.vendor_board_ic_num}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData('vendor_board_ic_num', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.vendor_board_ic_num}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="vendor_board_phone_num"
                                        value="No. Telefon"
                                    />
                                    <TextInput
                                        id="vendor_board_phone_num"
                                        name="vendor_board_phone_num"
                                        value={data.vendor_board_phone_num}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData('vendor_board_phone_num', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.vendor_board_phone_num}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="lot_file_num"
                                    value="Alamat"
                                />
                                <TextArea
                                    id="vendor_board_address"
                                    name="vendor_board_address"
                                    value={data.vendor_board_address}
                                    className="mt-1 block w-full"
                                    isFocused={false}
                                    onChange={(e) =>
                                        setData(
                                            'vendor_board_address',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.lot_file_num}
                                    className="mt-2"
                                />
                            </div>
                            
                                <div>
                                    <InputLabel
                                        htmlFor="vendor_board_position"
                                        value="Jawatan Dalam Lembaga Pengarah"
                                    />
                                    <TextInput
                                        id="vendor_board_position"
                                        name="vendor_board_position"
                                        value={data.vendor_board_position}
                                        className="mt-1 block w-full"
                                        isFocused={false}
                                        onChange={(e) =>
                                            setData(
                                                'vendor_board_position',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.vendor_board_position}
                                        className="mt-2"
                                    />
                                </div>
                                
                            <div>
                                <InputLabel
                                    htmlFor="vendor_board_citizenship"
                                    value="Warganegara"
                                />
                                <RadioGroup
                                    name="vendor_board_citizenship"
                                    value={data.vendor_board_citizenship}
                                    onChange={(value) => setData('vendor_board_citizenship', value)}
                                    options={[
                                        { value: 'malaysian', label: 'Warganegara Malaysia' },
                                        { value: 'non-citizen', label: 'Bukan Warganegara' },
                                    ]}
                                    columns={2}
                                    className=""
                                />
                                <InputError
                                    message={errors.vendor_board_citizenship}
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
