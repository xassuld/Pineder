export interface TopicSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentImage: string;
  topic: string;
  description: string;
  category: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  submittedAt: string;
  status: "pending" | "approved" | "enhanced" | "rejected";
  teacherNotes?: string;
  enhancedTopic?: string;
  enhancedDescription?: string;
  // New student profile fields
  studentLevel?: "beginner" | "intermediate" | "advanced";
  grade?: string;
  interests?: string;
  email: string;
}

export interface GroupSession {
  id: string;
  topic: TopicSubmission;
  teacherId?: string;
  teacherName?: string;
  teacherImage?: string;
  maxParticipants: number;
  currentParticipants: number;
  participants: GroupParticipant[];
  status:
    | "planning"
    | "voting"
    | "scheduled"
    | "active"
    | "completed"
    | "cancelled";
  scheduledDate?: string;
  scheduledTime?: string;
  duration: number;
  meetingLocation: "zoom" | "in-person";
  meetingLink?: string;
  meetingAddress?: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupParticipant {
  id: string;
  name: string;
  image: string;
  role: "student" | "teacher" | "assistant";
  joinedAt: string;
  status: "active" | "waitlist" | "left";
}

export interface TopicVote {
  id: string;
  topicId: string;
  studentId: string;
  studentName: string;
  vote: "upvote" | "downvote";
  createdAt: string;
}

export interface GroupSessionComment {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userImage: string;
  comment: string;
  createdAt: string;
}

export const mockTopicSubmissions: TopicSubmission[] = [
  {
    id: "1",
    studentId: "student1",
    studentName: "Alex Chen",
    studentImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    topic: "React Performance Optimization",
    description:
      "I want to learn how to make my React apps faster and more efficient. Looking for practical tips and real-world examples.",
    category: "Frontend Development",
    submittedAt: "2024-12-01T10:00:00Z",
    status: "enhanced",
    teacherNotes: "Great topic! This is essential for production apps.",
    enhancedTopic:
      "Advanced React: Performance Optimization, Memoization, and Code Splitting",
    enhancedDescription:
      "Learn advanced techniques to optimize React applications including React.memo, useMemo, useCallback, code splitting with React.lazy, and performance monitoring tools.",
    email: "alex.chen@example.com",
  },
  {
    id: "2",
    studentId: "student2",
    studentName: "Sarah Kim",
    studentImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    topic: "MongoDB Aggregation Pipelines",
    description:
      "I need help understanding complex MongoDB aggregations for data analysis. The syntax is confusing me.",
    category: "Backend Development",
    submittedAt: "2024-12-01T11:30:00Z",
    status: "enhanced",
    teacherNotes: "Excellent choice! Aggregations are powerful but complex.",
    enhancedTopic: "MongoDB Mastery: Complex Aggregations and Data Analysis",
    enhancedDescription:
      "Master MongoDB aggregation pipelines for advanced data analysis, including $lookup, $group, $unwind, and custom aggregation functions.",
    email: "sarah.kim@example.com",
  },
  {
    id: "3",
    studentId: "student3",
    studentName: "Mike Johnson",
    studentImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    topic: "Next.js Authentication",
    description:
      "How to implement secure authentication in Next.js? I want to understand the best practices.",
    category: "Full-Stack Development",
    submittedAt: "2024-12-01T14:15:00Z",
    status: "pending",
    email: "mike.johnson@example.com",
  },
];

export const mockGroupSessions: GroupSession[] = [
  {
    id: "1",
    topic: mockTopicSubmissions[0],
    teacherId: "teacher1",
    teacherName: "Dr. Emily Watson",
    teacherImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    maxParticipants: 15,
    currentParticipants: 8,
    participants: [
      {
        id: "p1",
        name: "Alex Chen",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        role: "student",
        joinedAt: "2024-12-01T10:00:00Z",
        status: "active",
      },
      {
        id: "p2",
        name: "Dr. Emily Watson",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        role: "teacher",
        joinedAt: "2024-12-01T10:00:00Z",
        status: "active",
      },
    ],
    status: "scheduled",
    scheduledDate: "2024-12-15",
    scheduledTime: "14:00",
    duration: 90,
    meetingLocation: "zoom",
    meetingLink: "https://zoom.us/j/123456789",
    description:
      "Advanced React performance optimization techniques for production applications.",
    category: "Frontend Development",
    difficulty: "intermediate",
    tags: ["React", "Performance", "Optimization", "Frontend"],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    topic: mockTopicSubmissions[1],
    teacherId: "teacher2",
    teacherName: "Enkhzaya Bymba",
    teacherImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    maxParticipants: 30,
    currentParticipants: 1,
    participants: [
      {
        id: "p3",
        name: "Enkhzaya Bymba",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        role: "teacher",
        joinedAt: "2024-12-01T10:00:00Z",
        status: "active",
      },
    ],
    status: "scheduled",
    scheduledDate: "2030-03-23",
    scheduledTime: "13:13",
    duration: 60,
    meetingLocation: "in-person",
    meetingAddress: "Main Campus, Building A, Room 301, Ulaanbaatar, Mongolia",
    description: "react hooks ahiad uzii",
    category: "Frontend Development",
    difficulty: "intermediate",
    tags: ["React", "Hooks", "Frontend"],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
];

export const mockTopicVotes: TopicVote[] = [
  {
    id: "1",
    topicId: "1",
    studentId: "student1",
    studentName: "Alex Chen",
    vote: "upvote",
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    topicId: "1",
    studentId: "student2",
    studentName: "Sarah Kim",
    vote: "upvote",
    createdAt: "2024-12-01T11:00:00Z",
  },
  {
    id: "3",
    topicId: "2",
    studentId: "student1",
    studentName: "Alex Chen",
    vote: "upvote",
    createdAt: "2024-12-01T12:00:00Z",
  },
];
