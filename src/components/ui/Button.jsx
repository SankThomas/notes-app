import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}) {
  const { currentTheme } = useTheme();

  const variants = {
    primary: `bg-${currentTheme.primary} hover:bg-${currentTheme.primaryHover} text-white`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-900`,
    ghost: `hover:bg-gray-100 text-gray-700`,
    danger: `bg-red-600 hover:bg-red-700 text-white`,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
