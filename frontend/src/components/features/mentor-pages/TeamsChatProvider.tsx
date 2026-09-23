import React, { createContext, useContext, useState, ReactNode } from "react";

interface TeamsChatSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorEmail?: string;
  mentorTeamsId?: string;
  sessionId?: string;
  sessionTitle?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

interface TeamsChatContextType {
  activeTeamsChat: TeamsChatSession | null;
  teamsChatSessions: TeamsChatSession[];
  isTeamsChatOpen: boolean;
  openTeamsChat: (mentor: any, session?: any) => void;
  closeTeamsChat: () => void;
  addTeamsChatSession: (mentor: any, session?: any) => void;
  updateTeamsUnreadCount: (sessionId: string, count: number) => void;
}

const TeamsChatContext = createContext<TeamsChatContextType | undefined>(
  undefined
);

export const useTeamsChat = () => {
  const context = useContext(TeamsChatContext);
  if (context === undefined) {
    throw new Error("useTeamsChat must be used within a TeamsChatProvider");
  }
  return context;
};

interface TeamsChatProviderProps {
  children: ReactNode;
}

export const TeamsChatProvider: React.FC<TeamsChatProviderProps> = ({
  children,
}) => {
  const [activeTeamsChat, setActiveTeamsChat] =
    useState<TeamsChatSession | null>(null);
  const [teamsChatSessions, setTeamsChatSessions] = useState<
    TeamsChatSession[]
  >([]);
  const [isTeamsChatOpen, setIsTeamsChatOpen] = useState(false);

  const openTeamsChat = (mentor: any, session?: any) => {
    console.log(
      "🔍 Opening Teams chat for mentor:",
      mentor,
      "session:",
      session
    );

    // Find existing Teams chat session or create new one
    let teamsChatSession = teamsChatSessions.find(
      (cs) => cs.mentorId === mentor.id
    );

    if (!teamsChatSession) {
      teamsChatSession = {
        id: `teams_chat_${mentor.id}`,
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorEmail: mentor.email,
        mentorTeamsId: mentor.teamsId,
        sessionId: session?.id,
        sessionTitle: session?.title,
        unreadCount: 0,
      };

      setTeamsChatSessions((prev) => [...prev, teamsChatSession!]);
    }

    setActiveTeamsChat(teamsChatSession);
    setIsTeamsChatOpen(true);
    console.log("🔍 Teams chat should now be open");
  };

  const closeTeamsChat = () => {
    setIsTeamsChatOpen(false);
    setActiveTeamsChat(null);
  };

  const addTeamsChatSession = (mentor: any, session?: any) => {
    const newTeamsChatSession: TeamsChatSession = {
      id: `teams_chat_${mentor.id}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorEmail: mentor.email,
      mentorTeamsId: mentor.teamsId,
      sessionId: session?.id,
      sessionTitle: session?.title,
      unreadCount: 0,
    };

    setTeamsChatSessions((prev) => {
      const existing = prev.find((cs) => cs.mentorId === mentor.id);
      if (existing) {
        return prev.map((cs) =>
          cs.mentorId === mentor.id ? { ...cs, ...newTeamsChatSession } : cs
        );
      }
      return [...prev, newTeamsChatSession];
    });
  };

  const updateTeamsUnreadCount = (sessionId: string, count: number) => {
    setTeamsChatSessions((prev) =>
      prev.map((cs) =>
        cs.sessionId === sessionId ? { ...cs, unreadCount: count } : cs
      )
    );
  };

  const value: TeamsChatContextType = {
    activeTeamsChat,
    teamsChatSessions,
    isTeamsChatOpen,
    openTeamsChat,
    closeTeamsChat,
    addTeamsChatSession,
    updateTeamsUnreadCount,
  };

  return (
    <TeamsChatContext.Provider value={value}>
      {children}
    </TeamsChatContext.Provider>
  );
};
