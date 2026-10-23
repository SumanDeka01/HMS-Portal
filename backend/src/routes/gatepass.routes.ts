import { verifyGatePass
 } from "../controllers/gatepass.controller.js";
import express from "express";

import {
  createGatePass,
  getMyGatePasses,
  getPendingGatePasses,
  getGatePassById,
  approveGatePass,
  rejectGatePass,
} from "../controllers/gatepass.controller.js";
import {
  verifyToken,
  authorizeRole,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRole("student"),
  createGatePass
);

router.get(
  "/my",
  verifyToken,
  authorizeRole("student"),
  getMyGatePasses
);

router.get(
  "/pending",
  verifyToken,
  authorizeRole("admin"),
  getPendingGatePasses
);

router.patch(
  "/:id/approve",
  verifyToken,
  authorizeRole("admin"),
  approveGatePass
);

router.patch(
  "/:id/reject",
  verifyToken,
  authorizeRole("admin"),
  rejectGatePass
);

router.get(
  "/:id",
  verifyToken,
  getGatePassById
);

router.post(
  "/verify",
  verifyToken,
  authorizeRole("security"),
  verifyGatePass
);

export default router;
