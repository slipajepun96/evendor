export default function ValueView({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-md font-semibold text-gray-900 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
