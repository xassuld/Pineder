import { Request, Response } from "express";
import User from "../../models/User";
import { createUserSchema, updateUserSchema, userQuerySchema } from "../../schemas/validation";
import { logger } from "../../utils/logger";
import { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  paginatedResponse 
} from "../../utils/responseHelpers";

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return errorResponse(res, "User with this email already exists", 409);
    }

    const user = new User(validatedData);
    await user.save();

    return successResponse(res, user, "User created successfully", 201);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("User creation failed", { error: error.message });
    }
    return errorResponse(res, "Failed to create user", 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      id,
      { ...validatedData, updatedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return notFoundResponse(res, "User");
    }

    return successResponse(res, user, "User updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error("User update failed", { error: error.message });
    }
    return errorResponse(res, "Failed to update user", 500);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return notFoundResponse(res, "User");
    }

    return successResponse(res, user);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("User retrieval failed", { error: error.message });
    }
    return errorResponse(res, "Failed to retrieve user", 500);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const validatedQuery = userQuerySchema.parse(req.query);
    const { role, limit, page, search } = validatedQuery;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    return paginatedResponse(res, users, page, limit, total);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Users retrieval failed", { error: error.message });
    }
    return errorResponse(res, "Failed to retrieve users", 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return notFoundResponse(res, "User");
    }

    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error("User deletion failed", { error: error.message });
    }
    return errorResponse(res, "Failed to delete user", 500);
  }
};
