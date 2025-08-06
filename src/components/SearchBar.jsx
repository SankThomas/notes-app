import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../lib/utils";

export function SearchBar({ onSearch, placeholder = "Search notes..." }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border border-gray-200 py-2 pr-10 pl-10",
          "placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
          "transition-all duration-200",
        )}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
