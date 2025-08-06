import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthForm } from "./components/AuthForm";
import { Sidebar } from "./components/Sidebar";
import { NotesList } from "./components/NotesList";
import { NotesEditor } from "./components/NotesEditor";
import { SearchBar } from "./components/SearchBar";
import { SettingsModal } from "./components/SettingsModal";
import { useNotes } from "./hooks/useNotes";
import { Menu } from "lucide-react";

function NotesApp() {
  const { user, loading: authLoading } = useAuth();
  const {
    notes,
    loading: notesLoading,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive handling
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && selectedNote) {
        setSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [selectedNote]);

  // Filter notes based on current filters
  const filteredNotes = useMemo(() => {
    let filtered = notes.filter((note) => note.archived === showArchived);

    if (selectedTag) {
      filtered = filtered.filter(
        (note) => note.tags && note.tags.includes(selectedTag),
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title?.toLowerCase().includes(query) ||
          note.content?.toLowerCase().includes(query) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [notes, showArchived, selectedTag, searchQuery]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    notes.forEach((note) => {
      if (note.tags) {
        note.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Auto-select first note when filters change
  useEffect(() => {
    if (filteredNotes.length > 0 && !selectedNote) {
      setSelectedNote(filteredNotes[0]);
    } else if (filteredNotes.length === 0) {
      setSelectedNote(null);
    }
  }, [filteredNotes, selectedNote]);

  const handleCreateNote = async () => {
    const newNote = {
      title: "Untitled Note",
      content: "",
      tags: [],
      archived: false,
    };

    const { data } = await createNote(newNote);
    if (data) {
      setSelectedNote(data);
      setShowArchived(false);
      setSelectedTag(null);
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    }
  };

  const handleSaveNote = async (noteData) => {
    if (selectedNote) {
      await updateNote(selectedNote.id, noteData);
    }
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
    setSelectedNote(null);
    if (isMobile) {
      setSidebarCollapsed(false);
    }
  };

  const handleArchiveNote = async (noteId, archived) => {
    await archiveNote(noteId, archived);
    if (archived && !showArchived) {
      setSelectedNote(null);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setSidebarCollapsed(false);
    }
  };

  const handleViewAll = () => {
    setShowArchived(false);
    setSelectedTag(null);
    setSearchQuery("");
  };

  const handleViewArchived = () => {
    setShowArchived(true);
    setSelectedTag(null);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed top-0 left-0 z-50 h-full transform transition-transform duration-300 ${
                sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
              }`
            : sidebarCollapsed
              ? "w-16"
              : "w-64"
        }`}
      >
        <Sidebar
          tags={allTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          onCreateNote={handleCreateNote}
          onViewArchived={handleViewArchived}
          onViewAll={handleViewAll}
          onOpenSettings={() => setShowSettings(true)}
          isCollapsed={sidebarCollapsed && !isMobile}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        {/* Notes list */}
        <div
          className={`${
            isMobile && sidebarCollapsed && selectedNote
              ? "hidden"
              : "flex flex-col"
          } w-full border-r border-gray-200 bg-white lg:w-80`}
        >
          {/* Mobile header */}
          {isMobile && (
            <div className="flex items-center gap-3 border-b border-gray-200 p-4">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <Menu size={20} className="text-white" />
              </button>
              <h1 className="text-lg font-semibold">
                {showArchived
                  ? "Archived Notes"
                  : selectedTag
                    ? `#${selectedTag}`
                    : "All Notes"}
              </h1>
            </div>
          )}

          {/* Search bar */}
          <div className="border-b border-gray-200 p-4">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder={`Search ${showArchived ? "archived " : ""}notes...`}
            />
          </div>

          {/* Header for desktop */}
          {!isMobile && (
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {showArchived
                  ? "Archived Notes"
                  : selectedTag
                    ? `#${selectedTag}`
                    : "All Notes"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"}
              </p>
            </div>
          )}

          {/* Notes list */}
          <NotesList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            searchQuery={searchQuery}
            isLoading={notesLoading}
          />
        </div>

        {/* Note editor */}
        <div
          className={`${
            isMobile && (!sidebarCollapsed || !selectedNote)
              ? "hidden"
              : "flex flex-1"
          }`}
        >
          <NotesEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onArchive={handleArchiveNote}
            onBack={handleBackToList}
          />
        </div>
      </div>

      {/* Settings modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<NotesApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
