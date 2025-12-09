import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {/* <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

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

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form> */}
                        <div className="bg-gradient-to-tr from-sky-400 to-sky-700 text-white">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">

                        <main className="mt-6">
                            <section class="">
                                <div class=" py-2 md:py-8 px-2 md:mx-auto md:max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
                                    <div class="flex flex-col justify-center">
                                        <h1 class="mb-2 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">E-Vendor</h1>
                                        <p class="mb-6 text-lg font-normal text-white lg:text-xl">PKPP Agro Sdn. Bhd.</p>
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
                                        <div class="w-full lg:max-w-xl md:p-6 md:space-y-8 sm:p-8 md:bg-gray-800 rounded-lg md:shadow-xl">
                                            <h2 class="text-2xl font-bold text-white">
                                                Log Masuk Pentadbir
                                            </h2>

                                            <form class="md:mt-8 md:space-y-6" action="#" onSubmit={submit}>
                                                <div>
                                                    <InputLabel htmlFor="email" value="E-Mel" className='text-white' />

                                                    <TextInput
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        value={data.email}
                                                        className="mt-1 block w-full text-black"
                                                        autoComplete="email"
                                                        isFocused={true}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                    />

                                                    <InputError message={errors.email} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="password" value="Kata Laluan" className='text-white' />

                                                    <TextInput
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        value={data.password}
                                                        className="mt-1 block w-full text-black"
                                                        autoComplete="current-password"
                                                        onChange={(e) => setData('password', e.target.value)}
                                                    />

                                                    <InputError message={errors.password} className="mt-2" />
                                                </div>
                                                <div class="flex items-start">
                                                    <div className="mt-4 block">
                                                        <label className="flex items-center">
                                                            <Checkbox
                                                                name="remember"
                                                                checked={data.remember}
                                                                onChange={(e) =>
                                                                    setData('remember', e.target.checked)
                                                                }
                                                            />
                                                            <span className="ms-2 text-sm text-gray-600">
                                                                Remember me
                                                            </span>
                                                        </label>
                                                    </div>
                                                    {/* <a href="#" class="ms-auto text-sm font-medium text-blue-600 hover:underline ">Lost Password?</a> */}
                                                </div>

                                                <PrimaryButton className="" disabled={processing}>
                                                    Log Masuk
                                                </PrimaryButton>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <footer className="text-center text-sm text-gray-200">
                            PKPP Agro Sdn Bhd © 2025 Hak Cipta Terpelihara
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
