import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Archive,
  ArchiveRestore,
  Trash2,
  Save,
  NotepadText,
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { NoteViewer } from "./NoteViewer";
import { TagInput } from "./TagInput";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { formatDate } from "../lib/utils";
import { cn } from "../lib/utils";
import { useCallback } from "react";
import { Modal } from "./ui/Modal";
import { Eye } from "lucide-react";

export function NotesEditor({
  note,
  onSave,
  onDelete,
  onArchive,
  onBack,
  isLoading = false,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setTags(note.tags || []);
      setHasChanges(false);
      setErrors({});
    }
  }, [note]);

  useEffect(() => {
    if (note) {
      const hasChanged =
        title !== (note.title || "") ||
        content !== (note.content || "") ||
        JSON.stringify(tags) !== JSON.stringify(note.tags || []);

      setHasChanges(hasChanged);
    }
  }, [title, content, tags, note]);

  const handleSave = useCallback(async () => {
    const validateForm = () => {
      const newErrors = {};

      if (!title.trim()) {
        newErrors.title = "Add a descriptive title first";
      }

      if (!content.trim()) {
        newErrors.content =
          "Oops, you cannot add a new note without some content about the note.";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (!validateForm()) return;

    await onSave({
      title: title.trim(),
      content: content.trim(),
      tags,
    });

    setHasChanges(false);
  }, [content, onSave, tags, title]);

  const handleArchive = async () => {
    await onArchive(note.id, !note.archived);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // Auto-save functionality
  useEffect(() => {
    if (hasChanges && note && title.trim() && content.trim()) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [title, content, tags, hasChanges, handleSave, note]);

  if (!note) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <NotepadText />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Select a note to edit
          </h3>
          <p className="text-gray-500">
            Choose a note from the list to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 p-4">
        <button
          onClick={onBack}
          className="focus-ring flex items-center gap-2 rounded-lg p-2 text-gray-600 transition-colors hover:text-gray-900 lg:hidden"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="text-sm text-gray-500">
            Last edited: {formatDate(note.updated_at)}
          </span>
          {hasChanges && (
            <span className="flex items-center gap-1 text-sm text-amber-600">
              <div className="h-2 w-2 rounded-full bg-amber-400"></div>
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            <small className="hidden md:block">Save</small>
          </Button>

          <button
            onClick={handlePreview}
            className="flex w-auto items-center gap-2 rounded px-3 py-2 text-left transition-colors hover:bg-gray-50"
          >
            <Eye size={16} />
            <small className="hidden md:block">Preview</small>
          </button>

          <Modal
            title="Note preview"
            className="max-w-4xl"
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
          >
            <NoteViewer note={note} />
          </Modal>

          <button
            onClick={handleArchive}
            className="flex w-auto items-center gap-2 rounded px-3 py-2 text-left transition-colors hover:bg-gray-50"
          >
            {note.archived ? (
              <ArchiveRestore size={16} />
            ) : (
              <Archive size={16} />
            )}
            <small className="hidden md:block">
              {note.archived ? "Restore" : "Archive"}
            </small>
          </button>

          <button
            onClick={handleDelete}
            className="flex w-auto items-center gap-2 rounded px-3 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={16} />
            <small className="hidden md:block">Delete</small>
          </button>

          <Modal
            title="Delete note"
            className="max-w-lg"
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          >
            <p className="text-sm text-gray-800">
              This will permanantly delete your note. Are you sure you want to
              continue?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                className="w-full"
              >
                Sign Out
              </Button>

              <Button
                onClick={() => {
                  onDelete(note.id);
                  setShowDeleteModal(false);
                }}
                variant="danger"
                className="w-full"
              >
                Delete
              </Button>
            </div>
          </Modal>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className={cn(
                "border-none px-0 py-2 text-2xl font-bold underline underline-offset-4 focus:ring-0",
                errors.title && "border-red-500",
              )}
              error={errors.title}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <TagInput
              tags={tags}
              onChange={setTags}
              placeholder="Add tags..."
            />
          </div>

          <div>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your note..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
