import scheduleModel from "../models/scheduleModel.mjs";

const scheduleController = {
  //Ekskursijos tvarkaraščio gavimas pagal ID
  getProcedureSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const schedule = await scheduleModel.getProcedureSchedule(id);
      res.status(200).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Naujos datos ir laiko ekskursijai pridėjimas
  addProcedureTimeSlot: async (req, res) => {
    try {
      const { procedure_id, date_time } = req.body;
      const newTimeSlot = await scheduleModel.addProcedureTimeSlot(
        procedure_id,
        date_time
      );

      res.status(201).json(newTimeSlot);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while adding time slot" });
    }
  },

  // Ekskursijos laiko tarpsnio atnaujinimas
  updateProcedureTimeSlot: async (req, res) => {
    try {
      const { id, timeSlotId } = req.params;
      const { date_time } = req.body;
      const updatedTimeSlot = await scheduleModel.updateProcedureTimeSlot(
        id,
        timeSlotId,
        date_time
      );
      res.status(200).json(updatedTimeSlot);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating time slot" });
    }
  },

  //Ekskursijos laiko tarpsnio ištrynimas
 deleteProcedureTimeSlot: async (req, res) => {
    try {
      const { id, timeSlotId } = req.params;
      await scheduleModel.deleteProcedureTimeSlot(id, timeSlotId);
      res.status(200).json({ message: "Time slot deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting time slot" });
    }
  },
};

export default scheduleController;
