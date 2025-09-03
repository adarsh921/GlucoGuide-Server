import express from "express";
import {
  addVitals,
  updateVitals,
  deleteVitals,
  viewTodayVitals,
  viewVitalsByDate,
} from "../controllers/vitalController.js";
import authenticate from "../middleware/auth.js";
const router = express.Router();
router.post("/", authenticate, addVitals);
router.get("/today",authenticate,viewTodayVitals);
router.get("/", authenticate, viewVitalsByDate);
router.put("/:id", authenticate, updateVitals);
router.delete("/:id", authenticate, deleteVitals);
export default router;
