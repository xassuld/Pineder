import { Response } from "express";
import User from "../../models/User";
import { AuthRequest } from "../../middleware/auth";

const handleError = (res: Response, error: any, message: string) => {
  console.error(`Error ${message}:`, error);
  res.status(500).json({ success: false, error: `Failed to ${message}` });
};

const unauthorized = (res: Response) =>
  res.status(401).json({ success: false, error: "Authentication required" });

const notFound = (res: Response, resource: string) =>
  res.status(404).json({ success: false, error: `${resource} not found` });

const badRequest = (res: Response, message: string) =>
  res.status(400).json({ success: false, error: message });

const success = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

// POST - Upload profile photo
export const uploadProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can upload profile photo",
      });
    }

    const { imageData } = req.body; // Base64 image data

    if (!imageData) {
      return badRequest(res, "Image data is required");
    }

    // For now, just store the base64 data or a placeholder
    // In production, you'd want to implement proper file storage
    const avatarUrl = imageData.startsWith("data:")
      ? imageData
      : `data:image/jpeg;base64,${imageData}`;

    // Update user profile with new photo URL
    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { avatar: avatarUrl },
      { new: true }
    );

    success(res, { avatar: avatarUrl }, "Profile photo uploaded successfully");
  } catch (error) {
    handleError(res, error, "upload profile photo");
  }
};

// DELETE - Delete profile photo
export const deleteProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can delete profile photo",
      });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return notFound(res, "User");

    // No external storage cleanup needed for now

    // Remove avatar from user profile
    await User.findByIdAndUpdate(user._id, { avatar: undefined });

    success(res, null, "Profile photo deleted successfully");
  } catch (error) {
    handleError(res, error, "delete profile photo");
  }
};
