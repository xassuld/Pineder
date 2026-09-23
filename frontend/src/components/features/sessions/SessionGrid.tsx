import { motion } from "framer-motion";
import SessionCard from "./SessionCard";

interface SessionGridProps {
  sessions: any[];
  onJoinSession: (session: any) => void;
  onRequestReschedule: (session: any) => void;
  onRateSession: (session: any) => void;
  onCancelSession: (session: any) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

export default function SessionGrid({
  sessions,
  onJoinSession,
  onRequestReschedule,
  onRateSession,
  onCancelSession,
  getStatusColor,
  getStatusIcon,
}: SessionGridProps) {
  // Limit to show only 4-5 cards
  const displaySessions = sessions.slice(0, 5);

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {displaySessions.map((session, index) => (
        <SessionCard
          key={session.id}
          session={session}
          index={index}
          onJoinSession={onJoinSession}
          onRequestReschedule={onRequestReschedule}
          onRateSession={onRateSession}
          onCancelSession={onCancelSession}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      ))}
    </div>
  );
}
