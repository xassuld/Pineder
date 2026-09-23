import express from "express";
import { validateBody, validateQuery } from "../middleware/zodValidation";
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from "../schemas/validation";
import { authMiddleware, requireRole } from "../middleware/auth";
import {
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} from "../controllers/user/userController";
import { checkProfileStatus } from "../controllers/user/userProfileController";

const router = express.Router();

router.post("/", validateBody(createUserSchema), createUser);

router.get("/", validateQuery(userQuerySchema), getUsers);

router.get("/profile/status", authMiddleware, checkProfileStatus);

router.get("/:id", getUser);

router.put("/:id", authMiddleware, validateBody(updateUserSchema), updateUser);

router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteUser);

export default router;
