import clsx from "clsx";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "accent" | "error";
    loading?: boolean;
    size?: "md" | "lg" | "sm";
}

const Button = ({
    children,
    className,
    loading,
    variant = "primary",
    size = "sm",
    ...props
}: IProps) => {
    const variantClass = {
        primary: "btn-primary",
        accent: "btn-accent",
        error: "btn-error"
    }[variant];

    const sizeClass = {
        sm: "btn-sm",
        md: "btn-md",
        lg: "btn-lg",
    }[size];

    return (
        <button
            {...props}
            className={clsx("btn max-w-fit", variantClass, sizeClass, className)}
        >
            {loading ? <span className="loading loading-dots" /> : children}
        </button>
    );
};

export default Button;
