import { pool } from "../db/postgresConnection.mjs";

const ratingsModel = {
  //Ekskursijos reitingų gavimas
  getRatingsForProcedure: async (procedureId) => {
    try {
      const result = await pool.query(
        "SELECT * FROM ratings WHERE procedure_id = $1",
        [procedureId]
      );
  
      return result.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

// Ekskursijos reitingų pašalinimas
  deleteRatingsByProcedureId: async (procedureId) => {
    try {
      const query = "DELETE FROM ratings WHERE procedure_id = $1";
      await pool.query(query, [procedureId]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
};

export default ratingsModel;