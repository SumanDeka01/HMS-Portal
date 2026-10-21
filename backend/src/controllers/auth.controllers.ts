
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Student from "../models/student.model.js";

type UserRole = "student" | "admin" | "security";

const createToken = (id: string, role: UserRole) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({ id, role }, secret, { expiresIn: "7d" });
};

const toUserResponse = (user: any) => ({
  id: user._id.toString(),
  username: user.username,
  email: user.email,
  enrollmentNumber: user.enrollmentNumber,
  course: user.course,
  hostel: user.hostel,
  roomNo: user.roomNo,
  phoneNumber: user.phoneNumber,
  role: user.role,
});

export const loginUser = async (req: Request, res: Response) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password = req.body.password;

    if (!email || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await Student.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const role = user.role as UserRole;

    if (!["student", "admin", "security"].includes(role)) {
      return res.status(403).json({
        message: "This account has an invalid role. Contact an administrator.",
      });
    }

    const token = createToken(user._id.toString(), role);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in. Please try again.",
    });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      enrollmentNumber,
      course,
      hostel,
      roomNo,
      phoneNumber,
      password,
    } = req.body;

    if (
      !username?.trim() ||
      !email?.trim() ||
      !enrollmentNumber?.trim() ||
      !course?.trim() ||
      !hostel?.trim() ||
      !roomNo?.toString().trim() ||
      !phoneNumber?.trim() ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        message:
          "Provide all required fields. Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await Student.findOne({
      $or: [
        { email: normalizedEmail },
        { enrollmentNumber: enrollmentNumber.trim() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or enrollment number already exists.",
      });
    }

    // Public registration must never assign admin or security privileges.
    const user = await Student.create({
      username: username.trim(),
      email: normalizedEmail,
      enrollmentNumber: enrollmentNumber.trim(),
      course: course.trim(),
      hostel: hostel.trim(),
      roomNo: roomNo.toString().trim(),
      phoneNumber: phoneNumber.trim(),
      password,
      role: "student",
    });

    const token = createToken(user._id.toString(), "student");

    return res.status(201).json({
      message: "Student registered successfully.",
      token,
      user: toUserResponse(user),
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "Email or enrollment number already exists.",
      });
    }

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Unable to register. Please try again.",
    });
  }
};
