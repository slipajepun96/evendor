<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600&display=swap" rel="stylesheet" />

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
            <div class="mt-6">
                <div class="uppercase text-sm font-semibold">Bahagian 1 : Maklumat Vendor</div>
                <div>Nama Vendor: {{ $vendor_json['vendor_name'] ?? 'N/A' }}</div>
            </div>
           
        </div>
    </body>
</html>