import React from "react";
import { Star, MapPin, Users } from "lucide-react";
import { Badge } from "../../../design/system/badge";

interface Teacher {
  id?: string | number;
  _id?: string;
  name?: string;
  avatar?: string;
  expertise?: string[];
  specialties?: string[];
  rating?: number;
  totalStudents?: number;
  totalSessions?: number;
  sessions?: number;
  hourlyRate?: number;
  location?: string;
  availability?: string;
  nextAvailable?: string;
  description?: string;
  about?: string;
  role?: string;
  company?: string;
  // Mentor data structure
  userId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    title?: string;
    bio?: string;
  };
}

interface TeacherInfoHeaderProps {
  teacher: Teacher;
  colors?: any;
}

export const TeacherInfoHeader: React.FC<TeacherInfoHeaderProps> = ({
  teacher,
  colors,
}) => {
  const themeColors = colors || {
    text: {
      primary: "#000000",
      secondary: "#6b7280",
    },
  };

  // Get the teacher name from either name field or firstName + lastName
  const teacherName =
    teacher.name ||
    (teacher.userId
      ? `${teacher.userId.firstName || ""} ${
          teacher.userId.lastName || ""
        }`.trim()
      : "Mentor");

  // Get the first character for the avatar
  const firstChar = teacherName.charAt(0) || "M";

  return (
    <div className="space-y-4">
      {/* Teacher Basic Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
          {firstChar}
        </div>
        <div>
          <h3
            className="text-xl font-semibold"
            style={{ color: themeColors.text.primary }}
          >
            Book Session with {teacherName}
          </h3>
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: themeColors.text.secondary }}
          >
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>
              {teacher.rating} ({teacher.totalSessions || teacher.sessions || 0}{" "}
              sessions)
            </span>
            <span>•</span>
            <span>${teacher.hourlyRate || 0}/hr</span>
          </div>
        </div>
      </div>

      {/* Teacher Details */}
      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin
              className="w-4 h-4"
              style={{ color: themeColors.text.secondary }}
            />
            <span
              className="text-sm"
              style={{ color: themeColors.text.secondary }}
            >
              {teacher.location}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Users
              className="w-4 h-4"
              style={{ color: themeColors.text.secondary }}
            />
            <span
              className="text-sm"
              style={{ color: themeColors.text.secondary }}
            >
              {teacher.totalStudents || 0} students
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(teacher.expertise || teacher.specialties || []).slice(0, 5).map((skill: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
