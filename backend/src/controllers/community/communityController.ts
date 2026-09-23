import { Request, Response } from "express";
import Community from "../../models/Community";
import { AuthRequest } from "../../middleware/auth";

// Helper functions
const success = (
  res: Response,
  data: any,
  message: string,
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const error = (res: Response, message: string, statusCode: number = 500) => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

const badRequest = (res: Response, message: string) => {
  error(res, message, 400);
};

const notFound = (res: Response, resource: string) => {
  error(res, `${resource} not found`, 404);
};

const unauthorized = (res: Response) => {
  error(res, "Unauthorized", 401);
};

// GET - Get all communities
export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const { category, status, limit = 20, page = 1 } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const communities = await Community.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Community.countDocuments(query);

    success(
      res,
      {
        communities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Communities retrieved successfully"
    );
  } catch (err) {
    error(res, "Failed to retrieve communities");
  }
};

// GET - Get community by ID
export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
      return notFound(res, "Community");
    }

    success(res, community, "Community retrieved successfully");
  } catch (err) {
    error(res, "Failed to retrieve community");
  }
};

// POST - Create new community
export const createCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const {
      name,
      description,
      category,
      topics = [],
      rules = [],
      isPrivate = false,
      image,
    } = req.body;

    // Validate required fields
    if (!name || !description || !category) {
      return badRequest(res, "Name, description, and category are required");
    }

    // Check if community name already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return badRequest(res, "Community with this name already exists");
    }

    const community = new Community({
      name,
      description,
      category,
      topics,
      rules,
      isPrivate,
      image,
      createdBy: req.user.email,
      memberIds: [req.user.email], // Creator is automatically a member
    });

    await community.save();

    success(res, community, "Community created successfully", 201);
  } catch (err) {
    error(res, "Failed to create community");
  }
};

// PUT - Update community
export const updateCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;
    const updateData = req.body;

    const community = await Community.findById(id);
    if (!community) {
      return notFound(res, "Community");
    }

    // Check if user is the creator or has permission
    if (community.createdBy !== req.user.email) {
      return unauthorized(res);
    }

    const updatedCommunity = await Community.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    success(res, updatedCommunity, "Community updated successfully");
  } catch (err) {
    error(res, "Failed to update community");
  }
};

// DELETE - Delete community
export const deleteCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
      return notFound(res, "Community");
    }

    // Check if user is the creator
    if (community.createdBy !== req.user.email) {
      return unauthorized(res);
    }

    await Community.findByIdAndDelete(id);

    success(res, null, "Community deleted successfully");
  } catch (err) {
    error(res, "Failed to delete community");
  }
};

// POST - Join community
export const joinCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;
    const userId = req.user.email;

    const community = await Community.findById(id);
    if (!community) {
      return notFound(res, "Community");
    }

    // Check if user is already a member
    if (community.memberIds.includes(userId)) {
      return badRequest(res, "User is already a member of this community");
    }

    // Add user to members and increment member count
    community.memberIds.push(userId);
    community.members += 1;
    community.recentActivity = "New member joined";

    await community.save();

    success(res, community, "Successfully joined community");
  } catch (err) {
    error(res, "Failed to join community");
  }
};

// POST - Leave community
export const leaveCommunity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return unauthorized(res);

    const { id } = req.params;
    const userId = req.user.email;

    const community = await Community.findById(id);
    if (!community) {
      return notFound(res, "Community");
    }

    // Check if user is a member
    if (!community.memberIds.includes(userId)) {
      return badRequest(res, "User is not a member of this community");
    }

    // Don't allow creator to leave
    if (community.createdBy === userId) {
      return badRequest(res, "Community creator cannot leave the community");
    }

    // Remove user from members and decrement member count
    community.memberIds = community.memberIds.filter((id) => id !== userId);
    community.members = Math.max(0, community.members - 1);
    community.recentActivity = "Member left";

    await community.save();

    success(res, community, "Successfully left community");
  } catch (err) {
    error(res, "Failed to leave community");
  }
};
