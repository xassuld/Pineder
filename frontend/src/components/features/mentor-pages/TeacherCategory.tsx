import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Badge } from "../../../design/system/badge";
import { Button } from "../../../design/system/button";
import { Users, Star, Clock, MapPin } from "lucide-react";

interface Teacher {
  id: string | number;
  name: string;
  avatar?: string;
  expertise: string[];
  rating: number;
  totalStudents?: number;
  totalSessions?: number;
  sessions?: number;
  hourlyRate?: number;
  location: string;
  availability?: string;
  nextAvailable?: string;
  description?: string;
  about?: string;
  role?: string;
  company?: string;
}

interface TeacherCategoryProps {
  title?: string;
  teachers?: Teacher[];
  category?: {
    title: string;
    mentors: Teacher[];
  };
  isDarkMode?: boolean;
  onTeacherSelect?: (teacher: Teacher) => void;
  onTeacherClick?: (teacher: Teacher | any) => void;
  onBookSession?: (teacher: Teacher | any) => void;
  showViewAll?: boolean;
  colors?: any;
}

const TeacherCategory: React.FC<TeacherCategoryProps> = ({
  title,
  teachers,
  category,
  isDarkMode,
  onTeacherSelect,
  onTeacherClick,
  onBookSession,
  showViewAll = false,
  colors,
}) => {
  // Use either teachers array or category.mentors array
  const teacherList = teachers || category?.mentors || [];
  const displayTitle = title || category?.title || "Mentors";

  // Use colors if provided, otherwise create a default theme
  const themeColors = colors || {
    text: {
      primary: isDarkMode ? "#ffffff" : "#000000",
      secondary: isDarkMode ? "#9ca3af" : "#6b7280",
    },
  };

  if (teacherList.length === 0) {
    return null;
  }

  const handleTeacherClick = (teacher: Teacher) => {
    if (onTeacherSelect) {
      onTeacherSelect(teacher);
    } else if (onTeacherClick) {
      onTeacherClick(teacher);
    }
  };

  const handleBookSession = (teacher: Teacher) => {
    if (onBookSession) {
      onBookSession(teacher);
    }
  };

  return (
    <div className="mb-8">
      <h2
        className="mb-4 text-2xl font-bold"
        style={{ color: themeColors.text.primary }}
      >
        {displayTitle}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teacherList.map((teacher) => (
          <Card
            key={teacher.id}
            className="transition-all duration-300 border-2 cursor-pointer hover:shadow-lg hover:border-blue-500"
            onClick={() => handleTeacherClick(teacher)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                  {teacher.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: themeColors.text.primary }}
                  >
                    {teacher.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span
                      className="text-sm"
                      style={{ color: themeColors.text.secondary }}
                    >
                      {teacher.rating} (
                      {teacher.totalSessions || teacher.sessions || 0} sessions)
                    </span>
                  </div>
                  {teacher.role && (
                    <p
                      className="text-sm"
                      style={{ color: themeColors.text.secondary }}
                    >
                      {teacher.role} at {teacher.company}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {teacher.expertise.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {teacher.expertise.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.expertise.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Users
                      className="w-4 h-4"
                      style={{ color: themeColors.text.secondary }}
                    />
                    <span style={{ color: themeColors.text.secondary }}>
                      {teacher.totalStudents || 0} students
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock
                      className="w-4 h-4"
                      style={{ color: themeColors.text.secondary }}
                    />
                    <span style={{ color: themeColors.text.secondary }}>
                      {teacher.availability ||
                        teacher.nextAvailable ||
                        "Available"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
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
                  {teacher.hourlyRate && (
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">
                        ${teacher.hourlyRate}/hr
                      </span>
                    </div>
                  )}
                </div>

                <p
                  className="text-sm line-clamp-2"
                  style={{ color: themeColors.text.secondary }}
                >
                  {teacher.description ||
                    teacher.about ||
                    "Experienced mentor ready to help you grow."}
                </p>

                <Button
                  className="w-full text-white bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookSession(teacher);
                  }}
                >
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeacherCategory;
