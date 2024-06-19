import express from "express";
import dotenv from "dotenv";
import registrationsController from "../controller/registrationsController.mjs";

dotenv.config();

const router = express.Router();

router.get("/admin/procedures", registrationsController.getAllRegistrations);

router.put(
  "/admin/confirm/:registrationId",
  registrationsController.confirmRegistration
);

router.get("/details", registrationsController.getRegistrationsDetails);

router.get("/list", registrationsController.getRegistrations);

export default router;
