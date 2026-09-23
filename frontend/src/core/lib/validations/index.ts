import { z } from "zod";
import { isValidEmail, isValidPhone, isValidUrl } from "../utils/index";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .refine(isValidEmail, "Invalid email format");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .refine(isValidPhone, "Invalid phone number format");

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .refine(isValidUrl, "Invalid URL format");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(
    /^[a-zA-Z\s'-]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

// User validation schemas
export const userRegistrationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: nameSchema,
    lastName: nameSchema,
    role: z.enum(["student", "mentor"]),
    agreeToTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must agree to the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  avatar: urlSchema.optional(),
  phone: phoneSchema.optional(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

// Mentor validation schemas
export const mentorProfileSchema = userProfileSchema.extend({
  specialties: z
    .array(z.string())
    .min(1, "At least one specialty is required")
    .max(10, "Maximum 10 specialties allowed"),
  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  hourlyRate: z
    .number()
    .min(10, "Hourly rate must be at least $10")
    .max(500, "Hourly rate cannot exceed $500"),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        institution: z.string().min(1, "Institution is required"),
        year: z
          .number()
          .min(1900, "Invalid year")
          .max(new Date().getFullYear(), "Year cannot be in the future"),
      })
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1, "Certification name is required"),
        issuer: z.string().min(1, "Issuer is required"),
        year: z
          .number()
          .min(1900, "Invalid year")
          .max(new Date().getFullYear(), "Year cannot be in the future"),
      })
    )
    .optional(),
  availability: z
    .array(
      z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Invalid time format (HH:MM)"
          ),
        endTime: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Invalid time format (HH:MM)"
          ),
        isAvailable: z.boolean(),
      })
    )
    .optional(),
});

// Student validation schemas
export const studentProfileSchema = userProfileSchema.extend({
  grade: z.string().min(1, "Grade is required"),
  subjects: z
    .array(z.string())
    .min(1, "At least one subject is required")
    .max(10, "Maximum 10 subjects allowed"),
  goals: z.array(z.string()).max(5, "Maximum 5 goals allowed").optional(),
  learningStyle: z
    .enum(["visual", "auditory", "kinesthetic", "reading", "mixed"])
    .optional(),
  preferredSessionLength: z
    .number()
    .min(30, "Minimum session length is 30 minutes")
    .max(240, "Maximum session length is 4 hours")
    .optional(),
});

// Session validation schemas
export const sessionBookingSchema = z
  .object({
    mentorId: z.string().min(1, "Mentor is required"),
    subject: z.string().min(1, "Subject is required"),
    startTime: z.date().min(new Date(), "Start time must be in the future"),
    endTime: z.date().min(new Date(), "End time must be in the future"),
    notes: z
      .string()
      .max(500, "Notes must be less than 500 characters")
      .optional(),
    sessionType: z.enum(["individual", "group"]).default("individual"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const sessionUpdateSchema = z.object({
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
  status: z
    .enum(["scheduled", "completed", "cancelled", "rescheduled"])
    .optional(),
});

// Group session validation schemas
export const groupSessionSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description must be less than 1000 characters"),
    subject: z.string().min(1, "Subject is required"),
    maxStudents: z
      .number()
      .min(2, "Minimum 2 students required")
      .max(20, "Maximum 20 students allowed"),
    startTime: z.date().min(new Date(), "Start time must be in the future"),
    endTime: z.date().min(new Date(), "End time must be in the future"),
    price: z.number().min(0, "Price cannot be negative").optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

// Topic validation schemas
export const topicSubmissionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  category: z.string().min(1, "Category is required"),
});

// Community validation schemas
export const communityPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
  category: z.string().min(1, "Category is required").optional(),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed").optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment must be less than 1000 characters"),
});

// Search and filter validation schemas
export const searchSchema = z.object({
  query: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must be less than 100 characters"),
  filters: z
    .object({
      subject: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      priceRange: z
        .object({
          min: z.number().min(0).optional(),
          max: z.number().min(0).optional(),
        })
        .optional(),
      availability: z.string().optional(),
    })
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Payment validation schemas
export const paymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(3).max(3).default("USD"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  sessionId: z.string().optional(),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
  allowedTypes: z
    .array(z.string())
    .default(["image/jpeg", "image/png", "application/pdf"]),
});

// Form validation helpers
export const validateRequired = (
  value: any,
  fieldName: string
): string | null => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!isValidEmail(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return null; // Phone is optional
  if (!isValidPhone(phone)) return "Invalid phone number format";
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!url) return null; // URL is optional
  if (!isValidUrl(url)) return "Invalid URL format";
  return null;
};

export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string
): string | null => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string
): string | null => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`;
  }
  return null;
};

export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null => {
  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

// Composite validation function
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const error = rules[field](data[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

export const schemas = {
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  url: urlSchema,
  name: nameSchema,
  userRegistration: userRegistrationSchema,
  userLogin: userLoginSchema,
  userProfile: userProfileSchema,
  mentorProfile: mentorProfileSchema,
  studentProfile: studentProfileSchema,
  sessionBooking: sessionBookingSchema,
  sessionUpdate: sessionUpdateSchema,
  groupSession: groupSessionSchema,
  topicSubmission: topicSubmissionSchema,
  communityPost: communityPostSchema,
  comment: commentSchema,
  search: searchSchema,
  payment: paymentSchema,
  fileUpload: fileUploadSchema,
};
