import proceduresModel from "../models/proceduresModel.mjs";
import registrationsModel from "../models/registrationsModel.mjs";
import scheduleModel from "../models/scheduleModel.mjs";

const proceduresController = {
  // Visų ekskursijų gavimas
  getProcedures: async (req, res) => {
    try {
      const procedures = await proceduresModel.getProcedures(req.query);
      // iskonsoliname, kad paziureti kokias ekskursijas gavome
      console.log("Procedures data:", procedures);
      res.status(200).json(procedures);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Ekskursijų paieška
  searchProcedures: async (req, res) => {
    const { searchQuery } = req.query;
    try {
      const procedures = await proceduresModel.searchProcedures(searchQuery);
      res.status(200).json(procedures);
    } catch (error) {
      console.error("Error searching procedures:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Naujos ekskursijos sukūrimas
  createProcedure: async (req, res) => {
    try {
      const { title, image, type, duration, price } = req.body;
      console.log('Request body:', req.body);
  
      const newProcedure = await proceduresModel.createProcedure(
        title,
        image,
        type,
        duration,
        price
      );
  
      console.log('New procedures created:', newProcedure);
      res.status(201).json(newProcedure);
    } catch (error) {
      console.error('Error creating procedure:', error);
      res.status(500).json({ message: 'An error occurred while creating the procedure' });
    }
  },

  // Konkrečios ekskursijos gavimas pagal ID
  getProcedureById: async (req, res) => {
    try {
      const procedureId = req.params.id;
      const procedure = await proceduresModel.getProcedureById(procedureId);
      if (!procedure) {
        return res.status(404).json({ message: "Procedure not found" });
      }
      res.status(200).json(procedure);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Ekskursijos informacijos atnaujinimas pagal ID
  updateProcedure: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedProcedure = req.body;
      const procedure = await proceduresModel.updateProcedure(
        id,
        updatedProcedure
      );
      if (!procedure) {
        res.status(404).json({ message: "Procedure not found" });
        return;
      }

      res.status(200).json(procedure);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "An error occurred while updating the procedure" });
    }
  },

  // Ekskursijos šalinimas pagal ID
  deleteProcedure: async (req, res) => {
    try {
      const procedureId = req.params.id;

      // Is pradziu trinam reitingus, tvarkarasti, registracijas
      //await proceduresController.deleteRatingsByprocedureId(procedureId); (nenaudoti)
      await scheduleModel.deleteProcedureTimeSlot(procedureId);
      await registrationsModel.deleteRegistration(procedureId);

      // Tada trinam pacia ekskursija

      const deletedProcedure = await proceduresModel.deleteProcedure(
        procedureId
      );
      if (!deletedProcedure) {
        return res.status(404).json({ message: "Procedure not found" });
      }
      res
        .status(200)
        .json({ message: "Procedure deleted successfully", deletedProcedure });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

// Atsiliepimo sukūrimas
  createReview: async (req, res) => {
    try {
      const { rating, comment, user_id, procedureId } = req.body;

      // Sukuriame atsiliepima ir susiejame ji su ekskursija
      const newRating = await proceduresModel.createReview(
        rating,
        comment,
        user_id,
        procedureId
      );

      // Atnaujiname vidurki
      await proceduresModel.updateAverageRating(procedureId);

      res.status(201).json(newRating);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the review" });
    }
  },

  // Vidutinio reitingo gavimas konkrečiai ekskursijai
  getAverageRatingForProcedure: async (req, res) => {
    try {
      const procedureId = req.params.procedureId;
      const averageRating = await proceduresModel.getAverageRatingForProcedure(
        procedureId
      );

      if (averageRating === null) {
        res.status(404).json({ message: "No ratings for this procedure yet" });
        return;
      }

      res.status(200).json({ average_rating: averageRating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Vidutinio reitingo atnaujinimas konkrečiai ekskursijai
  updateAverageRatingForProcedure: async (req, res) => {
    try {
      const procedureId = req.params.procedureId;
  
      const updatedprocedure =
        await proceduresModel.updateAverageRating(procedureId);
  
      res.status(200).json(updatedProcedure);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  

  // Ekskursijų datų ir laikų gavimas
  getProcedureSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await proceduresModel.getScheduleByprocedureId(id);
      res.status(200).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Ekskursijos datos ir laiko atnaujinimas
  updateProcedureSchedule : async (req, res) => {
    try {
      const { id } = req.params;
      const { date_times } = req.body;
  
      const updatedTimeSlots = await proceduresModel.updateSchedule(id, date_times);
  
      res.status(200).json(updatedTimeSlots);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating time slots" });
    }
  },

  // Registracijos į ekskursiją sukūrimas
  createRegistration: async (req, res) => {
    try {
      const { user_id, procedureId, name, date_time } = req.body;
      const newRegistration = await proceduresModel.createRegistration(
        user_id,
        procedureId,
        name,
        date_time
      );
      res.status(201).json(newRegistration);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "An error occurred while creating the registration" });
    }
  },

  //Vartotojo registracijos būsenos gavimas
  getRegistrationStatusForUser: async (req, res) => {
    const userId = req.user.id; // Gauname dabartinį vartotojo ID (darant prielaidą, kad vartotojas yra autentifikuotas)
    const procedureId = req.params.procedureId;

    try {
      // Tikriname, ar vartotojas užsiregistravęs ekskursijai
      const registration = await registrationsModel.getRegistrationStatusForUser(
        userId,
        procedureId
      );

      if (registration) {
        // Jei registracija rasta, vadinasi, vartotojas jau užsiregistravęs
        res.status(200).json({ registered: true });
      } else {
        // Jei registracija nerasta, vartotojas neregistruojamas
        res.status(200).json({ registered: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
export default proceduresController;
