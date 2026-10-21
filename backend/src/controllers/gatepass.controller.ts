import crypto from "crypto";
import { Response } from "express";
import GatePass from "../models/gatepass.model.js";
import Student from "../models/student.model.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

export const createGatePass = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      reason,
      destination,
      outDate,
      expectedReturn,
      emergencyContact,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (
      !reason ||
      !destination ||
      !outDate ||
      !expectedReturn ||
      !emergencyContact
    ) {
      return res.status(400).json({
        message: "All gate pass fields are required.",
      });
    }

    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const outingDate = new Date(outDate);
    const returnDate = new Date(expectedReturn);

    if (
      isNaN(outingDate.getTime()) ||
      isNaN(returnDate.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid date or time.",
      });
    }

    if (returnDate <= outingDate) {
      return res.status(400).json({
        message: "Expected return time must be after outing time.",
      });
    }

    const gatePass = await GatePass.create({
      studentId: req.user.id,
      reason,
      destination,
      outDate: outingDate,
      expectedReturn: returnDate,
      emergencyContact: emergencyContact,
      status: "Pending",
    });

    return res.status(201).json({
      message: "Gate pass application submitted successfully.",
      gatePass,
    });
  } catch (error) {
    console.error("Create Gate Pass Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const getMyGatePasses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const gatePasses = await GatePass.find({
      studentId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      gatePasses,
    });
  } catch (error) {
    console.error("Get My Gate Passes Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



export const getPendingGatePasses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const gatePasses = await GatePass.find({
      status: "Pending",
    })
      .populate(
        "studentId",
        "username email enrollmentNumber course hostel roomNo phoneNumber"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      gatePasses,
    });
  } catch (error) {
    console.error("Get Pending Gate Passes Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



export const getGatePassById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    const gatePass = await GatePass.findById(id).populate(
      "studentId",
      "username email enrollmentNumber course hostel roomNo phoneNumber"
    );

    if (!gatePass) {
      return res.status(404).json({
        message: "Gate pass not found.",
      });
    }

    if (
      req.user.role === "student" &&
      gatePass.studentId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You are not allowed to view this gate pass.",
      });
    }

    return res.status(200).json({
      gatePass,
    });
  } catch (error) {
    console.error("Get Gate Pass Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



export const approveGatePass = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const { id } = req.params;

    const gatePass = await GatePass.findById(id);

    if (!gatePass) {
      return res.status(404).json({
        message: "Gate pass not found.",
      });
    }

    if (gatePass.status !== "Pending") {
      return res.status(400).json({
        message: `Gate pass cannot be approved because its current status is ${gatePass.status}.`,
      });
    }

    const qrToken = `GP-${crypto.randomUUID()}`;

    gatePass.status = "Approved";
    gatePass.qrToken = qrToken;

    await gatePass.save();

    return res.status(200).json({
      message: "Gate pass approved successfully.",
      gatePass,
    });
  } catch (error) {
    console.error("Approve Gate Pass Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const rejectGatePass = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const { id } = req.params;
    const { rejectionReason } = req.body;

    const gatePass = await GatePass.findById(id);

    if (!gatePass) {
      return res.status(404).json({
        message: "Gate pass not found.",
      });
    }

    if (gatePass.status !== "Pending") {
      return res.status(400).json({
        message: `Gate pass cannot be rejected because its current status is ${gatePass.status}.`,
      });
    }

    gatePass.status = "Rejected";
    gatePass.rejectionReason =
      rejectionReason || "Gate pass rejected by admin.";

    await gatePass.save();

    return res.status(200).json({
      message: "Gate pass rejected successfully.",
      gatePass,
    });
  } catch (error) {
    console.error("Reject Gate Pass Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



export const verifyGatePass = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { qrToken } = req.body;

    if (typeof qrToken !== "string" || !qrToken.trim()) {
      return res.status(400).json({
        valid: false,
        message: "Please provide a valid QR token.",
      });
    }

    const gatePass = await GatePass.findOne({
      qrToken: qrToken.trim(),
    }).populate(
      "studentId",
      "username email enrollmentNumber course hostel roomNo phoneNumber"
    );

    if (!gatePass) {
      return res.status(404).json({
        valid: false,
        message: "Invalid QR token. Gate pass not found.",
      });
    }

    if (gatePass.status !== "Approved") {
      return res.status(403).json({
        valid: false,
        message: `Gate pass is not approved. Current status: ${gatePass.status}.`,
      });
    }

    const now = new Date();
    const outingTime = new Date(gatePass.outDate);
    const returnTime = new Date(gatePass.expectedReturn);

    console.log("Gate pass verification:", {
      now: now.toISOString(),
      outingTime: outingTime.toISOString(),
      returnTime: returnTime.toISOString(),
      status: gatePass.status,
    });

    if (
      Number.isNaN(outingTime.getTime()) ||
      Number.isNaN(returnTime.getTime())
    ) {
      return res.status(400).json({
        valid: false,
        message: "Gate pass contains invalid date or time values.",
      });
    }

    if (now < outingTime) {
  return res.status(403).json({
    valid: false,
    message: "This gate pass is not valid yet.",
    debug: {
      serverTime: now.toISOString(),
      outingTime: outingTime.toISOString(),
      expectedReturn: returnTime.toISOString(),
    },
  });
}

    if (now > returnTime) {
      return res.status(403).json({
        valid: false,
        message: "This gate pass has expired.",
        returnTime: returnTime.toISOString(),
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Gate pass verified successfully.",
      gatePass,
    });
  } catch (error) {
    console.error("Verify Gate Pass Error:", error);

    return res.status(500).json({
      valid: false,
      message: "Internal Server Error",
    });
  }
};
