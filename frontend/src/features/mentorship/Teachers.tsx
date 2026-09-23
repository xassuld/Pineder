import React, { useState } from "react";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../design/system/card";
import TeacherCategory from "../../components/features/mentor-pages/TeacherCategory";
import SessionBookingDialog from "../../components/features/mentor-pages/SessionBookingDialog";
import { SuccessNotification } from "../../design/system/success-notification";
import { Navigation } from "../../components/layout/Navigation";
import { Footer } from "../../components/layout/Footer";
import { mentorCategories } from "../../core/lib/data/mentors";

export function Teachers() {
  const { isDarkMode, colors } = useTheme();
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleTeacherClick = (mentor: any) => {
    setSelectedMentor(mentor);
  };

  const handleBookSession = (mentor: any) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = (sessionData: any) => {
    const newSession = {
      id: Date.now().toString(),
      mentorId: sessionData.mentorId,
      mentorName: selectedMentor?.name || "",
      mentorImage: selectedMentor?.image || "",
      mentorRole: selectedMentor?.role || "",
      date: sessionData.date,
      time: sessionData.time,
      sessionType: sessionData.sessionType,
      topic: sessionData.topic,
      duration: sessionData.duration,
      status: "upcoming",
    };

    if (typeof window !== "undefined") {
      const existingSessions = JSON.parse(
        localStorage.getItem("user-sessions") || "[]"
      );
      const updatedSessions = [newSession, ...existingSessions];
      localStorage.setItem("user-sessions", JSON.stringify(updatedSessions));

      window.dispatchEvent(
        new CustomEvent("sessionBooked", { detail: newSession })
      );
    }

    setShowBookingDialog(false);
    setShowSuccessNotification(true);

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  return (
    <section
      className="py-24"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2
            className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{ color: colors.text.primary }}
          >
            Find Your Perfect
            <span
              className="block bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.accent.success}, ${colors.accent.info}, ${colors.accent.warning})`,
              }}
            >
              Mentor
            </span>
          </h2>
          <p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: colors.text.secondary }}
          >
            Connect with experienced professionals who can guide you on your
            journey to success.
          </p>
        </div>

        <div className="w-full">
          {/* Full Width Mentor Categories */}
          <div className="w-full">
            <Card
              className="w-full p-6 border-0 shadow-lg rounded-3xl"
              style={{
                backgroundColor: isDarkMode
                  ? colors.background.secondary
                  : colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              <div className="space-y-8">
                {mentorCategories.map((category, categoryIndex) => (
                  <TeacherCategory
                    key={categoryIndex}
                    category={category}
                    isDarkMode={isDarkMode}
                    onTeacherClick={handleTeacherClick}
                    onBookSession={handleBookSession}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Session Booking Dialog */}
      <SessionBookingDialog
        mentor={selectedMentor}
        isOpen={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        onConfirm={handleConfirmBooking}
      />

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccessNotification}
        message="Session booked successfully! Check your sessions dashboard."
        onClose={() => setShowSuccessNotification(false)}
      />
    </section>
  );
}
