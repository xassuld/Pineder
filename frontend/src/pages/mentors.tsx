import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useTheme } from "../core/contexts/ThemeContext";
import { useUser } from "@clerk/nextjs";
import TeacherCategory from "../components/features/mentor-pages/TeacherCategory";
import SessionBookingDialog from "../components/features/mentor-pages/SessionBookingDialog";
import { SuccessNotification } from "../design/system/success-notification";
import { Layout } from "../components/layout/Layout";
import { useMentors, Mentor } from "../core/hooks/useMentors";
import { useSessionBooking } from "../core/hooks/useSessionBooking";
import { SignInAlert } from "../components/common/SignInAlert";

const MentorsPage = () => {
  const { isDarkMode, colors } = useTheme();
  const { user, isSignedIn, isLoaded } = useUser();
  const { mentors, isLoading, error, refetch } = useMentors();

  const { bookSession, isLoading: isBooking } = useSessionBooking();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showSignInAlert, setShowSignInAlert] = useState(false);

  // Check authentication status
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShowSignInAlert(true);
    }
  }, [isLoaded, isSignedIn]);

  const handleTeacherClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = async (sessionData: any) => {
    if (!selectedMentor) return;

    // Validate required fields
    if (!sessionData.date || !sessionData.time || !sessionData.subject) {
      setNotificationMessage("Please fill in all required fields.");
      setShowSuccessNotification(true);
      return;
    }

    console.log("Session data received:", sessionData);

    const bookingData = {
      mentorId: selectedMentor._id,
      topic: sessionData.subject || sessionData.topic,
      date: sessionData.date,
      time: sessionData.time,
      studentChoice: sessionData.compensation || "free", // Use the selected compensation
      requestNotes: sessionData.description || sessionData.message,
    };

    console.log("Booking data being sent:", bookingData);

    try {
      const result = await bookSession(bookingData);
      if (result.success) {
        setShowBookingDialog(false);
        setNotificationMessage(result.message);
        setShowSuccessNotification(true);
      } else {
        setNotificationMessage(result.message);
        setShowSuccessNotification(true);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setNotificationMessage("Failed to book session. Please try again.");
      setShowSuccessNotification(true);
    }

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show sign-in alert for unsigned users
  if (!isSignedIn) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1
              className="mb-4 text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              Access Required
            </h1>
            <p className="mb-6 text-gray-600">
              Please sign in to view our mentors and book sessions.
            </p>
          </div>
        </div>
        <SignInAlert
          isOpen={showSignInAlert}
          onClose={() => setShowSignInAlert(false)}
          title="Sign In Required"
          message="Please sign in to access our mentors and book sessions with experienced professionals."
        />
      </Layout>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Find Your Perfect Mentor | Pineder</title>
        </Head>
        <div
          className="flex items-center justify-center min-h-screen pt-24"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading mentors...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <Head>
          <title>Find Your Perfect Mentor | Pineder</title>
        </Head>
        <div
          className="flex items-center justify-center min-h-screen pt-24"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Error Loading Mentors
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
        className="min-h-screen pt-24"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h1
              className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
              style={{ color: colors.text.primary }}
            >
              Find Your Perfect
              <span className="block text-[#08CB00]">Mentor</span>
            </h1>
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
              <div
                className="w-full p-6 transition-all duration-200 border-0 shadow-lg rounded-3xl"
                style={{
                  backgroundColor: isDarkMode
                    ? colors.background.tertiary
                    : colors.background.primary,
                  border: `1px solid ${
                    isDarkMode ? colors.border.primary : colors.border.secondary
                  }`,
                }}
              >
                <div className="space-y-8">
                  {/* Original horizontal scrollable mentor cards */}
                  {mentors.length > 0 ? (
                    <div className="space-y-6">
                      <div className="mb-8">
                        <h2
                          className="text-2xl font-bold text-center"
                          style={{ color: colors.text.primary }}
                        >
                          Software Engineer Mentors
                        </h2>
                      </div>
                      <div className="flex gap-6 pb-4 overflow-x-auto">
                        {mentors.map((mentor) => (
                          <div
                            key={mentor._id}
                            className="flex-shrink-0 p-4 transition-all duration-200 bg-white rounded-lg shadow-md cursor-pointer w-72 hover:shadow-lg"
                            onClick={() => handleTeacherClick(mentor)}
                          >
                            {/* Profile Image */}
                            <div className="flex justify-center mb-3">
                              <div className="w-16 h-16 overflow-hidden rounded-full">
                                {mentor.userId.avatar ? (
                                  <Image
                                    src={mentor.userId.avatar}
                                    alt={
                                      mentor.userId.firstName &&
                                      mentor.userId.firstName.trim() !== ""
                                        ? `${mentor.userId.firstName} ${
                                            mentor.userId.lastName || ""
                                          }`.trim()
                                        : mentor.userId.email
                                        ? mentor.userId.email.split("@")[0]
                                        : "Mentor"
                                    }
                                    width={64}
                                    height={64}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-500 to-blue-600">
                                    <span className="text-lg font-semibold text-white">
                                      {mentor.userId.firstName &&
                                      mentor.userId.firstName.trim() !== ""
                                        ? `${mentor.userId.firstName[0]}${
                                            mentor.userId.lastName?.[0] || ""
                                          }`
                                        : mentor.userId.email
                                        ? mentor.userId.email[0].toUpperCase()
                                        : "M"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Name */}
                            <h3 className="mb-2 text-base font-bold text-center text-gray-900">
                              {mentor.userId.firstName &&
                              mentor.userId.firstName.trim() !== ""
                                ? `${mentor.userId.firstName} ${
                                    mentor.userId.lastName || ""
                                  }`.trim()
                                : mentor.userId.email
                                ? mentor.userId.email.split("@")[0]
                                : "Mentor"}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center justify-center mb-2">
                              <span className="mr-1 text-yellow-500">★</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {mentor.rating.toFixed(1)}
                              </span>
                            </div>

                            {/* Specialties */}
                            <div className="flex flex-col items-center gap-1 mb-4">
                              {mentor.specialties
                                .slice(0, 2)
                                .map((specialty, index) => (
                                  <span
                                    key={index}
                                    className="text-xs font-medium text-green-600"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                            </div>

                            {/* Book Session Button */}
                            <button
                              className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookSession(mentor);
                              }}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Book Session
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-600 dark:text-gray-400">
                        No Mentors Available
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Check back later for available mentors.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Booking Dialog */}
      {showBookingDialog && selectedMentor && (
        <SessionBookingDialog
          mentor={selectedMentor}
          isOpen={showBookingDialog}
          onClose={() => setShowBookingDialog(false)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <SuccessNotification
          isVisible={showSuccessNotification}
          message={notificationMessage}
          onClose={() => setShowSuccessNotification(false)}
        />
      )}
    </Layout>
  );
};

export default MentorsPage;
