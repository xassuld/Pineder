import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "../../../design/system";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system";
import { Input } from "../../../design/system";
import { Label } from "../../../design/system";
import { Textarea } from "../../../design/system";
import { Avatar, AvatarFallback, AvatarImage } from "../../../design/system";
import { Badge } from "../../../design/system";
import { Upload, User, GraduationCap, Hash, Mail, Edit } from "lucide-react";
import { api } from "../../../core/lib/api";

interface StudentProfileForm {
  className: string;
  studentCode: string;
  email: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
}

interface StudentProfileCreationProps {
  isEditMode?: boolean;
  existingData?: Partial<StudentProfileForm>;
}

const StudentProfileCreation: React.FC<StudentProfileCreationProps> = ({
  isEditMode = false,
  existingData = {},
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<StudentProfileForm>({
    className: existingData.className || "",
    studentCode: existingData.studentCode || "",
    email: existingData.email || "",
    bio: existingData.bio || "",
    avatar: existingData.avatar || "",
    backgroundImage: existingData.backgroundImage || "",
  });

  // Set email from Clerk user (only if not in edit mode)
  useEffect(() => {
    if (user && !isEditMode) {
      const email = user.emailAddresses[0]?.emailAddress || "";
      const studentId = email.split("@")[0] || ""; // Extract part before @nest.edu.mn

      setFormData((prev) => ({
        ...prev,
        email: email,
        studentCode: studentId, // Set student ID automatically
      }));
    }
  }, [user, isEditMode]);

  // Update form data when existingData changes (for edit mode)
  useEffect(() => {
    if (isEditMode && existingData) {
      const email =
        existingData.email || user?.emailAddresses[0]?.emailAddress || "";
      const studentId = existingData.studentCode || email.split("@")[0] || "";

      setFormData({
        className: existingData.className || "",
        studentCode: studentId, // Use existing or generate from email
        email: email,
        bio: existingData.bio || "",
        avatar: existingData.avatar || "",
        backgroundImage: existingData.backgroundImage || "",
      });
    }
  }, [isEditMode, existingData, user]);

  const handleInputChange = (
    field: keyof StudentProfileForm,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "pineder_profiles"
      );
      formData.append(
        "cloud_name",
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name"
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name"
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setFormData((prev) => ({ ...prev, avatar: result.secure_url }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user is authenticated
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use PUT for update, POST for create
      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode ? "/api/students/profile" : "/api/students";

      const requestBody: any = {};

      // Only include fields that have actual values
      requestBody.email = user.emailAddresses[0]?.emailAddress || "";
      if (formData.className) requestBody.className = formData.className;
      if (formData.studentCode) requestBody.studentCode = formData.studentCode;
      if (formData.bio) requestBody.bio = formData.bio;
      if (formData.avatar) requestBody.avatar = formData.avatar;
      if (formData.backgroundImage)
        requestBody.backgroundImage = formData.backgroundImage;

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "student",
            "x-user-email": user.emailAddresses[0]?.emailAddress || "",
            "x-user-id": user.id,
            "x-user-firstname": user.firstName || "",
            "x-user-lastname": user.lastName || "",
          },
          body: JSON.stringify(requestBody),
        }
      );

      let result;
      try {
        result = JSON.parse(await response.text());
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error(
          `Server returned invalid JSON. Status: ${response.status}`
        );
      }

      if (response.ok && result.success) {
        // Redirect to student dashboard or profile page
        router.push("/user/student-dashboard");
      } else {
        throw new Error(
          result.message ||
            result.error ||
            `Failed to ${isEditMode ? "update" : "create"} profile`
        );
      }
    } catch (error) {
      console.error(
        `Profile ${isEditMode ? "update" : "creation"} failed:`,
        error
      );
      alert(
        `Failed to ${
          isEditMode ? "update" : "create"
        } profile. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    // Use Clerk user's name if available, otherwise use email initials
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase();
    } else if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else {
      // Fallback to email initials
      const email = formData.email || "";
      const parts = email.split("@")[0].split(".");
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return email.charAt(0).toUpperCase();
    }
  };

  const handleBackClick = () => {
    if (isEditMode) {
      // If editing profile, go back to student dashboard
      router.push("/user/student-dashboard");
    } else {
      // If creating new profile, go to homepage
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        {/* Background Image */}
        <div className="relative h-64 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          {formData.backgroundImage ? (
            <Image
              src={formData.backgroundImage}
              alt="Background"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          )}

          {/* Background Upload Button */}
          <div className="absolute top-4 right-4">
            <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg cursor-pointer bg-black/70 hover:bg-black/90 backdrop-blur-sm">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const result = e.target?.result as string;
                      setFormData((prev) => ({
                        ...prev,
                        backgroundImage: result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <Upload className="w-4 h-4" />
              Upload Background
            </label>
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="absolute bottom-0 z-10 transform -translate-x-1/2 translate-y-1/2 left-1/2">
          <div className="relative">
            <Avatar className="w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-lg">
              <AvatarImage
                src={formData.avatar}
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="flex items-center justify-center w-full h-full text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="absolute inset-0 flex items-center justify-center transition-opacity rounded-full opacity-0 bg-black/50 hover:opacity-100">
              <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors rounded-lg cursor-pointer bg-black/70 hover:bg-black/90 backdrop-blur-sm">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-4 h-4" />
                Change Photo
              </label>
            </div>

            {/* Online Status Indicator */}
            <div className="absolute w-6 h-6 bg-green-500 border-4 border-white rounded-full bottom-2 right-2" />
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl px-4 pb-12 mx-auto -mt-16 sm:px-6 lg:px-8">
        <div className="pt-40"></div>

        <div className="grid grid-cols-1 gap-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="mb-2 text-3xl font-bold text-foreground">
                    {isEditMode
                      ? "Edit Student Profile"
                      : "Student Profile Creation"}
                  </h1>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 text-lg text-muted-foreground"
                  >
                    <span className="text-lg text-center lg:text-left">
                      {isEditMode
                        ? "Update your profile information"
                        : "Complete your profile to start learning"}
                    </span>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <User className="w-5 h-5" />
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Class/Major
                    </Label>
                    <select
                      value={formData.className}
                      onChange={(e) =>
                        handleInputChange("className", e.target.value)
                      }
                      className="w-full p-3 mt-1 border rounded-lg focus:border-blue-500"
                    >
                      <option value="">Select your class</option>
                      <option value="Fullstack">Fullstack</option>
                      <option value="UX/UI">UX/UI</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Student ID
                    </Label>
                    <Input
                      value={formData.studentCode}
                      className="mt-1 bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      value={formData.email}
                      className="mt-1 bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Bio
                  </Label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="w-full p-3 mt-1 border rounded-lg resize-none focus:border-blue-500"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Action Buttons */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBackClick}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditMode ? "Back to Dashboard" : "Back to Home"}
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                  onClick={handleSubmit}
                >
                  {isLoading
                    ? isEditMode
                      ? "Updating Profile..."
                      : "Creating Profile..."
                    : isEditMode
                    ? "Update Profile"
                    : "Create Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="fixed z-50 w-64 p-4 bg-white rounded-lg shadow-lg top-4 right-4">
          <div className="mb-2 text-sm font-medium">Uploading Image...</div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfileCreation;
