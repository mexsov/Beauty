import express from "express";
import scheduleController from "../controller/scheduleController.mjs";

const router = express.Router();

router.get("/:id", scheduleController.getProcedureSchedule);

// Naujos datos ir laiko ekskursijai pridejimas
router.post("/:id/addTimeSlot", scheduleController.addProcedureTimeSlot);

// Ekskursijos laiko tarpsnio atnaujinimas
router.put("/:id/updateTimeSlot/:timeSlotId", scheduleController.updateProcedureTimeSlot);

// Ekskursijos laiko tarpsnio ištrynimas
router.delete("/:id/deleteTimeSlot/:timeSlotId", scheduleController.deleteProcedureTimeSlot);

export default router;
