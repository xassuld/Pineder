import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import StudentProfileCreation from "../../components/features/user-profile/StudentProfileCreation";

const StudentProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [existingData, setExistingData] = useState({});

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchProfile = async () => {
        try {
          setIsLoadingProfile(true);
          const email = user.emailAddresses[0]?.emailAddress;

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
            }/api/students/profile`,
            {
              headers: {
                "x-user-role": "student",
                "x-user-email": email || "",
                "x-user-id": user.id,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();

            if (data.success && data.data) {
              const backendProfile = data.data;

              const profileData = {
                firstName: backendProfile.firstName || "",
                lastName: backendProfile.lastName || "",
                className: backendProfile.major || "", // Backend returns 'major', map to 'className'
                studentCode: backendProfile.studentCode || "",
                email: backendProfile.email || "",
                bio: backendProfile.bio || "",
                avatar: backendProfile.avatar || "",
                backgroundImage: backendProfile.backgroundImage || "",
                grade: backendProfile.grade || "Beginner",
                subjects: backendProfile.subjects || [],
                goals: backendProfile.goals || [],
              };
              setExistingData(profileData);
            }
          }
        } catch (error) {
          console.error("Error fetching student profile:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, [isSignedIn, user]);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Head>
        <title>Student Profile Creation | Pineder</title>
        <meta
          name="description"
          content="Complete your student profile to start learning"
        />
      </Head>

      <StudentProfileCreation
        existingData={existingData}
        isEditMode={
          Object.keys(existingData).length > 0 &&
          (existingData as any).firstName !== ""
        }
      />
    </div>
  );
};

export default StudentProfilePage;
