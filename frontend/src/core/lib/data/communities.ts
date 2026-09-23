export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  topics: string[];
  recentActivity: string;
  status: "active" | "growing" | "new";
  createdAt: string;
  createdBy: string;
  rules: string[];
  isPrivate: boolean;
  memberIds: string[];
  image?: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isPinned: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  parentCommentId?: string; // For nested comments
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  userName: string;
  userImage?: string;
  role: "member" | "moderator" | "admin";
  joinedAt: string;
  lastActive: string;
}

// Mock data for communities
export const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Web Development Enthusiasts",
    description: "A community for web developers to share knowledge, ask questions, and collaborate on projects. From beginners to experts, everyone is welcome to learn and grow together.",
    category: "Programming",
    members: 1247,
    topics: ["React", "Node.js", "TypeScript", "CSS", "JavaScript", "Frontend", "Backend"],
    recentActivity: "2 hours ago",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "Sarah Chen",
    rules: [
      "Be respectful and inclusive",
      "Share knowledge and help others",
      "No spam or self-promotion",
      "Stay on topic"
    ],
    isPrivate: false,
    memberIds: ["user1", "user2", "user3"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
  },
  {
    id: "2",
    name: "Data Science Learners",
    description: "Learn data science, machine learning, and AI together with peers and mentors. Share insights, discuss algorithms, and work on real-world projects.",
    category: "Data Science",
    members: 892,
    topics: ["Python", "Machine Learning", "Statistics", "Data Visualization", "Deep Learning", "NLP"],
    recentActivity: "1 day ago",
    status: "active",
    createdAt: "2024-01-10T14:30:00Z",
    createdBy: "Marcus Rodriguez",
    rules: [
      "Respect intellectual property",
      "Share code and explanations",
      "Ask thoughtful questions",
      "Help others learn"
    ],
    isPrivate: false,
    memberIds: ["user4", "user5", "user6"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Mobile App Developers",
    description: "Connect with mobile developers, share app ideas, and get feedback on your projects. Discuss iOS, Android, and cross-platform development.",
    category: "Mobile Development",
    members: 567,
    topics: ["React Native", "Flutter", "iOS", "Android", "Mobile UI/UX", "App Store"],
    recentActivity: "3 days ago",
    status: "growing",
    createdAt: "2024-01-20T09:15:00Z",
    createdBy: "Aisha Patel",
    rules: [
      "Share your app demos",
      "Provide constructive feedback",
      "Discuss best practices",
      "No piracy or illegal content"
    ],
    isPrivate: false,
    memberIds: ["user7", "user8", "user9"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "Design & UX Community",
    description: "Explore design principles, user experience, and creative collaboration. Share designs, get feedback, and learn from fellow designers.",
    category: "Design",
    members: 445,
    topics: ["UI/UX", "Figma", "Prototyping", "User Research", "Visual Design", "Design Systems"],
    recentActivity: "1 week ago",
    status: "active",
    createdAt: "2024-01-05T16:45:00Z",
    createdBy: "Emily Davis",
    rules: [
      "Share your design work",
      "Give constructive feedback",
      "Respect design copyright",
      "Be open to learning"
    ],
    isPrivate: false,
    memberIds: ["user10", "user11", "user12"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
  },
  {
    id: "5",
    name: "DevOps Engineers",
    description: "Connect with DevOps professionals, discuss infrastructure, automation, and best practices. Share tools, scripts, and deployment strategies.",
    category: "DevOps",
    members: 234,
    topics: ["Docker", "Kubernetes", "AWS", "CI/CD", "Monitoring", "Infrastructure"],
    recentActivity: "2 days ago",
    status: "growing",
    createdAt: "2024-01-25T11:20:00Z",
    createdBy: "David Wilson",
    rules: [
      "Share automation scripts",
      "Discuss security best practices",
      "Help with deployment issues",
      "Stay updated with tools"
    ],
    isPrivate: false,
    memberIds: ["user13", "user14", "user15"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop"
  }
];

// Mock data for community posts
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: "1",
    communityId: "1",
    authorId: "user1",
    authorName: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    title: "React 18 New Features - What's Exciting?",
    content: "Just started exploring React 18 and I'm blown away by the new concurrent features. The automatic batching and transitions are game-changers for performance. Anyone else experimenting with these?",
    likes: 24,
    comments: 8,
    createdAt: "2024-01-28T10:00:00Z",
    updatedAt: "2024-01-28T10:00:00Z",
    tags: ["React", "JavaScript", "Frontend"],
    isPinned: false
  },
  {
    id: "2",
    communityId: "1",
    authorId: "user2",
    authorName: "Alex Johnson",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    title: "TypeScript Best Practices for Large Projects",
    content: "Working on a large TypeScript project and looking for best practices. How do you organize your types? Any tips for maintaining type safety across modules?",
    likes: 18,
    comments: 12,
    createdAt: "2024-01-27T15:30:00Z",
    updatedAt: "2024-01-27T15:30:00Z",
    tags: ["TypeScript", "Best Practices", "Architecture"],
    isPinned: true
  },
  {
    id: "3",
    communityId: "2",
    authorId: "user4",
    authorName: "Marcus Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title: "Machine Learning Project: Image Classification",
    content: "Working on an image classification project using TensorFlow. The model is performing well on training data but struggling with validation. Any suggestions for improving generalization?",
    likes: 31,
    comments: 15,
    createdAt: "2024-01-26T09:15:00Z",
    updatedAt: "2024-01-26T09:15:00Z",
    tags: ["Machine Learning", "TensorFlow", "Computer Vision"],
    isPinned: false
  }
];

// Mock data for community comments
export const mockCommunityComments: CommunityComment[] = [
  {
    id: "1",
    postId: "1",
    authorId: "user3",
    authorName: "Mike Chen",
    authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    content: "The automatic batching is incredible! I've seen a 40% improvement in my app's performance. Have you tried the new useTransition hook?",
    likes: 5,
    createdAt: "2024-01-28T11:30:00Z",
    updatedAt: "2024-01-28T11:30:00Z"
  },
  {
    id: "2",
    postId: "1",
    authorId: "user5",
    authorName: "Lisa Wang",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "I'm still on React 17. Is the migration straightforward? Any breaking changes I should be aware of?",
    likes: 3,
    createdAt: "2024-01-28T12:15:00Z",
    updatedAt: "2024-01-28T12:15:00Z"
  },
  {
    id: "3",
    postId: "2",
    authorId: "user6",
    authorName: "Tom Smith",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "I use barrel exports and organize types by domain. Also, consider using branded types for better type safety.",
    likes: 7,
    createdAt: "2024-01-27T16:45:00Z",
    updatedAt: "2024-01-27T16:45:00Z"
  }
];

// Mock data for community members
export const mockCommunityMembers: CommunityMember[] = [
  {
    id: "1",
    communityId: "1",
    userId: "user1",
    userName: "Sarah Chen",
    userImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    role: "admin",
    joinedAt: "2024-01-15T10:00:00Z",
    lastActive: "2024-01-28T10:00:00Z"
  },
  {
    id: "2",
    communityId: "1",
    userId: "user2",
    userName: "Alex Johnson",
    userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    role: "moderator",
    joinedAt: "2024-01-16T14:20:00Z",
    lastActive: "2024-01-28T12:00:00Z"
  },
  {
    id: "3",
    communityId: "1",
    userId: "user3",
    userName: "Mike Chen",
    userImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    role: "member",
    joinedAt: "2024-01-17T09:30:00Z",
    lastActive: "2024-01-28T11:30:00Z"
  }
];

// Helper functions
export const getCommunityById = (id: string): Community | undefined => {
  return mockCommunities.find(community => community.id === id);
};

export const getPostsByCommunityId = (communityId: string): CommunityPost[] => {
  return mockCommunityPosts.filter(post => post.communityId === communityId);
};

export const getCommentsByPostId = (postId: string): CommunityComment[] => {
  return mockCommunityComments.filter(comment => comment.postId === postId);
};

export const getMembersByCommunityId = (communityId: string): CommunityMember[] => {
  return mockCommunityMembers.filter(member => member.communityId === communityId);
};

export const isUserMemberOfCommunity = (userId: string, communityId: string): boolean => {
  const community = getCommunityById(communityId);
  return community ? community.memberIds.includes(userId) : false;
}; 