import { cn } from "../../lib/utils";

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
        "placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
        "disabled:cursor-not-allowed disabled:bg-gray-50",
        error && "border-red-500 focus:ring-red-500",
        className,
      )}
      {...props}
    />
  );
}
