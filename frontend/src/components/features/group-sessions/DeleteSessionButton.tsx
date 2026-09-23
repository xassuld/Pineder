import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "../../../design/system/button";
import { useUser } from "@clerk/nextjs";
import { GroupSession } from "../../../core/lib/data/groupSessions";

interface DeleteSessionButtonProps {
  session: GroupSession;
  onDelete: (sessionId: string) => void;
  className?: string;
  showAsIcon?: boolean;
}

export const DeleteSessionButton: React.FC<DeleteSessionButtonProps> = ({
  session,
  onDelete,
  className = "",
  showAsIcon = false,
}) => {
  const { user } = useUser();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the creator of this session
  const canDelete = user?.id === session.teacherId;

  // If user can't delete, don't render anything
  if (!canDelete) {
    return null;
  }

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(session.id);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Failed to delete session:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  if (showAsIcon) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDeleteClick}
          className={className}
          title="Delete Session"
          disabled={isDeleting}
        >
          <Trash2 className="w-5 h-5" />
        </Button>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-md p-6 mx-4 bg-white shadow-2xl rounded-2xl">
              <div className="flex items-center mb-4 space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Session
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-2 text-gray-700">
                  Are you sure you want to delete the session:
                </p>
                <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                  &quot;{session.topic.topic}&quot;
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  This will remove the session and notify all participants.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-100"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="flex-1 text-white bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    "Delete Session"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Delete Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDeleteClick}
        className={`text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 ${className}`}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete Session"}
      </Button>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md p-6 mx-4 bg-white shadow-2xl rounded-2xl">
            <div className="flex items-center mb-4 space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Session
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-gray-700">
                Are you sure you want to delete the session:
              </p>
              <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                &quot;{session.topic.topic}&quot;
              </p>
              <p className="mt-2 text-sm text-gray-600">
                This will remove the session and notify all participants.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 text-white bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete Session"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
