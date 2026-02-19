import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import ValueView from '@/Components/ValueView';
import { useState, useEffect } from 'react';
import VendorApprovalAttachmentViewer from './Partials/VendorApprovalAttachmentViewer';
import SecondaryButton from '@/Components/SecondaryButton';
import VendorApprovalApprove from './Partials/VendorApprovalApprove';


export default function VendorApprovalView({ unapproved_vendor, snapshot , bank_statements_attachment_url, MOF_attachment_url, CIDB_attachment_url, PKK_attachment_url, MPOB_attachment_url, user_id }) 
{
    //json parse
    const parsedSnapshot = JSON.parse(unapproved_vendor.application_data_snapshot);
    console.log('parsedSnapshot:', parsedSnapshot);
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        
        // Convert to UTC+8
        const utcDate = new Date(date.getTime() + (8 * 60 * 60 * 1000));
        
        const day = String(utcDate.getUTCDate()).padStart(2, '0');
        const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
        const year = utcDate.getUTCFullYear();
        const hours = String(utcDate.getUTCHours()).padStart(2, '0');
        const minutes = String(utcDate.getUTCMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

        const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Permohonan Menjadi / Kemaskini Vendor
                </h2>
            }
        >
            <Head title="Permohonan Menjadi / Kemaskini Vendor" />
            <div className="py-4 md:py-4 px-2">
                <div className="mx-auto max-w-7xl space-y-1 sm:px-6 lg:px-8">
                    {/* header */}
                    {/* <div className='font-bold text-4xl'>{unapproved_vendor.vendor_name}</div> */}

                    {/* status dan butiran permohonan */}
                    <div className='flex flex-row gap-1'>
                        <VendorApprovalApprove vendor_application_id={unapproved_vendor.id} vendor_name={parsedSnapshot['vendor_name']} />
                        <SecondaryButton>Tolak Permohonan</SecondaryButton>
                        <PrimaryButton>Cetak</PrimaryButton>
                    </div>



                    <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg p-3 mt-4'>

                        <div className='font-bold text-4xl'>{parsedSnapshot['vendor_name']}</div>

                        {/* part 0 : butiran permohonan */}
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                        
                            <div className=''>
                                <InputLabel
                                    htmlFor="is_approved"
                                    value={
                                        <>
                                            Status Permohonan
                                        </>
                                    }
                                />
                            
                                {parsedSnapshot['is_approved'] === 0 && (
                                    <p className='inline-block bg-amber-300 border-amber-700 text-gray-600 font-bold text-xs uppercase px-1 py-0.5 rounded-md'>Belum Diluluskan</p>
                                )}
                                {parsedSnapshot['is_approved'] === 1 && (
                                    <p className='inline-block bg-lime-300 border-lime-500 text-gray-600 font-bold text-xs uppercase px-1 py-0.5 rounded-sm'>Belum Diluluskan</p>
                                )}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_status"
                                    value={
                                        <>
                                            Tarikh & Masa Permohonan
                                        </>
                                    }
                                />
                                <ValueView value={formatDateTime(parsedSnapshot['created_at'])} />
                            </div>
                        </div>

                        {/* part 1 : maklumat utama */}
                        <div className='uppercase text-sm font-bold text-gray-50 rounded bg-gray-950 p-1.5'>Maklumat Umum</div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_id_num"
                                    value={
                                        <>
                                            No. Pendaftaran
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_id_num']} />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_type"
                                    value={
                                        <>
                                            Jenis Entiti
                                        </>
                                    }
                                />
                                <div className='text-md font-semibold'>
                                    {parsedSnapshot['vendor_type'] === 'company' && ('Syarikat ')}
                                    {parsedSnapshot['vendor_type'] === 'gov_entity' && ('Perbadanan / Entiti Kerajaan')}
                                    {parsedSnapshot['vendor_type'] === 'cooperation' && ('Koperasi')}
                                    {parsedSnapshot['vendor_type'] === 'organisation' && ('Pertubuhan / Kelab')}
                                    {parsedSnapshot['vendor_company_type'] === 'bhd' && ('Berhad')}
                                    {parsedSnapshot['vendor_company_type'] === 'sdn-bhd' && ('Sendirian Berhad')}
                                    {parsedSnapshot['vendor_company_type'] === 'partnership' && ('Perkongsian')}
                                    {parsedSnapshot['vendor_company_type'] === 'sole-ownership' && ('Milikan Tunggal')}
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_establishment_date"
                                    value={
                                        <>
                                            Tarikh Penubuhan
                                        </>
                                    }
                                />
                                <ValueView value={formatDate(parsedSnapshot['vendor_establishment_date'])} />
                            </div>
                        </div>
                        <div className='grid flex-1 gap-2 md:grid-cols-1 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_address"
                                    className=''
                                    value={
                                        <>
                                           Alamat Surat Menyurat
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_address']} />
                            </div>
                        </div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_website"
                                    value={
                                        <>
                                            Laman Web
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_website']} />
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_email"
                                    value={
                                        <>
                                            E-Mel
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_email']} />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_phone"
                                    value={
                                        <>
                                            Nombor Telefon Pejabat
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_phone']} />
                            </div>
                        </div>
                        <div className='grid flex-1 gap-2 md:grid-cols-2 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_bumiputera_ownership_percent"
                                    value={
                                        <>
                                            Peratus Pemilikan Bumiputera
                                        </>
                                    }
                                />
                                <ValueView value={`${parsedSnapshot['vendor_bumiputera_ownership_percent']}%`} />
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_non_bumiputera_ownership_percent"
                                    value={
                                        <>
                                            Peratus Pemilikan Bukan Bumiputera / Luar Negara
                                        </>
                                    }
                                />
                                <ValueView value={`${parsedSnapshot['vendor_non_bumiputera_ownership_percent']}%`} />
                            </div>
                            
                        </div>

                        {/* part 2 : maklumat pegawai untuk dihubungi */}
                        <div className='uppercase text-sm font-bold text-gray-50 rounded bg-gray-950 p-1.5'>Maklumat Pegawai Untuk Dihubungi</div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_contact_person"
                                    value={
                                        <>
                                            Nama Pegawai
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_contact_person']} />
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_contact_person_designation"
                                    value={
                                        <>
                                            Jawatan Pegawai
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_contact_person_designation']} />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_contact_person_phone"
                                    value={
                                        <>
                                            Nombor Telefon Pegawai
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_contact_person_phone']} />
                            </div>
                        </div>

                        {/* part 3 : maklumat kewangan */}
                        <div className='uppercase text-sm font-bold text-gray-50 rounded bg-gray-950 p-1.5'>Maklumat Kewangan</div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_bank_name"
                                    value={
                                        <>
                                            Nama Bank
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_bank_name']} /> {!parsedSnapshot['vendor_bank_name'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_bank_account_number"
                                    value={
                                        <>
                                            Nombor Akaun Bank
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_bank_account_number']} />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_bank_account_statement_address"
                                    value={
                                        <>
                                            Penyata Kewangan Terkini
                                        </>
                                    }
                                />
                                {parsedSnapshot['vendor_bank_account_statement_address'] ? (
                                    <VendorApprovalAttachmentViewer title="Penyata Kewangan Terkini" attachment_address={bank_statements_attachment_url} />
                                ) : (
                                    <div> - </div>
                                )}
                            </div>
                        </div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_sst_number"
                                    value={
                                        <>
                                            No. Pendaftaran SST
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_sst_number']} /> {!parsedSnapshot['vendor_sst_number'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_tax_identification_num"
                                    value={
                                        <>
                                           No. TIN
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_tax_identification_num']} />{!parsedSnapshot['vendor_tax_identification_num'] && (<span className=''> -</span>)}
                            </div>
                        </div>

                        {/* part 4 : maklumat perlesenan & pematuhan */}
                        <div className='uppercase text-sm font-bold text-gray-50 rounded bg-gray-950 p-1.5'>Maklumat Perlesenan & Pematuhan</div>
                        
                        {/* eperolehan / mof */}
                        <div className='uppercase text-xs font-bold text-gray-700 rounded py-1.5 pt-4'>ePerolehan / Sijil Kementerian Kewangan (MOF)</div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_MOF_reg_num"
                                    value={
                                        <>
                                            No. Pendaftaran
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_MOF_reg_num']} /> {!parsedSnapshot['vendor_MOF_reg_num'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_MOF_start_date"
                                    value={
                                        <>
                                            Tempoh Sah Laku
                                        </>
                                    }
                                />
                                <div className='flex items-center'>
                                    <ValueView value={formatDate(parsedSnapshot['vendor_MOF_start_date'])} />{!parsedSnapshot['vendor_MOF_start_date'] && (<span className=''>-</span>)} {parsedSnapshot['vendor_MOF_start_date'] && (<span className=''>-</span>)}<ValueView value={formatDate(parsedSnapshot['vendor_MOF_expiry_date'])} />{!parsedSnapshot['vendor_MOF_expiry_date'] && (<span className=''></span>)}
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_MOF_attachment_address"
                                    value={
                                        <>
                                            Sijil ePerolehan / MOF
                                        </>
                                    }
                                />
                                {parsedSnapshot['vendor_MOF_attachment_address'] ? (
                                    <VendorApprovalAttachmentViewer title="Sijil ePerolehan / MOF" attachment_address={MOF_attachment_url} />
                                ) : (
                                    <div> - </div>
                                ) }
                            </div>
                        </div>

                        {/* pusat khidmat kontraktor */}
                        <>
                        <div className='uppercase text-xs font-bold text-gray-700 rounded py-1.5 pt-4'>Pusat Khidmat Kontraktor (PKK)</div>
                        <div className='grid flex-1 gap-2 md:grid-cols-4 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_PKK_reg_num"
                                    value={
                                        <>
                                            No. Pendaftaran
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_PKK_reg_num']} /> {!parsedSnapshot['vendor_PKK_reg_num'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_PKK_start_date"
                                    value={
                                        <>
                                            Tempoh Sah Laku
                                        </>
                                    }
                                />
                                <div className='flex items-center'>
                                    <ValueView value={formatDate(parsedSnapshot['vendor_PKK_start_date'])} />{!parsedSnapshot['vendor_PKK_start_date'] && (<span className=''>-</span>)} {parsedSnapshot['vendor_PKK_start_date'] && (<span className=''>-</span>)}<ValueView value={formatDate(parsedSnapshot['vendor_PKK_end_date'])} />{!parsedSnapshot['vendor_PKK_end_date'] && (<span className=''></span>)}
                                </div>
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_PKK_class"
                                    value={
                                        <>
                                            Kelas & Kepala PKK
                                        </>
                                    }
                                />
                                <div className='flex items-center'>
                                    <ValueView value={parsedSnapshot['vendor_PKK_class']} />{!parsedSnapshot['vendor_PKK_class'] && (<span className=''>-</span>)} <ValueView value={parsedSnapshot['vendor_PKK_head']} />{!parsedSnapshot['vendor_PKK_head'] && (<span className=''></span>)}
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_PKK_attachment_address"
                                    value={
                                        <>
                                            Sijil PKK
                                        </>
                                    }
                                />
                                {parsedSnapshot['vendor_PKK_attachment_address'] ? (
                                    <VendorApprovalAttachmentViewer title="Sijil PKK" attachment_address={PKK_attachment_url} />
                                ) : (
                                    <div> - </div>
                                ) }
                            </div>
                        </div>
                        </>

                        {/* cidb */}
                        <>
                        <div className='uppercase text-xs font-bold text-gray-700 rounded py-1.5 pt-4'>Lembaga Pembangunan Industri Pembinaan Malaysia (CIDB)</div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_CIDB_reg_num"
                                    value={
                                        <>
                                            No. Pendaftaran
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_CIDB_reg_num']} /> {!parsedSnapshot['vendor_CIDB_reg_num'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_CIDB_start_date"
                                    value={
                                        <>
                                            Tempoh Sah Laku
                                        </>
                                    }
                                />
                                <div className='flex items-center'>
                                    <ValueView value={formatDate(parsedSnapshot['vendor_CIDB_start_date'])} />{!parsedSnapshot['vendor_CIDB_start_date'] && (<span className=''>-</span>)} {parsedSnapshot['vendor_CIDB_start_date'] && (<span className=''>-</span>)}<ValueView value={formatDate(parsedSnapshot['vendor_CIDB_end_date'])} />{!parsedSnapshot['vendor_CIDB_end_date'] && (<span className=''></span>)}
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_PKK_attachment_address"
                                    value={
                                        <>
                                            Sijil CIDB
                                        </>
                                    }
                                />
                                {parsedSnapshot['vendor_CIDB_attachment_address'] ? (
                                    <VendorApprovalAttachmentViewer title="Sijil CIDB" attachment_address={CIDB_attachment_url} />
                                ) : (
                                    <div> - </div>
                                ) }
                            </div>
                        </div>
                        <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_CIDB_B_cat_grade"
                                    value={
                                        <>
                                            Gred Kategori B
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_CIDB_B_cat_grade']} /> {!parsedSnapshot['vendor_CIDB_B_cat_grade'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_CIDB_CE_cat_grade"
                                    value={
                                        <>
                                            Gred Kategori CE
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_CIDB_CE_cat_grade']} /> {!parsedSnapshot['vendor_CIDB_CE_cat_grade'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_CIDB_ME_cat_grade"
                                    value={
                                        <>
                                            Gred Kategori ME
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_CIDB_ME_cat_grade']} /> {!parsedSnapshot['vendor_CIDB_ME_cat_grade'] && (<span className=''> -</span>)}
                            </div>
                        </div>
                        </>

                        {/* mpob */}
                        <>
                        <div className='uppercase text-xs font-bold text-gray-700 rounded py-1.5 pt-4'>Lembaga Minyak Sawit Malaysia (MPOB)</div>
                        <div className='grid flex-1 gap-2 md:grid-cols-4 my-2'>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_MPOB_license_num"
                                    value={
                                        <>
                                            No. Lesen MPOB
                                        </>
                                    }
                                />
                                <ValueView value={parsedSnapshot['vendor_MPOB_license_num']} /> {!parsedSnapshot['vendor_MPOB_license_num'] && (<span className=''> -</span>)}
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_MPOB_start_date"
                                    value={
                                        <>
                                            Tempoh Sah Laku
                                        </>
                                    }
                                />
                                <div className='flex items-center'>
                                    <ValueView value={formatDate(parsedSnapshot['vendor_MPOB_start_date'])} />{!parsedSnapshot['vendor_MPOB_start_date'] && (<span className=''>-</span>)} {parsedSnapshot['vendor_MPOB_start_date'] && (<span className=''>-</span>)}<ValueView value={formatDate(parsedSnapshot['vendor_MPOB_end_date'])} />{!parsedSnapshot['vendor_MPOB_end_date'] && (<span className=''></span>)}
                                </div>
                            </div>
                            <div className=''>
                                <InputLabel
                                    htmlFor="vendor_MPOB_license_category"
                                    value={
                                        <>
                                            Kategori Lesen MPOB
                                        </>
                                    }
                                />
                                <div className='flex items-center'>
                                    <ValueView value={parsedSnapshot['vendor_MPOB_license_category']} />{!parsedSnapshot['vendor_MPOB_license_category'] && (<span className=''>-</span>)}
                                </div>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="vendor_MPOB_attachment_address"
                                    value={
                                        <>
                                            Lesen MPOB
                                        </>
                                    }
                                />
                                
                                {parsedSnapshot['vendor_MPOB_attachment_address'] ? (
                                    <VendorApprovalAttachmentViewer title="Lesen MPOB" attachment_address={MPOB_attachment_url} />
                                    
                                ) : (
                                    <div> - </div>
                                ) }
                            </div>
                        </div>
                        </>
                    </div>


                </div>
            </div>
        </AuthenticatedLayout>
    );
}
