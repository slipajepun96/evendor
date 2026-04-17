import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center text-md font-medium transition duration-150 ease-in-out ' +
                (active
                    ? 'text-white underline underline-offset-8 decoration-2 decoration-white'
                    : 'border-transparent text-gray-200 hover:border-gray-300 hover:text-gray-100 focus:border-gray-300 focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
