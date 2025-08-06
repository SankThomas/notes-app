import { NotepadText } from "lucide-react";
import { formatDate } from "../lib/utils";
import { Clock, Calendar, Hash, FileText } from "lucide-react";

export function NoteViewer({ note }) {
  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
            <NotepadText />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No note selected
          </h3>
          <p className="text-gray-500">Choose a note from the list to view</p>
        </div>
      </div>
    );
  }

  const getWordCount = (content) => {
    if (!content) return 0;
    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, "").trim();
    return text ? text.split(/\s+/).length : 0;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {note.title || "Untitled Note"}
          </h1>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  <Hash size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Created {formatDate(note.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Last edited {formatDate(note.updated_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>{getWordCount(note.content)} words</span>
            </div>
            {note.pinned && (
              <div className="flex items-center gap-2 text-amber-600">
                <span className="text-lg">📌</span>
                <span>Pinned</span>
              </div>
            )}
            {note.archived && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-lg">📦</span>
                <span>Archived</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {note.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: note.content }}
              className="leading-relaxed max-h-96"
            />
          ) : (
            <p className="text-gray-500 italic">This note is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
