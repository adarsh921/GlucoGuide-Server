import express from "express";
import {
  addVitals,
  viewVitals,
  updateVitals,
  deleteVitals,
} from "../controllers/vitalController.js";
import authenticate from "../middleware/auth.js";
const router = express.Router();
router.post("/", authenticate, addVitals);
router.get("/", authenticate, viewVitals);
router.put("/:id", authenticate, updateVitals);
router.delete("/:id", authenticate, deleteVitals);
export default router;
