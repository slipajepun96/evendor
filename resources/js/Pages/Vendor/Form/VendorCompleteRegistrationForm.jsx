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
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function VendorDashboard() {
    const { vendor } = usePage().props.auth;
    const user = usePage().props.auth.user;

    const hours = now.getHours();


    const [vendorType, setVendorType] = useState(''); 
    const [companyType, setCompanyType] = useState(''); 
    const [boardDirectors, setBoardDirectors] = useState([]); 
    const [shouldSubmit, setShouldSubmit] = useState(false);
    
    // Separate state for each calendar popup
    const [openEstablishment, setOpenEstablishment] = useState(false);
    const [openMOFStart, setOpenMOFStart] = useState(false);
    const [openMOFExpiry, setOpenMOFExpiry] = useState(false);
    const [openPKKStart, setOpenPKKStart] = useState(false);
    const [openPKKExpiry, setOpenPKKExpiry] = useState(false);
    const [openCIDBStart, setOpenCIDBStart] = useState(false);
    const [openCIDBExpiry, setOpenCIDBExpiry] = useState(false);
    const [openMPOBStart, setOpenMPOBStart] = useState(false);
    const [openMPOBExpiry, setOpenMPOBExpiry] = useState(false);

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
            vendor_company_type: '',
            vendor_id_num: '',
            vendor_name: '',
            vendor_contact_person: vendor.vendor_contact_person || '',
            vendor_contact_person_phone: '',
            vendor_contact_person_designation: '',
            vendor_phone: '',
            vendor_address: '',
            // vendor_bumiputera_status: '',
            vendor_business_experience_year: '',
            vendor_business_experience_month: '',
            vendor_website: '',
            vendor_tax_identification_num: '',
            vendor_sst_number: '',
            vendor_establishment_date: '',
            vendor_capital_1: '',
            vendor_capital_2: '',
            vendor_bumiputera_ownership_percent: '' || 0.00,
            vendor_bank_entity_registration_num: '',
            vendor_bank_account_statement_address: '',
            vendor_bank_name: '',
            vendor_bank_account_number: '',
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
            vendor_MPOB_license_num: '',
            vendor_MPOB_start_date: '',
            vendor_MPOB_end_date: '',
            vendor_MPOB_license_category: '',
            vendor_MPOB_attachment_address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // console.log('onSuccess', data);
        if(currentPart !== totalParts){
            return;
        }

        setData(prev => ({
            ...prev,
            boardDirectors : boardDirectors
        }));
        setShouldSubmit(true);
    };

    useEffect(() => {
        if (shouldSubmit) {
            setShouldSubmit(false);
            
            post(route('vendor.complete-registration.save'), {
                ...data
            },
            {
                preserveScroll: true,
                onError: errors => {
                    console.group('Submission Errors');
                    console.error('Errors:', errors);
                    console.groupEnd();
                },
                onSuccess: () => {
                    reset();
                },
            });
        }
    }, [data, shouldSubmit]); // Watch for changes in data and shouldSubmit




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
        setData('vendor_company_type', '');
        // setData('')
    };

    const handleCompanyTypeChange = (companyType) => {
        setCompanyType(companyType);
        setData('vendor_company_type', companyType);
    };

    const [dropdown, setDropdown] = useState("dropdown")

    const totalParts = 5;

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
                                                    { value: 'organisation', label: 'Pertubuhan / Kelab' },
                                                ]}
                                                columns={4}
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_type}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    {vendorType === 'company' && (
                                    <div className="grid flex-1 gap-2 md:grid-cols-1 mt-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_company_type"
                                                value={
                                                    <>
                                                        Jenis Syarikat<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <RadioGroup
                                                name="vendor_company_type"
                                                value={data.vendor_company_type}
                                                 onChange={handleCompanyTypeChange}
                                                options={[
                                                    { value: 'bhd', label: 'Syarikat Berhad' },
                                                    { value: 'sdn-bhd', label: 'Syarikat Sendirian Berhad' },
                                                    { value: 'partnership', label: 'Perkongsian' },
                                                    { value: 'sole-ownership', label: 'Milikan Tunggal' },
                                                ]}
                                                columns={4}
                                            />
                                            <InputError
                                                message={errors.vendor_company_type}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    )}
                                    {(vendorType !== '') && (
                                        <>
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
                                                htmlFor="vendor_id_num"
                                                value={
                                                    <>
                                                    {vendorType === 'company' && ( <>No. Pendaftaran SSM  </>)}
                                                    {vendorType === 'individual' && ( <>No. Kad Pengenalan</>)}
                                                    {vendorType === 'cooperation' && ( <>No. Pendaftaran Koperasi</>)}
                                                    {vendorType === 'organisation' && ( <>No. Pendaftaran Pertubuhan / Kelab</>)}
                                                        {/* No. Pendaftaran SSM (Bagi Syarikat Sahaja) / Koperasi / No. Kad Pengenalan (Bagi Individu Sahaja) */}
                                                        <span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />

                                            <TextInput
                                                id="vendor_id_num"
                                                name="vendor_id_num"
                                                value={data.vendor_id_num}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_id_num', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_id_num}
                                                className="mt-2"
                                            />
                                        </div>
                                        )}
                                        {vendorType !== 'individual' && (
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_establishment_date"
                                                value={
                                                    <>
                                                        Tarikh Mula Pendaftaran / Ditubuhkan<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />

                                            <Popover open={openEstablishment} onOpenChange={setOpenEstablishment} modal={false}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                            !data.vendor_establishment_date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        { data.vendor_establishment_date ? format(data.vendor_establishment_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                    <Calendar
                                                    mode="single"
                                                    selected={data.vendor_establishment_date ? new Date(data.vendor_establishment_date) : undefined}
                                                    onSelect={selectedDate => {
                                                            setData('vendor_establishment_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                            setOpenEstablishment(false);
                                                        }}
                                                    captionLayout={dropdown}
                                                    fromYear={1900}
                                                    toYear={2100}
                                                    className="rounded-lg border shadow-sm"
                                                />
                                                </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={errors.vendor_establishment_date}
                                                className="mt-2"
                                            />
                                        </div>
                                        )}
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-1 my-2">
                                        <div className='grid-cols-2'>
                                            <InputLabel
                                                htmlFor="vendor_address"
                                                value={
                                                    <>
                                                        Alamat Surat Menyurat Vendor<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextArea
                                                id="vendor_address"
                                                name="vendor_address"
                                                value={data.vendor_address}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_address', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_address}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_phone"
                                                value={
                                                    <>
                                                        No. Telefon<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_phone"
                                                name="vendor_phone"
                                                value={data.vendor_phone}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_phone', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_phone}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_email"
                                                value={
                                                    <>
                                                        E-Mel<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_email"
                                                name="vendor_email"
                                                value={data.vendor_email}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_email', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_email}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_website"
                                                value={
                                                    <>
                                                        Laman Web
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_website"
                                                name="vendor_website"
                                                value={data.vendor_website}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_website', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_website}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_contact_person"
                                                value={
                                                    <>
                                                        Nama Pegawai Bertugas
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_contact_person"
                                                name="vendor_contact_person"
                                                value={data.vendor_contact_person}
                                                className="mt-1 block w-full"
                                                // onChange={(e) =>
                                                //     setData('vendor_phone', e.target.value)
                                                // }
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_contact_person_designation"
                                                value={
                                                    <>
                                                        Jawatan Pegawai Bertugas<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_contact_person_designation"
                                                name="vendor_contact_person_designation"
                                                value={data.vendor_contact_person_designation}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_contact_person_designation', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_contact_person_designation}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="vendor_contact_person_phone"
                                                value={
                                                    <>
                                                        No. Telefon Pegawai Bertugas<span className="text-red-500">*</span>
                                                    </>
                                                }
                                            />
                                            <TextInput
                                                id="vendor_contact_person_phone"
                                                name="vendor_contact_person_phone"
                                                value={data.vendor_contact_person_phone}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData('vendor_contact_person_phone', e.target.value)
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.vendor_contact_person_phone}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">

                                        {((vendorType === 'company' && (companyType === 'sdn-bhd' || companyType === 'bhd')) || vendorType === 'cooperation') && (
                                            <div>
                                                <InputLabel
                                                    htmlFor="vendor_capital_1"
                                                    value={
                                                        <>
                                                                {vendorType === 'company' ? 'Modal Dibenarkan' : 'Modal Yuran'} <span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_capital_1"
                                                    name="vendor_capital_1"
                                                    value={data.vendor_capital_1}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData('vendor_capital_1', e.target.value)
                                                    }
                                                    formatNumber={true}
                                                    required
                                                />
                                                <InputError
                                                    message={errors.vendor_capital_1}
                                                    className="mt-2"
                                                />
                                            </div>
                                        )}
                                        {((vendorType === 'company' && (companyType === 'sdn-bhd' || companyType === 'bhd')) || vendorType === 'cooperation') && (
                                            <div>
                                                <InputLabel
                                                    htmlFor="vendor_capital_2"
                                                    value={
                                                        <>
                                                            {vendorType === 'company' ? 'Modal Dibayar' : 'Modal Syer'} <span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_capital_2"
                                                    name="vendor_capital_2"
                                                    value={data.vendor_capital_2}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData('vendor_capital_2', e.target.value)
                                                    }
                                                    formatNumber={true}
                                                    required
                                                />
                                                <InputError
                                                    message={errors.vendor_capital_2}
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
                                                    htmlFor="vendor_bumiputera_ownership_percent"
                                                    value={
                                                        <>
                                                            Peratus Pemilikan Bumiputera<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_bumiputera_ownership_percent"
                                                    name="vendor_bumiputera_ownership_percent"
                                                    value={data.vendor_bumiputera_ownership_percent}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        {
                                                            const bumiputeraValue = e.target.value;
                                                            setData('vendor_bumiputera_ownership_percent', e.target.value);

                                                            // Calculate using the new value directly
                                                            const bumiPercent = parseFloat(bumiputeraValue) || 0.00;
                                                            const nonBumiPercent = (100.00 - bumiPercent).toFixed(2);
                                                            setData('vendor_non_bumiputera_ownership_percent', nonBumiPercent);
                                                        }
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor="vendor_non_bumiputera_ownership_percent"
                                                    value={
                                                        <>
                                                            Peratus Pemilikan Bukan Bumiputera<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_non_bumiputera_ownership_percent"
                                                    name="vendor_non_bumiputera_ownership_percent"
                                                    value={data.vendor_non_bumiputera_ownership_percent}
                                                    className="mt-1 block w-full readonly"
                                                    onChange={(e) =>
                                                        setData('vendor_non_bumiputera_ownership_percent', e.target.value)
                                                    }
                                                    disabled
                                                />
                                            </div>
                                            <InputError
                                                message={errors.vendor_non_bumiputera_ownership_percent}
                                                className="mt-2"
                                            />
                                        </div>
                                        )}
                                    </div>
                                    </>
                                    )}
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
                                                    htmlFor="vendor_bank_name"
                                                    value={
                                                        <>
                                                            Bank<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <Select
                                                    onValueChange={(value) =>
                                                        setData('vendor_bank_name', value)
                                                }>
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Sila pilih bank" />
                                                    </SelectTrigger>
                                                    <SelectContent 
                                                        id="vendor_bank_name"
                                                        name="vendor_bank_name"
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
                                                    message={errors.vendor_bank_name}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_bank_account_number"
                                                    value={
                                                        <>
                                                            No. Akaun Bank<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_bank_account_number"
                                                    name="vendor_bank_account_number"
                                                    value={data.vendor_bank_account_number}
                                                    className="mt-1 block w-full uppercase"
                                                    onChange={(e) =>
                                                        setData('vendor_bank_account_number', e.target.value.toUpperCase())
                                                    }
                                                />
                                                <InputError
                                                    message={errors.vendor_bank_account_number}
                                                    className="mt-2"
                                                />
                                            </div>
                                            {(vendorType === 'gov_entity') && (
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_bank_entity_registration_num"
                                                        value={
                                                            <>
                                                                No. Pendaftaran Entiti di Bank<span className="text-red-500">*</span>
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_bank_entity_registration_num"
                                                        name="vendor_bank_entity_registration_num"
                                                        value={data.vendor_bank_entity_registration_num}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_bank_entity_registration_num', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_bank_entity_registration_num}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            )}
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_bank_account_statement_address"
                                                    value={
                                                        <>
                                                            Muat Naik Penyata Akaun Bank<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <FileInput
                                                    id="vendor_bank_account_statement_address"
                                                    name="vendor_bank_account_statement_address"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    maxSize={2}
                                                    showPreview={true}
                                                    onChange={(e) =>
                                                        setData('vendor_bank_account_statement_address', e.target.files[0])
                                                    }
                                                />
                                                <InputError
                                                    message={errors.vendor_bank_account_statement_address}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>       

                                        <p className='text-sm font-bold underline'>Maklumat Berkaitan Jabatan Kastam Diraja Malaysia</p>
                                        <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_sst_number"
                                                    value={
                                                        <>
                                                            No. Pendaftaran SST
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_sst_number"
                                                    name="vendor_sst_number"
                                                    value={data.vendor_sst_number}
                                                    className="mt-1 block w-full uppercase"
                                                    onChange={(e) =>
                                                        setData('vendor_sst_number', e.target.value.toUpperCase())
                                                    }
                                                />
                                                <InputError
                                                    message={errors.vendor_sst_number}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>     
                                        <p className='text-sm font-bold underline mt-8'>Maklumat Berkaitan Lembaga Hasil Dalam Negeri (LHDN)</p>
                                        <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_tax_identification_num"
                                                    value={
                                                        <>
                                                            No. TIN (Tax Identification Number)<span className="text-red-500">*</span>
                                                        </>
                                                    }
                                                />
                                                <TextInput
                                                    id="vendor_tax_identification_num"
                                                    name="vendor_tax_identification_num"
                                                    value={data.vendor_tax_identification_num}
                                                    className="mt-1 block w-full uppercase"
                                                    onChange={(e) =>
                                                        setData('vendor_tax_identification_num', e.target.value.toUpperCase())
                                                    }
                                                />
                                                <InputError
                                                    message={errors.vendor_tax_identification_num}
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
                                    {/* ================ MOF ==================================================== */}
                                    <div className='mt-4 border p-4 rounded-lg hover:shadow-lg transition-shadow'>
                                        <p className='text-sm font-bold underline'>ePerolehan / Sijil Kementerian Kewangan (MOF) (Jika Berkaitan)</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-4 my-2">
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_MOF_reg_num"
                                                        value={
                                                            <>
                                                                No. Pendaftaran
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_MOF_reg_num"
                                                        name="vendor_MOF_reg_num"
                                                        value={data.vendor_MOF_reg_num}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_MOF_reg_num', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_MOF_reg_num}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_MOF_start_date"
                                                        value={
                                                            <>
                                                                Tarikh Mula
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openMOFStart} onOpenChange={setOpenMOFStart} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_MOF_start_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_MOF_start_date ? format(data.vendor_MOF_start_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_MOF_start_date ? new Date(data.vendor_MOF_start_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_MOF_start_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenMOFStart(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_MOF_start_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_MOF_expiry_date"
                                                        value={
                                                            <>
                                                                Tarikh Tamat
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openMOFExpiry} onOpenChange={setOpenMOFExpiry} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_MOF_expiry_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_MOF_expiry_date ? format(data.vendor_MOF_expiry_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_MOF_expiry_date ? new Date(data.vendor_MOF_expiry_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_MOF_expiry_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenMOFExpiry(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_MOF_expiry_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_MOF_attachment_address"
                                                        value={
                                                            <>
                                                                Muat Naik Sijil MOF
                                                            </>
                                                        }
                                                    />
                                                    <FileInput
                                                        id="vendor_MOF_attachment_address"
                                                        name="vendor_MOF_attachment_address"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        maxSize={2}
                                                        showPreview={true}
                                                        onChange={(e) =>
                                                            setData('vendor_MOF_attachment_address', e.target.files[0])
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_MOF_attachment_address}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>                            
                                    </div>

                                    {/* ================ PKK ==================================================== */}
                                    <div className='mt-4 border p-4 rounded-lg hover:shadow-lg transition-shadow'>
                                        <p className='text-sm font-bold underline'>Pusat Khidmat Kontraktor (Jika Berkaitan)</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-4 my-2">
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_PKK_reg_num"
                                                        value={
                                                            <>
                                                                No. Pendaftaran
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_PKK_reg_num"
                                                        name="vendor_PKK_reg_num"
                                                        value={data.vendor_PKK_reg_num}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_PKK_reg_num', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_PKK_reg_num}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_PKK_start_date"
                                                        value={
                                                            <>
                                                                Tarikh Mula
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openPKKStart} onOpenChange={setOpenPKKStart} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_PKK_start_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_PKK_start_date ? format(data.vendor_PKK_start_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_PKK_start_date ? new Date(data.vendor_PKK_start_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_PKK_start_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenPKKStart(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_PKK_start_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_PKK_end_date"
                                                        value={
                                                            <>
                                                                Tarikh Tamat
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openPKKExpiry} onOpenChange={setOpenPKKExpiry} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_PKK_end_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_PKK_end_date ? format(data.vendor_PKK_end_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_PKK_end_date ? new Date(data.vendor_PKK_end_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_PKK_end_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenPKKExpiry(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_PKK_end_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_PKK_attachment_address"
                                                        value={
                                                            <>
                                                                Muat Naik Sijil PKK
                                                            </>
                                                        }
                                                    />
                                                    <FileInput
                                                        id="vendor_PKK_attachment_address"
                                                        name="vendor_PKK_attachment_address"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        maxSize={5}
                                                        showPreview={true}
                                                        onChange={(e) =>
                                                            setData('vendor_PKK_attachment_address', e.target.files[0])
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_PKK_attachment_address}
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
                                                        htmlFor="vendor_CIDB_reg_num"
                                                        value={
                                                            <>
                                                                No. Pendaftaran
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_CIDB_reg_num"
                                                        name="vendor_CIDB_reg_num"
                                                        value={data.vendor_CIDB_reg_num}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_CIDB_reg_num', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_CIDB_reg_num}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_CIDB_start_date"
                                                        value={
                                                            <>
                                                                Tarikh Mula
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openCIDBStart} onOpenChange={setOpenCIDBStart} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_CIDB_start_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_CIDB_start_date ? format(data.vendor_CIDB_start_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_CIDB_start_date ? new Date(data.vendor_CIDB_start_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_CIDB_start_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenCIDBStart(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_CIDB_start_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_CIDB_end_date"
                                                        value={
                                                            <>
                                                                Tarikh Tamat
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openCIDBExpiry} onOpenChange={setOpenCIDBExpiry} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_CIDB_end_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_CIDB_end_date ? format(data.vendor_CIDB_end_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_CIDB_end_date ? new Date(data.vendor_CIDB_end_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_CIDB_end_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenCIDBExpiry(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_CIDB_end_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_CIDB_attachment_address"
                                                        value={
                                                            <>
                                                                Muat Naik Sijil CIDB
                                                            </>
                                                        }
                                                    />
                                                    <FileInput
                                                        id="vendor_CIDB_attachment_address"
                                                        name="vendor_CIDB_attachment_address"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        maxSize={5}
                                                        showPreview={true}
                                                        onChange={(e) =>
                                                            setData('vendor_CIDB_attachment_address', e.target.files[0])
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_CIDB_attachment_address}
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
                                                        htmlFor="vendor_MPOB_license_num"
                                                        value={
                                                            <>
                                                                No. Lesen MPOB
                                                            </>
                                                        }
                                                    />
                                                    <TextInput
                                                        id="vendor_MPOB_license_num"
                                                        name="vendor_MPOB_license_num"
                                                        value={data.vendor_MPOB_license_num}
                                                        className="mt-1 block w-full uppercase"
                                                        onChange={(e) =>
                                                            setData('vendor_MPOB_license_num', e.target.value.toUpperCase())
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_MPOB_license_num}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_MPOB_start_date"
                                                        value={
                                                            <>
                                                                Tarikh Mula
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openMPOBStart} onOpenChange={setOpenMPOBStart} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_MPOB_start_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_MPOB_start_date ? format(data.vendor_MPOB_start_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_MPOB_start_date ? new Date(data.vendor_MPOB_start_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_MPOB_start_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenMPOBStart(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_MPOB_start_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_MPOB_end_date"
                                                        value={
                                                            <>
                                                                Tarikh Tamat
                                                            </>
                                                        }
                                                    />
                                                    <Popover open={openMPOBExpiry} onOpenChange={setOpenMPOBExpiry} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.vendor_MPOB_end_date && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.vendor_MPOB_end_date ? format(data.vendor_MPOB_end_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.vendor_MPOB_end_date ? new Date(data.vendor_MPOB_end_date) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('vendor_MPOB_end_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setOpenMPOBExpiry(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <InputError
                                                        message={errors.vendor_MPOB_end_date}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_MPOB_attachment_address"
                                                        value={
                                                            <>
                                                                Muat Naik Lesen MPOB
                                                            </>
                                                        }
                                                    />
                                                    <FileInput
                                                        id="vendor_MPOB_attachment_address"
                                                        name="vendor_MPOB_attachment_address"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        maxSize={5}
                                                        showPreview={true}
                                                        onChange={(e) =>
                                                            setData('vendor_MPOB_attachment_address', e.target.files[0])
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.vendor_MPOB_attachment_address}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        <div className="grid flex-1 gap-6 md:grid-cols-2 my-2">
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_MPOB_license_category"
                                                    value={
                                                        <>
                                                            Lesen MPOB
                                                        </>
                                                    }
                                                />
                                                <RadioGroup
                                                    name="vendor_MPOB_license_category"
                                                    value={data.vendor_MPOB_license_category}
                                                    onChange={(value) => setData('vendor_MPOB_license_category', value)}
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
                                                    message={errors.vendor_MPOB_license_category}
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
                                                                    <p className="font-medium">
                                                                        { (director.vendor_board_ethnic === 'bumiputera') ? 'Bumiputera' : 'Bukan Bumiputera' }
                                                                    </p>
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
                                    onClick={submit}
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
