export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "student" | "mentor" | "admin";
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mentor extends User {
  role: "mentor";
  specialties: string[];
  bio: string;
  experience: number;
  rating: number;
  hourlyRate: number;
  availability: Availability[];
  sessions: Session[];
}

export interface Student extends User {
  role: "student";
  grade: string;
  subjects: string[];
  goals: string[];
  sessions: Session[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  studentId: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | "upcoming";
  subject: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  isGroupSession?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  mentor?: {
    name: string;
    image: string;
    expertise: string[];
    rating: number;
  };
  date?: string;
  time?: string;
  duration?: string;
  price?: number;
  studentChoice?: "ice cream" | "coffee" | "free";
  meetingLink?: string;
}

export interface GroupSession {
  id: string;
  title: string;
  description: string;
  mentorId: string;
  maxStudents: number;
  currentStudents: number;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "active" | "completed" | "cancelled";
  subject: string;
  topics: Topic[];
  students: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  votes: number;
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
}

export interface Availability {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  members: string[];
  posts: Post[];
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  communityId: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: Date;
}

export interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "date";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: any;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    muted: string;
  };
  foreground: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  accent: {
    primary: string;
    secondary: string;
  };
}

export interface ThemeContextType {
  colorTheme: string;
  toggleTheme: () => void;
  setColorTheme: (theme: string) => void;
  isDarkMode: boolean;
  colors: ThemeColors;
}

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItem[];
}

export interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  totalHours: number;
  averageRating: number;
}

export interface DashboardWidget {
  id: string;
  title: string;
  content: React.ReactNode;
  size: "small" | "medium" | "large";
  position: { x: number; y: number };
}

export interface SessionFilters {
  subject?: string;
  status?: string;
  dateRange?: { start: Date; end: Date };
  mentorId?: string;
  studentId?: string;
}

export interface SessionBooking {
  mentorId: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

export interface MentorFilters {
  subject?: string;
  rating?: number;
  priceRange?: { min: number; max: number };
  availability?: string;
}

export interface MentorSearchParams {
  query?: string;
  subject?: string;
  rating?: number;
  priceRange?: { min: number; max: number };
  availability?: string;
  page?: number;
  limit?: number;
}

export interface CommunityFilters {
  category?: string;
  memberCount?: number;
  activity?: string;
}

export type Status = "idle" | "loading" | "success" | "error";

export interface LoadingState {
  status: Status;
  message?: string;
  error?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "session" | "group-session" | "meeting";
  color?: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: Record<string, any>;
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  sessionId?: string;
  userId: string;
  createdAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacyLevel: "public" | "private" | "friends";
  timezone: string;
  language: string;
}
