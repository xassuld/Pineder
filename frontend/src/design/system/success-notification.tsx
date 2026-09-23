import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface SuccessNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export function SuccessNotification({
  isVisible,
  message,
  onClose,
}: SuccessNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-20 right-4 z-50 bg-[#08CB00] text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm"
        >
          <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
          <span className="flex-1">{message}</span>
          <button
            onClick={onClose}
            className="text-white hover:text-[#08CB00]/80 transition-colors duration-200 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
