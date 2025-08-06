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
      )
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
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <NotepadText />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
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
      <div className="h-full overflow-y-auto p-4 space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={cn(
              "p-4 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200",
              "hover:border-gray-300",
              selectedNote?.id === note.id
                ? `border-${currentTheme.primary} bg-${currentTheme.primaryLight}`
                : "bg-white"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900 truncate flex-1">
                {highlightText(note.title || "Untitled", searchQuery)}
              </h3>
              {note.archived && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
                  Archived
                </span>
              )}
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 bg-${currentTheme.accent} text-${currentTheme.primary} rounded-full`}
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

            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
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
