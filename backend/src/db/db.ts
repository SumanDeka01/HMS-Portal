import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sdeka2903_db_user:<db_password>@cluster0.3yleuih.mongodb.net/Test01");
};

export default connectDB; 