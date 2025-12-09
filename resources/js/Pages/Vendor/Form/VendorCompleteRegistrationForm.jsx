import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VendorAuthenticatedLayout from '@/Layouts/VendorAuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { BadgeCheck } from 'lucide-react';
const now = new Date();
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import FileInput from '@/Components/FileInput';
import RadioGroup from '@/Components/RadioGroup';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { useForm } from '@inertiajs/react';
import VendorAddBoard from './Partials/VendorAddBoard';

export default function VendorDashboard() {
    const user = usePage().props.auth.user;

    const hours = now.getHours();


    const [vendorType, setVendorType] = useState('company'); 
    const [boardDirectors, setBoardDirectors] = useState([]); 

    //state untuk bod
    const handleAddBoardDirector = (directorData) => {
        setBoardDirectors(prev => [...prev, directorData]);
    };

    //buang bod dari state
    const handleRemoveBoardDirector = (id) => {
        setBoardDirectors(prev => prev.filter(director => director.id !== id));
    };

    const { data, setData, post, processing, errors, reset } = useForm({
            vendor_email: '',
            vendor_type: '',
            vendor_roc_number: '',
            vendor_entity_number: '',
            vendor_nric_number: '',
            vendor_name: '',
            vendor_contact_person: '',
            vendor_contact_person_phone: '',
            vemodr_contact_person_designation: '',
            vendor_phone: '',
            vendor_address: '',
            vendor_bumiputera_status: '',
            vendor_business_experience_year: '',
            vendor_business_experience_month: '',
            vendor_website: '',
            vendor_tax_identification_num: '',
            vendor_sst_number: '',
            vendor_establishment_date: '',
            vendor_authorised_capital: '',
            vendor_paid_up_capital: '',
            vendor_bumiputera_ownership_percent: '',
            vendor_non_bumiputera_ownership_percent: '',
            vendor_MOF_reg_num: '',
            vendor_MOF_start_date: '',
            vendor_MOF_expiry_date: '',
            vendor_MOF_attachment_address: '',
            vendor_SSM_start_date: '',
            vendor_SSM_expiry_date: '',
            vendor_SSM_attachment_address: '',
            vendor_PKK_reg_num: '',
            vendor_PKK_start_date: '',
            vendor_PKK_end_date: '',
            vendor_PKK_class: '',
            vendor_PKK_head: '',
            vendor_PKK_attachment_address: '',
            vendor_CIDB_reg_num: '',
            vendor_CIDB_start_date: '',
            vendor_CIDB_end_date: '',
            vendor_CIDB_B_cat_grade: '',
            vendor_CIDB_CE_cat_grade: '',
            vendor_CIDB_ME_cat_grade: '',
            vendor_CIDB_attachment_address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        post(route('allottee.add'), {
            onSuccess: () => {
                reset(
                    'allottee_nric',
                    'allottee_name',
                    'allottee_address',
                    'allottee_phone_num',
                    'allottee_email',
                    'allottee_bank_name',
                    'allottee_bank_acc_num',
                    'allottee_is_dead',
                    'allottee_dead_cert_num',
                );
                // Close the dialog
                console.log('onSuccess', data);
                setIsDialogOpen(false);
            },
        });
    };

    const handleNext = () => {
        if (currentPart < totalParts) {
            setCurrentPart(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentPart > 1) {
            setCurrentPart(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleVendorTypeChange = (type) => {
        setVendorType(type);
        setData('vendor_type', type);
    };

    const totalParts = 4;

    const [currentPart, setCurrentPart] = useState(1);

    return (
        <VendorAuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pendaftaran Lengkap Sebagai Vendor
                </h2>
            }
        >
            <Head title="Complete Registration" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">


                    {/* <div className="mb-6">
                        <div className="flex justify-between">
                            {[1, 2, 3, 4].map((part) => (
                                <div key={part} className="flex items-center flex-1 justify-between ">

                                    
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                        currentPart >= part ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                        {part}
                                    </div>

                                    {part < totalParts && (
                                        <div className={`flex-1 h-1 mx-2 ${
                                            currentPart > part ? 'bg-blue-500' : 'bg-gray-300'
                                        }`} />
                                    )}
                                    Bahagian {part}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-sm">Bahagian 1</span>
                            <span className="text-sm">Bahagian 2</span>
                            <span className="text-sm">Bahagian 3</span>
                            <span className="text-sm">Bahagian 4</span>
                        </div>
                    </div> */}


                    <form onSubmit={submit}>  
                        {/* part 1 */}
                        <div className="overflow-hidden bg-white shadow-lg sm:rounded-2xl p-4">
                            {currentPart === 1 && (
                                <div>
                                    <p className='font-bold'>Bahagian 1 : Maklumat Vendor</p>
                                    <div className="grid flex-1 gap-2 md:grid-cols-1">
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_type"
                                                value={
                                                    <>
                                                        Jenis Vendor<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <RadioGroup
                                                name="vendor_type"
                                                value={data.vendor_type}
                                                onChange={handleVendorTypeChange}
                                                options={[
                                                    { value: 'company', label: 'Syarikat' },
                                                    { value: 'gov_entity', label: 'Perbadanan / Entiti Kerajaan' },
                                                    { value: 'cooperation', label: 'Koperasi' },
                                                    { value: 'individual', label: 'Individu' },
                                                ]}
                                                columns={4}
                                                required
                                            />
                                            <InputError
                                                message={errors.product_name}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-1 my-2">
                                        <div className='grid-cols-2'>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                        Nama Vendor<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full uppercase"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value.toUpperCase())
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                        {vendorType !== 'gov_entity' && ( 
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                    {vendorType === 'company' && ( <>No. Pendaftaran SSM (Bagi Syarikat Sahaja) </>)}
                                                    {vendorType === 'individual' && ( <>No. Kad Pengenalan</>)}
                                                    {vendorType === 'cooperation' && ( <>No. Pendaftaran Koperasi</>)}
                                                        {/* No. Pendaftaran SSM (Bagi Syarikat Sahaja) / Koperasi / No. Kad Pengenalan (Bagi Individu Sahaja) */}
                                                        <span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />

                                            <TextInput
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        )}
                                        {vendorType !== 'individual' && (
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                        Tarikh Mula Pendaftaran<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        )}
                                        {vendorType == 'company'  && (
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                        Tarikh Tamat Pendaftaran (Jika Ada)
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        )}
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-1 my-2">
                                        <div className='grid-cols-2'>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                        Alamat Surat Menyurat Vendor<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextArea
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                        No. Telefon<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                        E-Mel<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_name"
                                                value={
                                                    <>
                                                        Laman Web
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_name"
                                                name="vendor_name"
                                                value={data.vendor_name}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_name', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">

                                        {vendorType === 'company' && (
                                                <div>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Modal Dibenarkan<span className="text-red-500">*</span>
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value)
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                        )}
                                        {vendorType === 'company' && (
                                                <div>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Modal Dibayar<span className="text-red-500">*</span>
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value)
                                                        }
                                                        required
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                        )}
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-2 my-2">
                                        {vendorType === 'company' && (
                                        <div className='grid flex-1 gap-2 grid-cols-2'>
                                            <div>
                                                <InputLabel
                                                    htmlFor="vendor_name"
                                                    value={
                                                        <>
                                                            Peratus Pemilikan Bumiputera<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_name"
                                                    name="vendor_name"
                                                    value={data.vendor_name}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData('vendor_name', e.target.value)
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="vendor_name"
                                                    value={
                                                        <>
                                                            Peratus Pemilikan Bukan Bumiputera<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_name"
                                                    name="vendor_name"
                                                    value={data.vendor_name}
                                                    className="mt-1 block w-full readonly"
                                                    // onChange={(e) =>
                                                    //     setData('vendor_name', e.target.value)
                                                    // }
                                                    readonly
                                                    
                                                />
                                            </div>
                                            
                                            <InputError
                                                message={errors.vendor_name}
                                                className="mt-2"
                                            />
                                        </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* part 2 */}
                            {currentPart === 2 && (
                                <div>
                                    <p className='font-bold'>Bahagian 2 : Maklumat Kewangan</p>
                                    <div className='mt-4'>
                                        <p className='text-sm font-bold underline'>Maklumat Bank Vendor</p>
                                        <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_name"
                                                    value={
                                                        <>
                                                            Bank<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <Select
                                                    onValueChange={(value) =>
                                                        setData('allottee_bank_name', value)
                                                }>
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Sila pilih bank" />
                                                    </SelectTrigger>
                                                    <SelectContent 
                                                        id="allottee_bank_name"
                                                        name="allottee_bank_name"
                                                    >
                                                        <SelectItem value="Maybank">Maybank</SelectItem>
                                                        <SelectItem value="Maybank Islamic">Maybank Islamic</SelectItem>
                                                        <SelectItem value="CIMB Bank">CIMB Bank</SelectItem>
                                                        <SelectItem value="Public Bank">Public Bank</SelectItem>
                                                        <SelectItem value="RHB Bank">RHB Bank</SelectItem>
                                                        <SelectItem value="Bank Simpanan Nasional">Bank Simpanan Nasional</SelectItem>
                                                        <SelectItem value="Hong Leong Bank">Hong Leong Bank</SelectItem>
                                                        <SelectItem value="AmBank">AmBank</SelectItem>
                                                        <SelectItem value="Bank Islam">Bank Islam</SelectItem>
                                                        <SelectItem value="Bank Rakyat">Bank Rakyat</SelectItem>
                                                        <SelectItem value="Affin Bank">Affin Bank</SelectItem>
                                                        <SelectItem value="Alliance Bank">Alliance Bank</SelectItem>
                                                        <SelectItem value="HSBC Bank">HSBC Bank</SelectItem>
                                                        <SelectItem value="Standard Chartered Bank">Standard Chartered Bank</SelectItem>
                                                        <SelectItem value="OCBC Bank">OCBC Bank</SelectItem>
                                                        <SelectItem value="UOB Bank">UOB Bank</SelectItem>
                                                        <SelectItem value="AgroBank">AgroBank</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.vendor_name}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_name"
                                                    value={
                                                        <>
                                                            No. Akaun Bank<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_name"
                                                    name="vendor_name"
                                                    value={data.vendor_name}
                                                    className="mt-1 block w-full uppercase"
                                                    onChange={(e) =>
                                                        setData('vendor_name', e.target.value.toUpperCase())
                                                    }
                                                />
                                                <InputError
                                                    message={errors.vendor_name}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_bank_statement"
                                                    value={
                                                        <>
                                                            Muat Naik Penyata Akaun Bank<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <FileInput
                                                    id="vendor_bank_statement"
                                                    name="vendor_bank_statement"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    maxSize={5}
                                                    showPreview={true}
                                                    onChange={(e) =>
                                                        setData('vendor_bank_statement', e.target.files[0])
                                                    }
                                                />
                                                <InputError
                                                    message={errors.vendor_bank_statement}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>       

                                        <p className='text-sm font-bold underline'>Maklumat Berkaitan Jabatan Kastam Diraja Malaysia</p>
                                        <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_name"
                                                    value={
                                                        <>
                                                            No. Pendaftaran SST<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_name"
                                                    name="vendor_name"
                                                    value={data.vendor_name}
                                                    className="mt-1 block w-full uppercase"
                                                    onChange={(e) =>
                                                        setData('vendor_name', e.target.value.toUpperCase())
                                                    }
                                                />
                                                <InputError
                                                    message={errors.vendor_name}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>                             
                                    </div>


                                </div>
                            )}


                            {/* part 3 */}
                            {currentPart === 3 && (
                                <div>
                                    <p className='font-bold'>Bahagian 3 : Maklumat Lesen / Persijilan Vendor</p>
                                    {/* ================ PKK ==================================================== */}
                                    <div className='mt-4 border p-4 rounded-lg hover:shadow-lg transition-shadow'>
                                        <p className='text-sm font-bold underline'>Pusat Khidmat Kontraktor (Jika Berkaitan)</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-4 my-2">
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                No. Pendaftaran
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Tarikh Mula
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Tarikh Tamat
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_bank_statement"
                                                        value={
                                                            <>
                                                                Muat Naik Sijil PKK
                                                            </>
                                                        }
                                                    />
                                                    <FileInput
                                                        id="vendor_bank_statement"
                                                        name="vendor_bank_statement"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        maxSize={5}
                                                        showPreview={true}
                                                        onChange={(e) =>
                                                            setData('vendor_bank_statement', e.target.files[0])
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_bank_statement}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        <div className="grid flex-1 gap-6 md:grid-cols-2 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_PKK_class"
                                                    value={
                                                        <>
                                                            Kelas PKK
                                                        </>
                                                    }
                                                />
                                                <RadioGroup
                                                    name="vendor_PKK_class"
                                                    value={data.vendor_PKK_class}
                                                    onChange={(value) => setData('vendor_PKK_class', value)}
                                                    options={[
                                                        { value: 'A', label: 'A' },
                                                        { value: 'B', label: 'B' },
                                                        { value: 'C', label: 'C' },
                                                        { value: 'D', label: 'D' },
                                                        { value: 'E', label: 'E' },
                                                        { value: 'F', label: 'F' },
                                                    ]}
                                                    columns={6}
                                                    className="grid-cols-3"
                                                />
                                                <InputError
                                                    message={errors.vendor_PKK_class}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_PKK_head"
                                                    value={
                                                        <>
                                                            Kepala PKK
                                                        </>
                                                    }
                                                />
                                                <RadioGroup
                                                    name="vendor_PKK_head"
                                                    value={data.vendor_PKK_head}
                                                    onChange={(value) => setData('vendor_PKK_head', value)}
                                                    options={[
                                                        { value: 'I', label: 'I' },
                                                        { value: 'II', label: 'II' },
                                                        { value: 'III', label: 'III' },
                                                        { value: 'IV', label: 'IV' },
                                                        { value: 'V', label: 'V' },
                                                        { value: 'VI', label: 'VI' },
                                                        { value: 'VII', label: 'VII' },
                                                    ]}
                                                    columns={7}
                                                    className="grid-cols-4"
                                                />
                                                <InputError
                                                    message={errors.vendor_PKK_head}
                                                    className="mt-2"
                                                />
                                            </div>

                                            
                                        </div>                                 
                                    </div>

                                    {/* ============ CIDB ======================================================== */}
                                    <div className='mt-4 border p-4 rounded-lg hover:shadow-lg transition-shadow'>
                                        <p className='text-sm font-bold underline'>Lembaga Pembangunan Industri Pembinaan Malaysia (CIDB) (Jika Berkaitan)</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-4 my-2">
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                No. Pendaftaran
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Tarikh Mula
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Tarikh Tamat
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_bank_statement"
                                                        value={
                                                            <>
                                                                Muat Naik Sijil CIDB
                                                            </>
                                                        }
                                                    />
                                                    <FileInput
                                                        id="vendor_bank_statement"
                                                        name="vendor_bank_statement"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        maxSize={5}
                                                        showPreview={true}
                                                        onChange={(e) =>
                                                            setData('vendor_bank_statement', e.target.files[0])
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_bank_statement}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        <div className="grid flex-1 gap-6 md:grid-cols-2 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_CIDB_B_cat_grade"
                                                    value={
                                                        <>
                                                            Gred CIDB Kategori B
                                                        </>
                                                    }
                                                />
                                                <RadioGroup
                                                    name="vendor_CIDB_B_cat_grade"
                                                    value={data.vendor_CIDB_B_cat_grade}
                                                    onChange={(value) => setData('vendor_CIDB_B_cat_grade', value)}
                                                    options={[
                                                        { value: 'G1', label: 'G1' },
                                                        { value: 'G2', label: 'G2' },
                                                        { value: 'G3', label: 'G3' },
                                                        { value: 'G4', label: 'G4' },
                                                        { value: 'G5', label: 'G5' },
                                                        { value: 'G6', label: 'G6' },
                                                        { value: 'G7', label: 'G7' },
                                                    ]}
                                                    columns={7}
                                                    className="grid-cols-3"
                                                />
                                                <InputError
                                                    message={errors.vendor_CIDB_B_cat_grade}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_CIDB_CE_cat_grade"
                                                    value={
                                                        <>
                                                            Gred CIDB Kategori CE
                                                        </>
                                                    }
                                                />
                                                <RadioGroup
                                                    name="vendor_CIDB_CE_cat_grade"
                                                    value={data.vendor_CIDB_CE_cat_grade}
                                                    onChange={(value) => setData('vendor_CIDB_CE_cat_grade', value)}
                                                    options={[
                                                        { value: 'G1', label: 'G1' },
                                                        { value: 'G2', label: 'G2' },
                                                        { value: 'G3', label: 'G3' },
                                                        { value: 'G4', label: 'G4' },
                                                        { value: 'G5', label: 'G5' },
                                                        { value: 'G6', label: 'G6' },
                                                        { value: 'G7', label: 'G7' },
                                                    ]}
                                                    columns={7}
                                                    className="grid-cols-3"
                                                />
                                                <InputError
                                                    message={errors.vendor_CIDB_CE_cat_grade}
                                                    className="mt-2"
                                                />
                                            </div>

                                              <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_CIDB_ME_cat_grade"
                                                    value={
                                                        <>
                                                            Gred CIDB Kategori ME
                                                        </>
                                                    }
                                                />
                                                <RadioGroup
                                                    name="vendor_CIDB_ME_cat_grade"
                                                    value={data.vendor_CIDB_ME_cat_grade}
                                                    onChange={(value) => setData('vendor_CIDB_ME_cat_grade', value)}
                                                    options={[
                                                        { value: 'G1', label: 'G1' },
                                                        { value: 'G2', label: 'G2' },
                                                        { value: 'G3', label: 'G3' },
                                                        { value: 'G4', label: 'G4' },
                                                        { value: 'G5', label: 'G5' },
                                                        { value: 'G6', label: 'G6' },
                                                        { value: 'G7', label: 'G7' },
                                                    ]}
                                                    columns={7}
                                                    className="grid-cols-3"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.vendor_CIDB_ME_cat_grade}
                                                    className="mt-2"
                                                />
                                            </div>
                                            
                                        </div>                                 
                                    </div>


                                    {/* ============ MPOB ======================================================== */}
                                    <div className='mt-4 border p-4 rounded-lg hover:shadow-lg transition-shadow'>
                                        <p className='text-sm font-bold underline'>Lembaga Minyak Sawit Malaysia (MPOB) (Jika Berkaitan)</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-4 my-2">
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                No. Lesen MPOB
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_MPOB_license_number', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_MPOB_license_number}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Tarikh Mula
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_name"
                                                        value={
                                                            <>
                                                                Tarikh Tamat
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_name"
                                                        name="vendor_name"
                                                        value={data.vendor_name}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_name', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_name}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_bank_statement"
                                                        value={
                                                            <>
                                                                Muat Naik Lesen MPOB
                                                            </>
                                                        }
                                                    />
                                                    <FileInput
                                                        id="vendor_bank_statement"
                                                        name="vendor_bank_statement"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        maxSize={5}
                                                        showPreview={true}
                                                        onChange={(e) =>
                                                            setData('vendor_bank_statement', e.target.files[0])
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_bank_statement}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        <div className="grid flex-1 gap-6 md:grid-cols-2 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_MPOB_license_cat"
                                                    value={
                                                        <>
                                                            Lesen MPOB
                                                        </>
                                                    }
                                                />
                                                <RadioGroup
                                                    name="vendor_MPOB_license_cat"
                                                    value={data.vendor_MPOB_license_cat}
                                                    onChange={(value) => setData('vendor_MPOB_license_cat', value)}
                                                    options={[
                                                        { value: 'NN', label: 'NN' },
                                                        { value: 'NS', label: 'NS' },
                                                        { value: 'MF', label: 'MF' },
                                                        { value: 'RF', label: 'RF' },
                                                        { value: 'DF', label: 'DF' },
                                                    ]}
                                                    columns={5}
                                                    className="grid-cols-3"
                                                />
                                                <InputError
                                                    message={errors.vendor_MPOB_license_cat}
                                                    className="mt-2"
                                                />
                                            </div>
                                            
                                        </div>                                 
                                    </div>


                                </div>
                            )}


                            {/* part 4 */}
                            {currentPart === 4 && (
                                <div>
                                    <p className='font-bold'>Bahagian 4 : Lembaga Pengarah</p>

                            {(vendorType === 'gov_entity' || vendorType === 'individual') && (
                                <div className='bg-lime-100 m-2 p-2 text-sm'>
                                    Nama dan butiran Lembaga Pengarah tidak diperlukan untuk entiti kerajaan atau individu. Sila langkau bahagian ini.
                                </div>

                            )}

                            {(vendorType === 'company' || vendorType === 'cooperation') && (
                                <div className=' m-2 p-2 text-sm'>
                                    <VendorAddBoard onAddBoard={handleAddBoardDirector} />
                                    
                                    {/* Display added board directors */}
                                    {boardDirectors.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-lg font-semibold mb-4">Senarai Lembaga Pengarah</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {boardDirectors.map((director) => (
                                                    <div key={director.id} className="border rounded-lg p-4 bg-gray-50">
                                                        <div className="flex justify-between items-start">
                                                            <div className="grid grid-cols-2 gap-2 flex-1">
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Nama</p>
                                                                    <p className="font-medium">{director.vendor_board_name}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">No. K/P</p>
                                                                    <p className="font-medium">{director.vendor_board_ic_num}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Kewarganegaraan</p>
                                                                    <p className="font-medium">
                                                                        { (director.vendor_board_citizenship === 'malaysian') ? 'Warganegara' : 'Bukan Warganegara' }
                                                                        </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Etnik</p>
                                                                    <p className="font-medium">{director.vendor_board_ethnic}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Jawatan</p>
                                                                    <p className="font-medium">{director.vendor_board_position}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">No. Telefon</p>
                                                                    <p className="font-medium">{director.vendor_board_phone_num}</p>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <p className="text-sm text-gray-600">Alamat</p>
                                                                    <p className="font-medium">{director.vendor_board_address}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveBoardDirector(director.id)}
                                                                className="ml-4 bg-red-500 px-2 py-1 rounded text-white hover:bg-red-700"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            )}

                                </div>
                            )}

                        </div>
                        <div className="flex justify-between mt-6">
                            <PrimaryButton
                                onClick={handlePrev}
                                disabled={currentPart === 1}
                                className="px-4 py-2 bg-blue-500 rounded disabled:opacity-50"
                            >
                                Sebelumnya
                            </PrimaryButton>
                            {/* {allAnswered && (
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Hantar Undian
                                </button>
                            )} */}
                            {(currentPart === totalParts) && (
                                <PrimaryButton
                                    onClick={handleNext}
                                    // disabled={currentPart === totalParts}
                                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                                >
                                    Hantar
                                </PrimaryButton>
                            )}
                            {(currentPart !== totalParts) && (
                                <PrimaryButton
                                    onClick={handleNext}
                                    disabled={currentPart === totalParts}
                                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                                >
                                    Seterusnya
                                </PrimaryButton>
                            )}
                            {/* <PrimaryButton
                                onClick={handleNext}
                                disabled={currentPart === totalParts}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            >
                                Seterusnya
                            </PrimaryButton> */}
                        </div>

                        {/* end of part 1 */}

                        {/* part 2 */}
                    </form>
                </div>
            </div>
        </VendorAuthenticatedLayout>
    );
}
