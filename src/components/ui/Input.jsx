import { cn } from "../../lib/utils";

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm",
        "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        "disabled:bg-gray-50 disabled:cursor-not-allowed",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
}
