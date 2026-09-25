import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    enrollmentNumber: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true
    },
    hostel: {
        type: String,
        required: true
    },
    roomNo : {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'security'],
        default: 'student'
    }
    
},{timestamps: true});

const Student = mongoose.model("Student", studentSchema);

export default Student;
