import { formatDate } from "../lib/utils";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";
import { NotepadText } from "lucide-react";

export function NotesList({
  notes = [],
  selectedNote,
  onSelectNote,
  searchQuery,
  isLoading = false,
}) {
  const { currentTheme } = useTheme();

  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const getPreview = (content) => {
    // Strip HTML tags and get first 100 characters
    const text = content.replace(/<[^>]*>/g, "").trim();
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="mb-2 h-3 w-1/2 rounded bg-gray-200"></div>
              <div className="h-3 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <NotepadText />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No notes found
          </h3>
          <p className="text-gray-400">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Create your first note to get started"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full space-y-3 overflow-y-auto p-4">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={cn(
              "cursor-pointer rounded-lg border border-gray-200 p-4 transition-all duration-200",
              "hover:border-gray-300",
              selectedNote?.id === note.id
                ? `border-${currentTheme.primary} bg-${currentTheme.primaryLight}`
                : "bg-white",
            )}
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="flex-1 truncate font-medium text-gray-900">
                {highlightText(note.title || "Untitled", searchQuery)}
              </h3>
              {note.archived && (
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  Archived
                </span>
              )}
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 text-xs bg-${currentTheme.accent} text-${currentTheme.primary} rounded-full`}
                  >
                    {highlightText(tag, searchQuery)}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{note.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <p className="mb-2 line-clamp-2 text-sm text-gray-600">
              {highlightText(getPreview(note.content || ""), searchQuery)}
            </p>

            <p className="text-xs text-gray-500">
              {formatDate(note.updated_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
