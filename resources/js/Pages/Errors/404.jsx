import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Head title="404 - Halaman Tidak Dijumpai" />
            
            <div className="text-center px-4">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>
                <h2 className="text-3xl font-semibold text-gray-700 mt-4">
                    Halaman Tidak Dijumpai
                </h2>
                <p className="text-gray-600 mt-4 mb-8">
                    Maaf, halaman yang anda cari tidak wujud atau telah dialihkan.
                </p>
                
                <Link href={route('dashboard')}>
                    <PrimaryButton>
                        Kembali ke Halaman Utama
                    </PrimaryButton>
                </Link>
            </div>
        </div>
    );
}
