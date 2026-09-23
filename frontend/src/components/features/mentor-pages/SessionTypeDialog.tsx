import React from "react";
import { Button } from "../../../design/system/button";
import { Monitor, GraduationCap } from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface SessionTypeDialogProps {
  showSessionTypeDialog: boolean;
  setShowSessionTypeDialog: (show: boolean) => void;
  selectedSessionType: "online" | "in-class";
  setSelectedSessionType: (type: "online" | "in-class") => void;
  classDetails: { room: string };
  setClassDetails: (details: { room: string }) => void;
  handleAcceptWithType: () => void;
}

const SessionTypeDialog: React.FC<SessionTypeDialogProps> = ({
  showSessionTypeDialog,
  setShowSessionTypeDialog,
  selectedSessionType,
  setSelectedSessionType,
  classDetails,
  setClassDetails,
  handleAcceptWithType,
}) => {
  const { colors, isDarkMode } = useTheme();

  // Don't render if not showing
  if (!showSessionTypeDialog) {
    return null;
  }

  return (
    <>
      {/* Custom overlay without blur */}
      <div
        className="fixed inset-0 z-[9998] bg-black/20"
        onClick={() => setShowSessionTypeDialog(false)}
      />

      {/* Custom modal content */}
      <div
        className="fixed top-[50%] left-[50%] z-[9999] w-full max-w-sm mx-4 sm:max-w-md sm:mx-0 translate-x-[-50%] translate-y-[-50%] rounded-lg border p-6 shadow-lg duration-200"
        style={{
          backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
          borderColor: isDarkMode ? "#ffffff" : "#000000",
          borderWidth: "2px",
          boxShadow: isDarkMode
            ? "0 25px 50px -12px rgba(255, 255, 255, 0.25)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="mb-4">
          <h2
            className="text-lg sm:text-xl font-bold"
            style={{
              color: isDarkMode ? "#ffffff" : "#000000",
            }}
          >
            Choose Session Type
          </h2>
        </div>

        <div className="space-y-4">
          {/* Online Session Option */}
          <Button
            onClick={() => setSelectedSessionType("online")}
            className="w-full justify-start p-4 h-auto border-2 transition-all duration-200"
            variant={selectedSessionType === "online" ? "default" : "outline"}
            style={{
              borderColor:
                selectedSessionType === "online"
                  ? "#10b981"
                  : isDarkMode
                  ? "#ffffff"
                  : "#000000",
              backgroundColor:
                selectedSessionType === "online" ? "#10b981" : "transparent",
              color:
                selectedSessionType === "online"
                  ? "#ffffff"
                  : isDarkMode
                  ? "#ffffff"
                  : "#000000",
            }}
          >
            <Monitor className="w-4 h-4 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold text-sm sm:text-base">
                Online Session
              </div>
              <p
                className="text-xs mt-1"
                style={{
                  color:
                    selectedSessionType === "online"
                      ? "#ffffff"
                      : isDarkMode
                      ? "#cccccc"
                      : "#666666",
                }}
              >
                Video call meeting
              </p>
            </div>
          </Button>

          {/* In-Class Session Option */}
          <Button
            onClick={() => setSelectedSessionType("in-class")}
            className="w-full justify-start p-4 h-auto border-2 transition-all duration-200"
            variant={selectedSessionType === "in-class" ? "default" : "outline"}
            style={{
              borderColor:
                selectedSessionType === "in-class"
                  ? "#10b981"
                  : isDarkMode
                  ? "#ffffff"
                  : "#000000",
              backgroundColor:
                selectedSessionType === "in-class" ? "#10b981" : "transparent",
              color:
                selectedSessionType === "in-class"
                  ? "#ffffff"
                  : isDarkMode
                  ? "#ffffff"
                  : "#000000",
            }}
          >
            <GraduationCap className="w-4 h-4 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold text-sm sm:text-base">
                In-Class Session
              </div>
              <p
                className="text-xs mt-1"
                style={{
                  color:
                    selectedSessionType === "in-class"
                      ? "#ffffff"
                      : isDarkMode
                      ? "#cccccc"
                      : "#666666",
                }}
              >
                Physical classroom meeting
              </p>
            </div>
          </Button>

          {/* Room Number Input (only show for in-class) */}
          {selectedSessionType === "in-class" && (
            <div className="space-y-2">
              <label
                className="text-sm font-semibold"
                style={{
                  color: isDarkMode
                    ? colors.text.primary
                    : colors.accent.primary,
                }}
              >
                Room Number
              </label>
              <input
                type="text"
                value={classDetails.room}
                onChange={(e) => setClassDetails({ room: e.target.value })}
                placeholder="Enter room number"
                className="w-full p-3 border-2 rounded-lg text-base transition-all duration-200"
                style={{
                  borderColor: isDarkMode
                    ? colors.border.primary
                    : colors.accent.primary,
                  backgroundColor: isDarkMode
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.2)",
                  color: isDarkMode
                    ? colors.text.primary
                    : colors.accent.primary,
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end sm:space-x-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowSessionTypeDialog(false)}
              className="w-full sm:w-auto py-3 border-2 transition-all duration-200"
              style={{
                borderColor: isDarkMode ? colors.border.primary : "#6b7280",
                backgroundColor: isDarkMode
                  ? "rgba(0, 0, 0, 0.2)"
                  : "rgba(255, 255, 255, 0.2)",
                color: isDarkMode ? colors.text.primary : "#374151",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptWithType}
              className="w-full sm:w-auto py-3 border-2 transition-all duration-200"
              style={{
                backgroundColor: "#10b981",
                borderColor: "#10b981",
                color: colors.text.inverse,
              }}
            >
              Accept Session
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionTypeDialog;
