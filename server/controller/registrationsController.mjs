import Registrations from "../models/registrationsModel.mjs";

const registrationsController = {
  //Visų registracijų gavimas
  getRegistrations: async (req, res) => {
    try {
      const registrations = await Registrations.getRegistrations();
      res.status(200).json(registrations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //Visų registracijų gavimas administratoriui
  getAllRegistrations: async (req, res) => {
    try {
      const registrations = await Registrations.getAllRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Failed to get registrations:", error);
      res
        .status(500)
        .json({ message: "An error occurred while getting registrations" });
    }
  },
  
//Registracijos patvirtinimas
  confirmRegistration: async (req, res) => {
    const { registrationId } = req.params;
    try {
      await Registrations.confirmRegistration(registrationId);
      res.status(200).json({ message: "Registration confirmed" });
    } catch (error) {
      console.error("Failed to confirm registration:", error);
      res
        .status(500)
        .json({ message: "An error occurred while confirming registration" });
    }
  },

  //Registracijų su atsiliepimais informacijos gavimas
  getRegistrationsDetails: async (req, res) => {
    try {
      const registrations = await Registrations.getRegistrationsWithReviewInfo();
      res.status(200).json(registrations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default registrationsController;
