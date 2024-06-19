import express from "express";
import dotenv from "dotenv";
import proceduresController from "../controller/proceduresController.mjs";
import { validate } from "../middleware/schemaValidator.mjs";
import { procedureValidationSchema } from "../validators/procedureValidator.mjs";
import scheduleModel from "../models/scheduleModel.mjs";

dotenv.config();

const router = express.Router();

// visu ekskursiju gavimas
router.get("/", proceduresController.getProcedures);

// vienos ekskursijos pagal id gavimas
router.get("/:id", proceduresController.getProcedureById);

// ekskursijos istrynimas
router.delete("/:id", proceduresController.deleteProcedure);

// ekskursijos sukurimas
router.post(
  "/",
  validate(procedureValidationSchema),
  proceduresController.createProcedure
);

// ekskursijos redagavimas
router.patch(
  "/:id",
  validate(procedureValidationSchema),
  proceduresController.updateProcedure
);

// atsiliepimo sukurimas
router.post("/:id/addreview", proceduresController.createReview);

// vidurkio gavimas
router.get(
  "/:id/average-rating",
  proceduresController.getAverageRatingForProcedure
);

// ekskursijos schedule gavimas
router.get("/:id/schedule", proceduresController.getProcedureSchedule);

// ekskursijos schedule atnaujinimas
router.patch(
  "/:id/schedule",
  proceduresController.updateProcedureSchedule 
);

// registracijos sukurimas
router.post("/:id/register", proceduresController.createRegistration);

router.get(
  "/:id/registrationStatus",
  proceduresController.getRegistrationStatusForUser
);

export default router;
