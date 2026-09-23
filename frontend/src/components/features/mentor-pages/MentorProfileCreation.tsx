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
import { Checkbox } from "../../../design/system";
import { Upload, User, Star, Edit } from "lucide-react";
import { api } from "../../../core/lib/api";

interface MentorProfileForm {
  title: string;
  email: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  specialties: string[];
  mentorType: string;
}

const MENTOR_TYPE_OPTIONS = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Security Engineer",
  "QA Engineer",
  "Technical Lead",
  "Engineering Manager",
  "Startup Founder",
  "Career Coach",
  "Other",
];

const EXPERTISE_OPTIONS = [
  "React",
  "Python",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "C#",
  ".NET",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Dart",
  "Flutter",
  "React Native",
  "Vue.js",
  "Angular",
  "Next.js",
  "Express.js",
  "Django",
  "Flask",
  "FastAPI",
  "Spring Boot",
  "Laravel",
  "Ruby on Rails",
  "ASP.NET",
  "GraphQL",
  "REST API",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "DevOps",
  "CI/CD",
  "Machine Learning",
  "Data Science",
  "Artificial Intelligence",
  "Computer Vision",
  "Natural Language Processing",
  "Blockchain",
  "Web3",
  "Cybersecurity",
  "UI/UX Design",
  "Product Management",
  "Agile/Scrum",
  "System Design",
  "Algorithms",
  "Data Structures",
  "Database Design",
  "Microservices",
  "Serverless",
  "Mobile Development",
  "Game Development",
  "Embedded Systems",
  "IoT",
  "Cloud Architecture",
  "Performance Optimization",
  "Testing",
  "Code Review",
  "Technical Writing",
  "Public Speaking",
  "Leadership",
  "Mentoring",
  "Career Development",
];

interface MentorProfileCreationProps {
  isEditMode?: boolean;
  existingData?: Partial<MentorProfileForm>;
}

const MentorProfileCreation: React.FC<MentorProfileCreationProps> = ({
  isEditMode = false,
  existingData = {},
}) => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<MentorProfileForm>({
    title: existingData.title || "",
    email: existingData.email || "",
    bio: existingData.bio || "",
    avatar: existingData.avatar || "",
    backgroundImage: existingData.backgroundImage || "",
    specialties: existingData.specialties || [],
    mentorType: existingData.mentorType || "",
  });

  // Set email from Clerk user (only if not in edit mode)
  useEffect(() => {
    if (user && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        email: user.emailAddresses[0]?.emailAddress || "",
      }));
    }
  }, [user, isEditMode]);

  // Update form data when existingData changes (for edit mode)
  useEffect(() => {
    if (isEditMode && existingData) {
      setFormData({
        title: existingData.title || "",
        email: existingData.email || "",
        bio: existingData.bio || "",
        avatar: existingData.avatar || "",
        backgroundImage: existingData.backgroundImage || "",
        specialties: existingData.specialties || [],
        mentorType: existingData.mentorType || "",
      });
    }
  }, [isEditMode, existingData]);

  const handleInputChange = (
    field: keyof MentorProfileForm,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpertiseToggle = (expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(expertise)
        ? prev.specialties.filter((e) => e !== expertise)
        : [...prev.specialties, expertise],
    }));
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
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
      const endpoint = isEditMode ? "/api/mentors/profile" : "/api/mentors";

      const requestBody: any = {};

      // Only include fields that have actual values
      requestBody.email = user.emailAddresses[0]?.emailAddress || "";
      if (formData.title) requestBody.title = formData.title;
      if (formData.bio) requestBody.bio = formData.bio;
      if (formData.avatar) requestBody.avatar = formData.avatar;
      if (formData.backgroundImage)
        requestBody.backgroundImage = formData.backgroundImage;
      if (formData.specialties && formData.specialties.length > 0)
        requestBody.specialties = formData.specialties;
      if (formData.mentorType) requestBody.mentorType = formData.mentorType;

      console.log("Sending mentor profile update:", {
        method,
        endpoint,
        requestBody,
        isEditMode,
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "mentor",
            "x-user-email": user.emailAddresses[0]?.emailAddress || "",
            "x-user-id": user.id,
            "x-user-firstname": user.firstName || "",
            "x-user-lastname": user.lastName || "",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error(
          `Server returned invalid JSON. Status: ${response.status}, Response: ${responseText}`
        );
      }

      console.log("Parsed result:", result);

      if (response.ok && result.success) {
        // Redirect based on mode
        if (isEditMode) {
          router.push("/mentor/dashboard");
        } else {
          router.push("/");
        }
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
      // If editing profile, go back to mentor dashboard
      router.push("/mentor/dashboard");
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
                      ? "Edit Mentor Profile"
                      : "Mentor Profile Creation"}
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
                        : "Complete your profile to start mentoring students"}
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
                      Professional Title
                    </Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g., Senior Software Engineer"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Mentor Type
                    </Label>
                    <select
                      value={formData.mentorType}
                      onChange={(e) =>
                        handleInputChange("mentorType", e.target.value)
                      }
                      className="w-full p-3 mt-1 border rounded-lg focus:border-blue-500"
                    >
                      <option value="">Select your mentor type</option>
                      {MENTOR_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
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
                    placeholder="Tell us about your experience and expertise..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Areas of Expertise */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <Star className="w-5 h-5" />
                Areas of Expertise
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {EXPERTISE_OPTIONS.slice(0, 20).map((expertise) => (
                  <div key={expertise} className="flex items-center space-x-2">
                    <Checkbox
                      id={expertise}
                      checked={formData.specialties.includes(expertise)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData((prev) => ({
                            ...prev,
                            specialties: [...prev.specialties, expertise],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            specialties: prev.specialties.filter(
                              (e) => e !== expertise
                            ),
                          }));
                        }
                      }}
                    />
                    <Label
                      htmlFor={expertise}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {expertise}
                    </Label>
                  </div>
                ))}
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

export default MentorProfileCreation;
