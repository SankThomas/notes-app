import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export function SettingsModal({ isOpen, onClose }) {
  const {
    colorTheme,
    fontTheme,
    themes,
    fonts,
    updateColorTheme,
    updateFontTheme,
  } = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Color Theme */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Color Theme
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => updateColorTheme(key)}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                  colorTheme === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`h-4 w-4 rounded-full bg-${theme.primary}`} />
                <span className="text-sm font-medium capitalize">{key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Theme */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700">Font</h3>
          <div className="space-y-2">
            {Object.entries(fonts).map(([key, font]) => (
              <button
                key={key}
                onClick={() => updateFontTheme(key)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                  fontTheme === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`text-sm ${font.class}`}>{font.name}</span>
                {fontTheme === key && (
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="border-t border-gray-200 pt-4">
          <Button
            onClick={handleSignOut}
            variant="secondary"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Modal>
  );
}
