import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
const emailSchema = z.string().email("Invalid email format");
const dateSchema = z.string().datetime().or(z.date());

export const createUserSchema = z.object({
  email: emailSchema,
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name too long")
    .optional(),
  role: z.enum(["student", "mentor", "other"]),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  bio: z.string().max(500, "Bio too long").optional(),
  profileCompleted: z.boolean().default(false),
  preferences: z
    .object({
      notifications: z.boolean().default(true),
      emailUpdates: z.boolean().default(true),
    })
    .default({
      notifications: true,
      emailUpdates: true,
    }),
});

export const updateUserSchema = createUserSchema.partial();

export const userQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  role: z.enum(["student", "mentor", "other"]).optional(),
  search: z.string().optional(),
});

export const createMentorSchema = z.object({
  title: z.string().min(1, "Professional title is required").optional(),
  email: emailSchema,
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(1000, "Bio too long")
    .optional(),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  specialties: z
    .array(z.string().min(1, "Specialty cannot be empty"))
    .min(1, "At least one specialty required")
    .optional(),
  mentorType: z.string().default("Software Engineer"),
});

export const updateMentorSchema = z.object({
  title: z.string().min(1, "Professional title is required").optional(),
  email: emailSchema.optional(),
  bio: z.string().max(1000, "Bio too long").optional(),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
  specialties: z
    .array(z.string().min(1, "Specialty cannot be empty"))
    .optional(),
  mentorType: z.string().default("Software Engineer").optional(),
});

export const mentorQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  specialty: z.string().optional(),
  verified: z.enum(["true", "false"]).optional(),
});

export const createStudentSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  studentCode: z.string().min(1, "Student code is required"),
  email: emailSchema,
  bio: z.string().max(500, "Bio too long").optional(),
  avatar: z.string().optional(),
  backgroundImage: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

export const studentQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  className: z.string().optional(),
});

export const createSessionSchema = z.object({
  mentorId: objectIdSchema,
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  topic: z.string().min(1, "Topic is required").max(200, "Topic too long"),
  studentChoice: z.enum(["free", "coffee", "ice-cream"]),
  requestNotes: z.string().max(1000, "Request notes too long").optional(),
  // Legacy fields for backward compatibility
  startTime: dateSchema.optional(),
  endTime: dateSchema.optional(),
  message: z.string().max(1000, "Message too long").optional(),
});

export const updateSessionSchema = createSessionSchema.partial().extend({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long")
    .optional(),
  studentId: objectIdSchema.optional(),
  status: z
    .enum(["requested", "scheduled", "ongoing", "completed", "cancelled"])
    .optional(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),
  feedback: z.string().max(1000, "Feedback too long").optional(),
  recordingUrl: z.string().url("Invalid recording URL").optional(),
  materials: z.array(z.string().url("Invalid material URL")).optional(),
  paymentStatus: z
    .enum(["pending", "completed", "failed", "refunded"])
    .optional(),
  rejectionReason: z.string().max(500, "Rejection reason too long").optional(),
  approvedAt: dateSchema.optional(),
});

export const sessionQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .pipe(z.number().min(1).max(100))
    .default(() => 10),
  status: z
    .enum(["requested", "scheduled", "ongoing", "completed", "cancelled"])
    .optional(),
  mentorId: objectIdSchema.optional(),
  studentId: objectIdSchema.optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
});

export const createRatingSchema = z.object({
  mentorId: objectIdSchema,
  studentId: objectIdSchema,
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().max(500, "Comment too long").optional(),
});

export const updateRatingSchema = createRatingSchema.partial();

export const ratingQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  mentorId: objectIdSchema.optional(),
  studentId: objectIdSchema.optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  maxRating: z.coerce.number().min(1).max(5).optional(),
});

export const createTopicSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string().min(1, "Tag cannot be empty")).optional(),
});

export const updateTopicSchema = createTopicSchema.partial();

export const topicQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;

export type CreateMentorInput = z.infer<typeof createMentorSchema>;
export type UpdateMentorInput = z.infer<typeof updateMentorSchema>;
export type MentorQueryInput = z.infer<typeof mentorQuerySchema>;

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentQueryInput = z.infer<typeof studentQuerySchema>;

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type SessionQueryInput = z.infer<typeof sessionQuerySchema>;

export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>;
export type RatingQueryInput = z.infer<typeof ratingQuerySchema>;

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>;
export type TopicQueryInput = z.infer<typeof topicQuerySchema>;
