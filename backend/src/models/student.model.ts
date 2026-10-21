import mongoose from "mongoose";
import bcrypt from "bcrypt";

const studentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
    },

    course: {
      type: String,
      required: true,
    },

    hostel: {
      type: String,
      required: true,
    },

    roomNo: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin", "security"],
      default: "student",
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

studentSchema.methods.comparePassword = async function (
  enteredPassword: string
) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model("Student", studentSchema);

export default Student;