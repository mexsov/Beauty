import ratingsModel from "../models/ratingsModel.mjs";

const ratingsController = {
  // Reitingų gavimas konkrečiai ekskursijai
  getRatingsForProcedure: async (req, res) => {
    try {
      const procedureId = req.params.procedureId; // Gaukite procedureId iš URL parametrų
      const ratings = await ratingsModel.getRatingsForProcedure(procedureId); // Pateikite procedureId modeliui
      res.status(200).json(ratings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default ratingsController;
