import { pool } from "../db/postgresConnection.mjs";

const scheduleModel = {
  //Proceduros tvarkaraščio gavimas
  getProcedureSchedule: async (procedureId) => {
    try {
      const schedule = await pool.query(
        "SELECT * FROM schedule WHERE procedure_id = $1",
        [procedureId]
      );
      console.log('getProcedureSchedule:', schedule.rows);
      return schedule.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Naujos datos ir laiko proceduros pridėjimas
  addProcedureTimeSlot: async (procedure_id, date_time) => {
    try {
      const result = await pool.query(
        "INSERT INTO schedule (procedure_id, date_time) VALUES ($1, $2) RETURNING *",
        [procedure_id, date_time]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // proceduros laiko tarpsnio atnaujinimas
  updateProcedureTimeSlot: async (procedureId, timeSlotId, date_time) => {
    try {
      const result = await pool.query(
        "UPDATE schedule SET date_time = $1 WHERE id = $2 AND procedure_id = $3 RETURNING *",
        [date_time, timeSlotId, procedureId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // proceduros datos ir laiko pašalinimas
  deleteProcedureTimeSlot: async (procedureId, timeSlotId) => {
    try {
      const result = await pool.query(
        "DELETE FROM schedule WHERE id = $1 AND procedure_id = $2 RETURNING *",
        [timeSlotId, procedureId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default scheduleModel;
