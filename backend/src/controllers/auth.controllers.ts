import { Request, Response } from "express";
import Student from "../models/student.model.js";
import jwt from "jsonwebtoken";


export const registerUser = async (req: Request, res: Response) => {
  console.log("Body: ", req.body);

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
      !username ||
      !email ||
      !enrollmentNumber ||
      !course ||
      !hostel ||
      !roomNo ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    const student = await Student.create({
      username,
      email,
      enrollmentNumber,
      course,
      hostel,
      roomNo,
      phoneNumber,
      password,
    });

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token)

    return res.status(201).json({
      message: "Student registered successfully",
      student,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};