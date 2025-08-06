import { useState } from "react";
import {
  PlusCircle,
  Archive,
  NotepadText,
  Settings,
  Tag,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";
import { ChevronRight } from "lucide-react";

export function Sidebar({
  tags,
  selectedTag,
  onTagSelect,
  onCreateNote,
  onViewArchived,
  onViewAll,
  onOpenSettings,
  isCollapsed,
  onToggleCollapse,
}) {
  const { currentTheme } = useTheme();
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);

  const menuItems = [
    {
      icon: FileText,
      label: "All Notes",
      onClick: onViewAll,
      isActive: !selectedTag,
    },
    {
      icon: Archive,
      label: "Archived",
      onClick: onViewArchived,
    },
  ];

  if (isCollapsed) {
    return (
      <div className="flex h-full w-16 flex-col items-center border-r border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-950">
        <button
          onClick={onToggleCollapse}
          className="mb-4 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Menu size={20} className="text-white" />
        </button>

        <button
          onClick={onCreateNote}
          className={`p-2 bg-${currentTheme.primary} rounded-lg text-white hover:bg-${currentTheme.primaryHover} mb-4 transition-colors`}
          title="Create New Note"
        >
          <PlusCircle size={20} />
        </button>

        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={cn(
              "mb-2 rounded-lg p-2 transition-colors",
              item.isActive
                ? `bg-${currentTheme.primaryLight} text-${currentTheme.primary}`
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-400",
            )}
            title={item.label}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <NotepadText size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-950 dark:text-white">
              Notes
            </h1>
          </div>
          <button
            onClick={onToggleCollapse}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
          >
            <X size={16} />
          </button>
        </div>

        <button
          onClick={onCreateNote}
          className={`flex w-full items-center gap-2 px-4 py-2 bg-${currentTheme.primary} rounded-lg text-white hover:bg-${currentTheme.primaryHover} focus-ring transition-colors`}
        >
          <PlusCircle size={18} />
          Create New Note
        </button>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                item.isActive
                  ? `bg-${currentTheme.primaryLight} text-${currentTheme.primary}`
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
            className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-400"
          >
            <span className="flex items-center gap-2">
              <Tag size={16} />
              Tags
            </span>
            <span
              className={cn(
                "transform transition-transform",
                isTagsExpanded ? "rotate-90" : "rotate-0",
              )}
            >
              <ChevronRight />
            </span>
          </button>

          {isTagsExpanded && (
            <div className="mt-2 ml-4 space-y-1">
              {tags.length === 0 ? (
                <p className="px-3 py-1 text-sm text-gray-400">No tags yet</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagSelect(tag)}
                    className={cn(
                      "focus-ring w-full rounded-md px-3 py-1 text-left text-sm transition-colors",
                      selectedTag === tag
                        ? `bg-${currentTheme.primaryLight} text-${currentTheme.primary}`
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                    )}
                  >
                    #{tag}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <button
          onClick={onOpenSettings}
          className="focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
}
