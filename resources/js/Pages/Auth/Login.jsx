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
    {/* Arctic Lights Background with Top Glow */}
            <div
            className="absolute inset-0 z-0"
            style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000",
            }}
            />
            
                {/* Your Content/Components */}

                <div className="bg-gradient-to-tr from-sky-400 to-sky-700 text-white">
                    <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                        <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                            <main className="mt-6">
                                <section class="">
                                    <div className=" py-2 md:py-8 px-2 md:mx-auto md:max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
                                        <div className="flex flex-col justify-center">
                                            <h1 className=" text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">E-Vendor</h1>
                                            <p className="text-lg font-normal text-white lg:text-xl">PKPP Agro Sdn. Bhd.</p>
                                            <p className='uppercase rounded-lg bg-green-700 px-1.5 py-0.5 font-bold w-fit'>Pentadbir</p>
                                        </div>
                                        <div>
                                            <div className="w-full lg:max-w-xl md:p-6 space-y-2 md:space-y-8 sm:p-8 md:bg-gray-800 rounded-lg md:shadow-xl">
                                                <h2 class="text-2xl font-bold text-white">
                                                    Log Masuk Pentadbir
                                                </h2>

                                                <form class="md:mt-8 md:space-y-6 space-y-2 " action="#" onSubmit={submit}>
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
                                                    <div className="flex items-start">
                                                        <div className="mt-4 block">
                                                            <label className="flex items-center">
                                                                <Checkbox
                                                                    name="remember"
                                                                    checked={data.remember}
                                                                    onChange={(e) =>
                                                                        setData('remember', e.target.checked)
                                                                    }
                                                                />
                                                                <span className="ms-2 text-sm text-gray-200">
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
                            <footer className="text-center text-sm text-white border-t py-4 w-full">
                                    <>
                                        <Link
                                            href={route('welcome')}
                                            className="rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-white/70 focus:outline-none focus-visible:ring-[#FF2D20] hover:underline focus-visible:underline"
                                        >
                                            Kembali ke Halaman Utama
                                        </Link>
                                    </>
                            | PKPP Agro Sdn Bhd © 2025 Hak Cipta Terpelihara
                            </footer>
                        </div>
                    </div>
                </div>
        </>
    );
}
