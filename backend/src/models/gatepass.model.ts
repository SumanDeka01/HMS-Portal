import mongoose from "mongoose";

const gatePassSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    }, 
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    destination: {
        type: String,
        required: true,
        trim: true,
    },
    outDate: {
        type: Date,
        required: true,
    },
    expectedReturn: {
        type: Date,
        required: true,
    },
    emergencyContanct: {
        type: String,
        // required: true,
        trim: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Active",
        "Returned",
        "Expired",
      ],
      default: "Pending",
    },

    qrToken: {
      type: String,
      unique: true,
      sparse: true,
    },

    exitTime: {
      type: Date,
    },

    entryTime: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },

}, {timestamps: true})

const GatePass = mongoose.model("gatePass", gatePassSchema);

export default GatePass;