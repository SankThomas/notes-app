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
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Color Theme
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => updateColorTheme(key)}
                className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                  colorTheme === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-${theme.primary}`} />
                <span className="text-sm font-medium capitalize">{key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Theme */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Font</h3>
          <div className="space-y-2">
            {Object.entries(fonts).map(([key, font]) => (
              <button
                key={key}
                onClick={() => updateFontTheme(key)}
                className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors cursor-pointer ${
                  fontTheme === key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`text-sm ${font.class}`}>{font.name}</span>
                {fontTheme === key && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="pt-4 border-t border-gray-200">
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
