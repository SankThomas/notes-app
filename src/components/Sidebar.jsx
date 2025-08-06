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
      <div className="w-16 h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors mb-4"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={onCreateNote}
          className={`p-2 bg-${currentTheme.primary} text-white  rounded-lg hover:bg-${currentTheme.primaryHover} transition-colors mb-4`}
          title="Create New Note"
        >
          <PlusCircle size={20} />
        </button>

        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={cn(
              "p-2 rounded-lg transition-colors mb-2",
              item.isActive
                ? `bg-${currentTheme.primaryLight} text-${currentTheme.primary}`
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 dark:hover:text-gray-400"
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
    <div className="w-64 h-full bg-white dark:bg-gray-950 dark:border-gray-800 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <NotepadText size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold dark:text-white text-gray-950">
              Notes
            </h1>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <button
          onClick={onCreateNote}
          className={`w-full flex items-center gap-2 px-4 py-2 bg-${currentTheme.primary} text-white rounded-lg hover:bg-${currentTheme.primaryHover} transition-colors focus-ring`}
        >
          <PlusCircle size={18} />
          Create New Note
        </button>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2 mb-6">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left focus-ring",
                item.isActive
                  ? `bg-${currentTheme.primaryLight} text-${currentTheme.primary}`
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400"
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
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 dark:hover:text-gray-400 hover:text-gray-700 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Tag size={16} />
              Tags
            </span>
            <span
              className={cn(
                "transform transition-transform",
                isTagsExpanded ? "rotate-90" : "rotate-0"
              )}
            >
              <ChevronRight />
            </span>
          </button>

          {isTagsExpanded && (
            <div className="mt-2 space-y-1 ml-4">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-400 px-3 py-1">No tags yet</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagSelect(tag)}
                    className={cn(
                      "w-full text-left px-3 py-1 text-sm rounded-md transition-colors focus-ring",
                      selectedTag === tag
                        ? `bg-${currentTheme.primaryLight} text-${currentTheme.primary}`
                        : "hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400"
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

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100 rounded-lg transition-colors focus-ring"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
}
