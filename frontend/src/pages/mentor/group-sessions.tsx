import { useState } from "react";
import Head from "next/head";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { GroupSessionsTabs } from "../../components/features/group-sessions";
import TopicsSection from "../../components/features/group-sessions/TopicsSection";
import SessionsSection from "../../components/features/group-sessions/SessionsSection";
import { TopicEditModal } from "../../components/features/group-sessions/TopicEditModal";
import { useGroupSessions } from "../../core/hooks/useGroupSessions";
import {
  TopicSubmission,
  GroupSession,
} from "../../core/lib/data/groupSessions";

export default function MentorGroupSessionsPage() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<"topics" | "sessions">("topics");
  const [editingTopic, setEditingTopic] = useState<TopicSubmission | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    groupSessions,
    topics,
    isLoading,
    error,
    submitTopic,
    voteTopic,
    refreshData,
  } = useGroupSessions();

  // Transform API data to match component interface
  const transformedSessions: GroupSession[] = groupSessions.map((session) => ({
    id: session._id,
    topic: {
      id: session.topics?.[0]?.id || session._id,
      studentId: session.mentorId,
      studentName: "Mentor",
      studentImage: "/default-avatar.png",
      topic: session.topics?.[0]?.title || session.title,
      description: session.description,
      category: session.topics?.[0]?.category || session.subject,
      difficulty: "intermediate",
      submittedAt: session.createdAt,
      status: "approved" as const,
      email: "mentor@example.com",
    },
    teacherId: session.mentorId,
    teacherName: "Mentor",
    teacherImage: "/default-avatar.png",
    maxParticipants: session.maxStudents,
    currentParticipants: session.currentStudents,
    participants: [],
    status: session.status as any,
    scheduledDate: session.startTime
      ? new Date(session.startTime).toLocaleDateString()
      : undefined,
    scheduledTime: session.startTime
      ? new Date(session.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined,
    duration:
      session.startTime && session.endTime
        ? Math.round(
            (new Date(session.endTime).getTime() -
              new Date(session.startTime).getTime()) /
              (1000 * 60)
          )
        : 60,
    meetingLocation: session.meetingLink
      ? ("zoom" as const)
      : ("in-person" as const),
    meetingLink: session.meetingLink,
    description: session.description,
    category: session.topics?.[0]?.category || session.subject,
    difficulty: "intermediate" as const,
    tags: [],
    createdAt: session.createdAt,
    updatedAt: session.updatedAt || session.createdAt,
  }));

  const handleTopicSubmit = async (
    topic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => {
    try {
      if (groupSessions.length === 0)
        throw new Error("No group sessions available");
      const groupId = groupSessions[0]._id;
      await submitTopic(groupId, {
        title: topic.topic,
        description: topic.description,
        category: topic.category,
      });
    } catch (error) {
      console.error("Failed to submit topic:", error);
    }
  };

  const handleVote = async (
    topicId: string,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      if (groupSessions.length === 0)
        throw new Error("No group sessions available");
      const groupId = groupSessions[0]._id;
      await voteTopic(groupId, topicId, voteType);
    } catch (error) {
      console.error("Failed to vote on topic:", error);
    }
  };

  const getVoteCount = (topicId: string, voteType: "upvote" | "downvote") => {
    const topic = topics.find((t) => t.id === topicId);
    return topic ? (voteType === "upvote" ? topic.votes : 0) : 0;
  };

  const handleEdit = (topic: TopicSubmission) => {
    setEditingTopic(topic);
    setIsEditModalOpen(true);
  };

  const handleDelete = (topicId: string) => {
    console.log("Delete topic:", topicId);
  };

  const handleSessionCreate = (
    session: Omit<
      GroupSession,
      "id" | "participants" | "currentParticipants" | "createdAt" | "updatedAt"
    >
  ) => {
    console.log("Create session:", session);
  };

  const handleSessionDelete = (sessionId: string) => {
    console.log("Delete session:", sessionId);
  };

  const handleSessionEdit = (
    sessionId: string,
    updates: Partial<GroupSession>
  ) => {
    console.log("Edit session:", sessionId, updates);
  };

  if (isLoading) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <p style={{ color: colors.text.secondary }}>
              Loading group sessions...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div
          className="flex items-center justify-center min-h-screen"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <p className="mb-4 text-red-500">Error: {error}</p>
            <button
              onClick={refreshData}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Group Sessions | Mentor Dashboard | Pineder</title>
        <meta
          name="description"
          content="Manage group sessions and topics as a mentor"
        />
      </Head>

      <div
        className="w-full min-h-screen pb-16"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="w-full px-4 py-4 mx-auto max-w-7xl lg:px-8">
          {/* Header */}
          <div className="mb-4">
            <h1
              className="mb-1 text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Group Sessions Management
            </h1>
            <p className="text-base" style={{ color: colors.text.secondary }}>
              Create and manage group learning sessions with your students
            </p>
          </div>

          {/* Tabs */}
          <GroupSessionsTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Content */}
          <div className="mt-4">
            {activeTab === "topics" ? (
              <TopicsSection
                topics={topics.map((topic) => ({
                  id: topic.id,
                  studentId: "mentor",
                  studentName: "Mentor",
                  studentImage: "/default-avatar.png",
                  topic: topic.title,
                  description: topic.description,
                  category: topic.category || "General",
                  difficulty: "intermediate" as const,
                  submittedAt: topic.createdAt,
                  status: "approved" as const,
                  email: "mentor@example.com",
                }))}
                votes={[]}
                onVote={handleVote}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTopicSubmit={handleTopicSubmit}
              />
            ) : (
              <SessionsSection
                groupSessions={transformedSessions}
                onSwitchToTopics={() => setActiveTab("topics")}
                availableTopics={topics.map((topic) => ({
                  id: topic.id,
                  studentId: "mentor",
                  studentName: "Mentor",
                  studentImage: "/default-avatar.png",
                  topic: topic.title,
                  description: topic.description,
                  category: topic.category || "General",
                  difficulty: "intermediate" as const,
                  submittedAt: topic.createdAt,
                  status: "approved" as const,
                  email: "mentor@example.com",
                }))}
                onSessionCreate={handleSessionCreate}
                onSessionDelete={handleSessionDelete}
                onSessionEdit={handleSessionEdit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Topic Modal */}
      {editingTopic && (
        <TopicEditModal
          topic={editingTopic}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTopic(null);
          }}
          onSave={(updatedTopic) => {
            console.log("Update topic:", updatedTopic);
            setIsEditModalOpen(false);
            setEditingTopic(null);
          }}
        />
      )}
    </Layout>
  );
}
