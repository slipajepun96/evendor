import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth, canResetPassword, status }) {
    const [formType, setFormType] = useState('login'); // 'login', 'register', or 'admin'

    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_contact_person: '',
        vendor_email: '',
        password: '',
        password_confirmation: '',
    });

    const switchForm = (type) => {
        reset();
        setFormType(type);
    };

    const submitLogin = (e) => {
        e.preventDefault();

        post(route('vendor.login.store'), {
            preserveScroll: true,
            preserveState: (page) => Object.keys(page.props.errors).length,
            onFinish: () => reset('password'),
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();

        post(route('vendor.register.store'), {
            preserveScroll: true,
            preserveState: (page) => Object.keys(page.props.errors).length,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">

                        <main className="mt-6">
                            <section className="sm:bg-white md:bg-gray-50">
                                <div className=" py-2 md:py-8 px-2 md:mx-auto md:max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
                                    <div className="flex flex-col justify-center">
                                        <h1 className="mb-2 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">E-Vendor</h1>
                                        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl">PKPP Agro Sdn. Bhd.</p>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <div className='bg-green-300  p-2 rounded-lg text-center text-green-700 font-semibold'>
                                                Selamat
                                            </div>
                                            <div className='bg-blue-300 p-2 rounded-lg text-center text-blue-700 font-semibold'>
                                                Terjamin
                                            </div>
                                            <div className='bg-yellow-300 p-2 rounded-lg text-center text-amber-500 font-semibold'>
                                                Tepat
                                            </div>
                                        </div>
                                        <div className='mt-4'>
                                            Daftar sebagai vendor PKPP Agro Sdn. Bhd. sebagai kelayakan untuk menyertai sebut harga & tender yang dibuka oleh PKPP Agro Sdn. Bhd.
                                        </div>
                                    </div>
                                    <div>
                                        <div className="w-full lg:max-w-xl md:p-6 md:space-y-8 sm:p-8 md:bg-white rounded-lg md:shadow-xl">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {formType === 'register' ? 'Daftar Sebagai Vendor' : formType === 'admin' ? 'Log Masuk Pentadbir' : 'Log Masuk Vendor'}
                                            </h2>

                                            {formType === 'login' ? (
                                                // Vendor Login Form
                                                <form className="md:mt-8 md:space-y-6" action="#" onSubmit={submitLogin}>
                                                    <div>
                                                        <InputLabel htmlFor="vendor_email" value="E-Mel" />

                                                        <TextInput
                                                            id="vendor_email"
                                                            type="email"
                                                            name="vendor_email"
                                                            value={data.vendor_email}
                                                            className="mt-1 block w-full text-gray-800"
                                                            autoComplete="vendor_email"
                                                            isFocused={true}
                                                            onChange={(e) => setData('vendor_email', e.target.value)}
                                                        />

                                                        <InputError message={errors.vendor_email} className="mt-2" />
                                                    </div>
                                                    <div>
                                                        <InputLabel htmlFor="password" value="Kata Laluan" />

                                                        <TextInput
                                                            id="password"
                                                            type="password"
                                                            name="password"
                                                            value={data.password}
                                                            className="mt-1 block w-full"
                                                            autoComplete="current-password"
                                                            onChange={(e) => setData('password', e.target.value)}
                                                        />

                                                        <InputError message={errors.password} className="mt-2" />
                                                    </div>

                                                    <PrimaryButton className="" disabled={processing}>
                                                        Log Masuk
                                                    </PrimaryButton>
                                                </form>
                                            ) : formType === 'register' ? (
                                                // Register Form
                                                <form className="md:mt-6 md:space-y-2" action="#" onSubmit={submitRegister}>
                                                    <div>
                                                        <InputLabel htmlFor="vendor_contact_person" value="Nama" />

                                                        <TextInput
                                                            id="vendor_contact_person"
                                                            name="vendor_contact_person"
                                                            value={data.vendor_contact_person}
                                                            className="mt-1 block w-full"
                                                            autoComplete="name"
                                                            isFocused={true}
                                                            onChange={(e) => setData('vendor_contact_person', e.target.value)}
                                                            required
                                                        />

                                                        <InputError message={errors.vendor_contact_person} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="vendor_email" value="E-Mel" />

                                                        <TextInput
                                                            id="vendor_email"
                                                            type="email"
                                                            name="vendor_email"
                                                            value={data.vendor_email}
                                                            className="mt-1 block w-full"
                                                            autoComplete="username"
                                                            onChange={(e) => setData('vendor_email', e.target.value)}
                                                            required
                                                        />

                                                        <InputError message={errors.vendor_email} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="password" value="Kata Laluan" />

                                                        <TextInput
                                                            id="password"
                                                            type="password"
                                                            name="password"
                                                            value={data.password}
                                                            className="mt-1 block w-full"
                                                            autoComplete="new-password"
                                                            onChange={(e) => setData('password', e.target.value)}
                                                            required
                                                        />

                                                        <InputError message={errors.password} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <InputLabel htmlFor="password_confirmation" value="Sahkan Kata Laluan" />

                                                        <TextInput
                                                            id="password_confirmation"
                                                            type="password"
                                                            name="password_confirmation"
                                                            value={data.password_confirmation}
                                                            className="mt-1 block w-full"
                                                            autoComplete="new-password"
                                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                                            required
                                                        />

                                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                                    </div>

                                                    <PrimaryButton className="" disabled={processing}>
                                                        Daftar
                                                    </PrimaryButton>
                                                </form>
                                            ) : ""
                                        }

                                            <div className="text-sm font-medium text-gray-900 border-t pt-4 mt-4">
                                                {formType === 'register' ? (
                                                    <>
                                                        Sudah mempunyai akaun?
                                                        <PrimaryButton
                                                            onClick={() => switchForm('login')}
                                                            className="text-blue-600 ml-2 cursor-pointer"
                                                        >
                                                            Log Masuk
                                                        </PrimaryButton>
                                                    </>
                                                ) : formType === 'admin' ? (
                                                    <>
                                                        <PrimaryButton
                                                            onClick={() => switchForm('login')}
                                                            className="text-blue-600 cursor-pointer"
                                                        >
                                                            Kembali ke Log Masuk Vendor
                                                        </PrimaryButton>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        <div>
                                                            Belum mendaftar?
                                                            <PrimaryButton
                                                                onClick={() => switchForm('register')}
                                                                className="text-blue-600 ml-2 cursor-pointer"
                                                            >
                                                                Daftar Sebagai Vendor PKPP Agro
                                                            </PrimaryButton>
                                                        </div>
                                                        
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <footer className="text-center text-sm text-black">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] hover:underline focus-visible:underline"
                                    >
                                        Log Masuk Pentadbir Sistem
                                    </Link>
                                </>
                            )}
                            
                        | PKPP Agro Sdn Bhd © 2025 Hak Cipta Terpelihara
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
