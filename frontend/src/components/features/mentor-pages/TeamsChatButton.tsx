import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "../../../design/system/button";

interface TeamsChatButtonProps {
  mentor: {
    name: string;
    email?: string;
    teamsId?: string;
  };
  session?: {
    title: string;
    date: string;
    time: string;
  };
}

export default function TeamsChatButton({
  mentor,
  session,
}: TeamsChatButtonProps) {
  const handleTeamsChat = () => {
    // Try different methods to open Teams chat
    if (mentor.teamsId) {
      // Direct Teams user ID link
      window.open(
        `https://teams.microsoft.com/l/chat/0/0?users=${mentor.teamsId}`,
        "_blank"
      );
    } else if (mentor.email) {
      // Email-based Teams chat
      window.open(
        `https://teams.microsoft.com/l/chat/0/0?users=${mentor.email}`,
        "_blank"
      );
    } else {
      // Fallback: Open Teams app or web version
      const teamsUrl = `https://teams.microsoft.com/`;
      window.open(teamsUrl, "_blank");

      // Show instructions
      alert(`Teams нээгдлээ. ${mentor.name}-тай chat хийхийн тулд:
1. Teams дээр нэвтэрнэ үү
2. Chat хэсэгт очно уу
3. ${mentor.name}-г хайна уу
4. Chat эхлүүлнэ үү`);
    }
  };

  const handleTeamsMeeting = () => {
    if (session) {
      // Create Teams meeting with session details
      const meetingSubject = encodeURIComponent(
        `${session.title} - ${mentor.name}`
      );
      const meetingBody = encodeURIComponent(`Session: ${session.title}
Date: ${session.date}
Time: ${session.time}
Mentor: ${mentor.name}

Teams meeting эхлүүлэх хүсэлт.`);

      const teamsMeetingUrl = `https://teams.microsoft.com/l/meeting/new?subject=${meetingSubject}&content=${meetingBody}&attendees=${
        mentor.email || ""
      }`;
      window.open(teamsMeetingUrl, "_blank");
    } else {
      // General Teams meeting
      window.open("https://teams.microsoft.com/l/meeting/new", "_blank");
    }
  };

  return (
    <div className="space-y-3">
      {/* Teams Chat Button */}
      <Button
        onClick={handleTeamsChat}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Teams Chat
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>

      {/* Teams Meeting Button */}
      <Button
        onClick={handleTeamsMeeting}
        variant="outline"
        className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-all duration-300"
        size="lg"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Teams Meeting
      </Button>

      {/* Teams Status Info */}
      <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="font-medium text-blue-800">
          Microsoft Teams дээр холбогдоно
        </p>
        <p className="text-xs mt-1">
          {mentor.email ? `${mentor.email} хаягаар` : "Teams app дээр"}{" "}
          {mentor.name}-тай шууд chat хийх боломжтой
        </p>
      </div>
    </div>
  );
}
