import React, { useState } from "react";
import Head from "next/head";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { Navigation } from "../../components/layout/Navigation";
import TeacherCategory from "../../components/features/mentor-pages/TeacherCategory";
import SessionBookingDialog from "../../components/features/mentor-pages/SessionBookingDialog";
import { SuccessNotification } from "../../design/system/success-notification";
import { Footer } from "../../components/layout/Footer";
import { mentorCategories, Mentor } from "../../core/lib/data/mentors";

const MentorsPage = () => {
  const { isDarkMode } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(4); // Default to Forest theme
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Text color based on theme mode
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const mutedTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";
  const backgroundColor = isDarkMode ? "bg-[#0F0E0E]" : "bg-white";
  const cardBackground = isDarkMode ? "bg-[#0F0E0E]" : "bg-white";
  const borderColor = isDarkMode ? "border-white/20" : "border-black/20";

  const handleTeacherClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = (sessionData: any) => {
    setShowBookingDialog(false);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  return (
    <>
      <Head>
        <title>Find Your Perfect Mentor | Pineder</title>
        <meta
          name="description"
          content="Find your perfect mentor on Pineder - Connect with experienced professionals to accelerate your growth."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen transition-colors duration-200 ${backgroundColor}`}
      >
        <Navigation />
        <main className="pt-24">
          <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <h1
                className={`mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl ${textColor}`}
              >
                Find Your Perfect
                <span className="block bg-gradient-to-r from-[var(--pico-primary)] via-[var(--pico-secondary)] to-[var(--pico-accent)] bg-clip-text text-transparent">
                  Mentor
                </span>
              </h1>
              <p className={`max-w-2xl mx-auto text-lg ${mutedTextColor}`}>
                Connect with experienced professionals who can guide you on your
                journey to success.
              </p>
            </div>

            <div className="w-full">
              {/* Full Width Mentor Categories */}
              <div className="w-full">
                <div
                  className={`w-full p-6 border-0 shadow-lg transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20"
                      : "bg-white border border-black/20"
                  } rounded-3xl`}
                >
                  <div className="space-y-8">
                    {mentorCategories.map((category, categoryIndex) => (
                      <TeacherCategory
                        key={categoryIndex}
                        category={category}
                        isDarkMode={isDarkMode}
                        onTeacherClick={handleTeacherClick}
                        onBookSession={handleBookSession}
                        showViewAll={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
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
    </>
  );
};

export default MentorsPage;
