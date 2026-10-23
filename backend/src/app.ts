import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import gatePassRoutes from "./routes/gatepass.routes.js"

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/gatepass", gatePassRoutes);

export default app; 