import dotenv from "dotenv";
import app from "./src/app.ts";
import connectDB from "./src/db/db.ts";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});