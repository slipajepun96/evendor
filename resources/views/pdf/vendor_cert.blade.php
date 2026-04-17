<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <!-- <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600&display=swap" rel="stylesheet" /> -->

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <!-- <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"> -->
        <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> -->

        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            sans: ['Inter', 'sans-serif'],
                        }
                    }
                }
            }
        </script>
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Scripts -->
        <style>
            /* body {
                background-image: url('{{ public_path('logo/logo-small.png') }}');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 50%;
                background-attachment: fixed;
            } */
            @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            body, * {
                font-family: 'Inter', sans-serif !important;
            }

            body {
                font-family: 'Inter', sans-serif;
            }
            
            .background-overlay {
                position: relative;
            }
            
            .background-overlay::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: url('{{ public_path('logo/logo-small.png') }}');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 50%;
                opacity: 0.1;
                z-index: -1;
            }
        </style>
        @routes
    </head>
    <body class="font-sans antialiased m-10">
        <?php 
            function formatDate($date) {
                return \Carbon\Carbon::parse($date)->locale('ms')->isoFormat('D MMMM YYYY');
            }

            $formatter = new NumberFormatter('en_MY', NumberFormatter::CURRENCY);
        ?>
        <div class="background-overlay relative z-10">
            <img src="{{ public_path('logo/logo-small.png') }}" alt="PKPP Logo" class="w-32 mb-4">
            <div class="uppercase font-bold text-lg">Perakuan Pendaftaran Vendor Di Sistem E-Vendor PKPP Agro</div>
            <div class="text-2xl font-bold mt-6"> {{ $vendor_json['vendor_name'] ?? 'N/A' }}</div>
            <div class="text-md font-bold mb-4"> 
                @if($vendor_json['vendor_type'] == 'company')
                    No. Pendaftaran Syarikat : 
                @elseif($vendor_json['vendor_type'] == 'cooperation')
                    No. Pendaftaran Koperasi :
                @elseif($vendor_json['vendor_type'] == 'organisation')
                    No. Pendaftaran Pertubuhan :
                @endif

                @if($vendor_json['vendor_type'] != 'gov_entity')
                    {{ $vendor_json['vendor_id_num'] ?? 'N/A' }}
                @endif

                @if(isset($vendor_json['vendor_id_num_2']))
                    @if($vendor_json['vendor_type'] == 'company')
                        ({{ strtoupper($vendor_json['vendor_id_num_2'] ?? 'N/A') }})
                    @endif
                @endif  
                
                
            </div>
            {{-- <div> UUID Vendor : {{ $vendor_json['vendor_id_num'] ?? 'N/A' }}</div> --}}
            {{-- <div>{{ $certificate->cert_start_date }} - {{ $certificate->cert_end_date }}</div> --}}
            <div>telah berdaftar dan disahkan sebagai vendor kepada PKPP Agro Sdn. Bhd. pada {{ formatDate($certificate->cert_start_date) }} dan dibenarkan menyertai tender-tender yang dibuka oleh PKPP Agro Sdn. Bhd. . Perakuan ini adalah sah selama <b>{{ $certificate->cert_validity_period }} tahun</b> sehingga <b>{{ formatDate($certificate->cert_end_date) }}</b>. </div>

            {{-- qr code --}}
            <div class="mt-6">
                Imbas Kod QR untuk melihat perakuan ini secara digital: 
                {!! $qrCode !!}
            </div>
            
            
            <div class="mt-6 uppercase text-sm font-semibold"> Tarikh Perakuan Dikeluarkan: {{ formatDate($certificate->cert_start_date) }}</div>
            <div class="text-sm font-semibold"> UUID VENDOR: {{ $vendor_json['id'] }}</div>
        </div>
        @pageBreak
        <div class="mt-10">
            <div class="text-2xl font-bold">Profil Vendor</div>
            <div class="mt-6 text-xs">
                <div class="uppercase text-xs font-semibold bg-gray-900 text-white py-1 px-2">Bahagian 1 : Maklumat Vendor</div>
                <div class="grid grid-cols-3">
                    <div class="mt-2">
                        <div class="text-xs font-medium">Nama Vendor</div>
                        <div class="font-bold">{{ $vendor_json['vendor_name'] ?? 'N/A' }}</div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">No. Pendaftaran Syarikat</div>
                        @if($vendor_json['vendor_type'] === 'company')
                            <div class="font-bold">{{ $vendor_json['vendor_id_num'] ?? 'N/A' }} ({{ strtoupper($vendor_json['vendor_id_num_2'] ?? 'N/A') }})</div>
                        @else
                            <div class="font-bold">{{ $vendor_json['vendor_id_num'] ?? 'N/A' }}</div>
                        @endif
                        </div>
                    </div>
                    
                </div>
                <div class="grid grid-cols-3 text-xs">
                    <div class="mt-2">
                        <div class="text-xs font-medium">Jenis Entiti</div>
                        <div class="font-bold">
                            @if($vendor_json['vendor_type'] == 'company')
                                Syarikat 
                                @if($vendor_json['vendor_company_type'] === 'bhd')
                                    Berhad
                                @elseif($vendor_json['vendor_company_type'] === "sdn-bhd")
                                    Sendirian Berhad
                                @elseif($vendor_json['vendor_company_type'] === 'partnership')
                                    Perkongsian
                                @elseif($vendor_json['vendor_company_type'] === 'sole-ownership')
                                    Milikan Tunggal
                                @endif
                            @elseif($vendor_json['vendor_type'] == 'cooperation')
                                Koperasi
                            @elseif($vendor_json['vendor_type'] == 'gov_entity')
                                Perbadanan / Entiti Kerajaan
                            @elseif($vendor_json['vendor_type'] == 'organisation')
                                Pertubuhan / Kelab
                            @endif
                        </div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">Tarikh Penubuhan</div>
                        <div class="font-bold">{{ formatDate($vendor_json['vendor_establishment_date'] ?? 'N/A') }}</div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">Alamat Surat Menyurat</div>
                        <div class="font-bold">{{ $vendor_json['vendor_address'] ?? 'N/A' }}</div>
                    </div>
                </div>

                <div class="grid grid-cols-3 text-xs">
                    <div class="mt-2">
                        <div class="text-xs font-medium">Laman Web</div>
                        <div class="font-bold">{{ $vendor_json['vendor_website'] ?? 'N/A' }}</div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">E-Mel</div>
                        <div class="font-bold">{{ $vendor_json['vendor_email'] ?? 'N/A' }}</div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">No. Telefon Pejabat</div>
                        <div class="font-bold">{{ $vendor_json['vendor_phone'] ?? 'N/A' }}</div>
                    </div>
                </div>

                <div class="grid grid-cols-2">
                    <div class="mt-2">
                        <div class="text-xs font-medium">Pemilikan Bumiputera</div>
                        <div class="font-bold">{{ $vendor_json['vendor_bumiputera_ownership_percent'] ?? 'N/A' }} %</div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">Pemilikan Bukan Bumiputera / Entiti Asing</div>
                        <div class="font-bold">{{ $vendor_json['vendor_non_bumiputera_ownership_percent'] ?? 'N/A' }} %</div>
                    </div>
                </div>
                @if(isset($vendor_json['vendor_type']) && ($vendor_json['vendor_type'] === 'company' || $vendor_json['vendor_type'] === 'cooperation'))
                <div class="grid grid-cols-2">
                    <div class="mt-2">
                        <div class="text-xs font-medium">@if($vendor_json['vendor_type'] === 'company') Modal Dibenar @elseif($vendor_json['vendor_type'] === 'cooperation') Modal Yuran @endif</div>
                        <div class="font-bold">{{ $formatter->formatCurrency($vendor_json['vendor_capital_1'] ?? 0, 'MYR') }} </div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">@if($vendor_json['vendor_type'] === 'company') Modal Dibayar @elseif($vendor_json['vendor_type'] === 'cooperation') Modal Syer @endif</div>
                        <div class="font-bold">{{ $formatter->formatCurrency($vendor_json['vendor_capital_2'] ?? 0, 'MYR') }} </div>
                    </div>
                </div>
                @endif
            </div>
            <div class="mt-6 text-xs">
                <div class="uppercase text-xs font-semibold bg-gray-900 text-white py-1 px-2">Bahagian 2 : Maklumat Pegawai Dilantik Untuk Dihubungi</div>
                <div class="grid grid-cols-3">
                    <div class="mt-2">
                        <div class="text-xs font-medium">Nama Pegawai Dilantik</div>
                        <div class="font-bold">{{ $vendor_json['vendor_contact_person'] ?? 'N/A' }}</div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">Jawatan Pegawai Dilantik</div>
                        <div class="font-bold">{{ $vendor_json['vendor_contact_person_designation'] ?? 'N/A' }}</div>
                    </div>
                    <div class="mt-2">
                        <div class="text-xs font-medium">No. Telefon Pegawai Dilantik</div>
                        <div class="font-bold">{{ $vendor_json['vendor_contact_person_phone'] ?? 'N/A' }}</div>
                    </div>
                </div>
            </div>

            <div class="mt-6 text-xs">
                <div class="uppercase text-xs font-semibold bg-gray-900 text-white py-1 px-2">Bahagian 3 : Lembaga Pengarah / Pemilik</div>
                <table class="mt-2 border w-full text-xs">
                    <thead>
                        <tr>
                            <th class="border px-2 py-1">Nama Pengarah / Pemilik</th>
                            <th class="border px-2 py-1">Jawatan</th>
                            <th class="border px-2 py-1">Butiran Lanjut</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($boardDirectors as $director)
                            <tr>
                                <td class="border px-2 py-1">
                                    <p class="font-bold ">{{ $director->vendor_board_name ?? 'N/A' }}</p>
                                    <p>{{ $director->vendor_board_ic_num ? 'No. KP / Pasport : ' . $director->vendor_board_ic_num : 'Tiada No. KP' }}</p>
                                </td>
                                <td class="border px-2 py-1">
                                    <p>{{ $director->vendor_board_position ?? 'N/A' }}</p>
                                </td>
                                <td class="border px-2 py-1">
                                    <p>No Telefon : {{ $director->vendor_board_phone_num ?? 'N/A' }}</p>
                                    <p>Kewarganegaraan : {{ $director->vendor_board_citizenship ==="malaysian" ? "Warganegara" : 'Bukan Warganegara' }}</p>
                                    @if($director->vendor_board_citizenship ==="malaysian")
                                        <p>Bangsa : {{ $director->vendor_board_ethnic ==="bumiputera" ? "Bumiputera" : "Bukan Bumiputera" }}</p>
                                    @endif
                                    <p>Alamat : {{ $director->vendor_board_address ?? 'N/A' }}</p>
                                    <p>Pekerjaan Lain : {{ $director->vendor_board_actual_outside_jobs ?? 'N/A' }}</p>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        @pageBreak
        <div class="mt-10">
                <div class="mt-6 text-xs">
                    <div class="uppercase text-xs font-semibold bg-gray-900 text-white py-1 px-2">Bahagian 4 : Maklumat Kewangan</div>
                    <div class="grid grid-cols-3">
                        <div class="mt-2">
                            <div class="text-xs font-medium">Nama Bank</div>
                            <div class="font-bold">{{ $vendor_json['vendor_bank_name'] ?? 'N/A' }}</div>
                        </div>
                        <div class="mt-2">
                            <div class="text-xs font-medium">No. Akaun Bank</div>
                            <div class="font-bold">{{ $vendor_json['vendor_bank_account_number'] ?? 'N/A' }}</div>
                        </div>
                        <div class="mt-2">
                            <div class="text-xs font-medium">No. Pendaftaran Entiti Di Bank</div>
                            <div class="font-bold">{{ $vendor_json['vendor_bank_entity_registration_num'] ?? 'N/A' }}</div>
                        </div>
                        <div class="mt-2">
                            <div class="text-xs font-medium">No. Pendaftaran SST</div>
                            <div class="font-bold">{{ $vendor_json['vendor_sst_number'] ?? 'N/A' }}</div>
                        </div>
                        <div class="mt-2">
                            <div class="text-xs font-medium">No. TIN LHDN</div>
                            <div class="font-bold">{{ $vendor_json['vendor_tax_identification_num'] ?? 'N/A' }}</div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 text-xs">
                    <div class="uppercase text-xs font-semibold bg-gray-900 text-white py-1 px-2">Bahagian 5 : Maklumat Perlesenan</div>
                    <div>
                        <div class="uppercase text-xs font-semibold underline mt-2">E-Perolehan / Sijil Kementerian Kewangan</div>
                        <div class="grid grid-cols-3">
                            <div class="mt-2">
                                <div class="text-xs font-medium">No. Pendaftaran</div>
                                <div class="font-bold">{{ $vendor_json['vendor_MOF_reg_num'] ?? 'N/A' }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Tempoh Sah Laku</div>
                                @if($vendor_json['vendor_MOF_start_date'] && $vendor_json['vendor_MOF_expiry_date'])
                                    <div class="font-bold">{{ $vendor_json['vendor_MOF_start_date'] ?? 'N/A' }} - {{ $vendor_json['vendor_MOF_expiry_date'] ?? 'N/A' }}</div>
                                @else
                                    <div class="font-bold">N/A</div>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="uppercase text-xs font-semibold underline mt-2">Pusat Khidmat Kontraktor</div>
                        <div class="grid grid-cols-3">
                            <div class="mt-2">
                                <div class="text-xs font-medium">No. Pendaftaran</div>
                                <div class="font-bold">{{ $vendor_json['vendor_PKK_reg_num'] ?? 'N/A' }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Tempoh Sah Laku</div>
                                @if($vendor_json['vendor_PKK_start_date'] && $vendor_json['vendor_PKK_end_date'])
                                    <div class="font-bold">{{ $vendor_json['vendor_PKK_start_date'] ?? 'N/A' }} - {{ $vendor_json['vendor_PKK_end_date'] ?? 'N/A' }}</div>
                                @else
                                    <div class="font-bold">N/A</div>
                                @endif
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Kelas & Kepala PKK</div>
                                <div class="font-bold">{{ $vendor_json['vendor_PKK_class'] ?? 'N/A' }} {{ $vendor_json['vendor_PKK_head'] ?? 'N/A' }}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="uppercase text-xs font-semibold underline mt-2">Lembaga Pembangunan Industri Pembinaan Malaysia (CIDB)</div>
                        <div class="grid grid-cols-3">
                            <div class="mt-2">
                                <div class="text-xs font-medium">No. Pendaftaran</div>
                                <div class="font-bold">{{ $vendor_json['vendor_CIDB_reg_num'] ?? 'N/A' }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Tempoh Sah Laku</div>
                                @if($vendor_json['vendor_CIDB_start_date'] && $vendor_json['vendor_CIDB_end_date'])
                                    <div class="font-bold">{{ $vendor_json['vendor_CIDB_start_date'] ?? 'N/A' }} - {{ $vendor_json['vendor_CIDB_end_date'] ?? 'N/A' }}</div>
                                @else
                                    <div class="font-bold">N/A</div>
                                @endif
                            </div>
                        </div>
                        <div class="grid grid-cols-3">
                            <div class="mt-2">
                                <div class="text-xs font-medium">Gred Kategori B</div>
                                <div class="font-bold">{{ $vendor_json['vendor_CIDB_B_cat_grade'] ?? 'N/A' }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Gred Kategori CE</div>
                                <div class="font-bold">{{ $vendor_json['vendor_CIDB_CE_cat_grade'] ?? 'N/A' }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Gred Kategori ME</div>
                                <div class="font-bold">{{ $vendor_json['vendor_CIDB_ME_cat_grade'] ?? 'N/A' }}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="uppercase text-xs font-semibold underline mt-2">Lembaga Minyak Sawit Malaysia (MPOB)</div>
                        <div class="grid grid-cols-3">
                            <div class="mt-2">
                                <div class="text-xs font-medium">No. Lesen MPOB</div>
                                <div class="font-bold">{{ $vendor_json['vendor_MPOB_license_num'] ?? 'N/A' }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Tempoh Sah Laku</div>
                                @if($vendor_json['vendor_MPOB_start_date'] && $vendor_json['vendor_MPOB_end_date'])
                                    <div class="font-bold">{{ $vendor_json['vendor_MPOB_start_date'] ?? 'N/A' }} - {{ $vendor_json['vendor_MPOB_end_date'] ?? 'N/A' }}</div>
                                @else
                                    <div class="font-bold">N/A</div>
                                @endif
                            </div>
                            <div class="mt-2">
                                <div class="text-xs font-medium">Kategori Lesen</div>
                                <div class="font-bold">{{ $vendor_json['vendor_MPOB_license_category'] ?? 'N/A' }}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
           
        </div>
    </body>
</html>