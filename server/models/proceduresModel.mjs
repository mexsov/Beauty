import { pool } from "../db/postgresConnection.mjs";

const proceduresModel = {
  //Visų ekskursijų gavimas
  getProcedures: async () => {
    try {
      const procedures = await pool.query("SELECT * FROM procedures");
      return procedures.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Ekskursijų paieška
  searchProcedures: async (searchQuery) => {
    try {
      const query = `
        SELECT * FROM procedures
        WHERE title ILIKE $1
        OR date_time::date = $2::date
      `;
      const procedures = await pool.query(query, [
        `%${searchQuery}%`,
        searchQuery,
      ]);
      return procedures.rows;
    } catch (error) {
      console.error("Error searching procedures:", error);
      throw error;
    }
  },

  //Ekskursijos gavimas pagal ID
  getProcedureById: async (id) => {
    try {
      const query = "SELECT * FROM procedures WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Ekskursijos sukūrimas
  createProcedure: async (title, image, type, duration, price) => {
    try {
      const result = await pool.query(
        "INSERT INTO procedures (title, image, type, duration, price, average_rating) VALUES ($1, $2, $3, $4, $5, '0') RETURNING *",
        [title, image, type, duration, price]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Ekskursijos ištrynimas
  deleteProcedure: async (id) => {
    try {
      const query = "DELETE FROM procedures WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Ekskursijos atnaujinimas
  updateProcedure: async (id, updatedProcedure) => {
    try {
      const procedureId = parseInt(id, 10);
      if (isNaN(procedureId)) {
        throw new Error("Invalid procedure ID");
      }

      if (
        !updatedProcedure ||
        typeof updatedProcedure !== "object" ||
        Object.keys(updatedProcedure).length === 0
      ) {
        throw new Error("Invalid updated fields");
      }

      const setFields = Object.keys(updatedProcedure)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");

      const values = [...Object.values(updatedProcedure), procedureId];

      const result = await pool.query(
        `UPDATE procedures SET ${setFields} WHERE id = $${values.length} RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        throw new Error("Procedure not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error in updateProcedure:", error.message);
      throw error;
    }
  },

  //Ekskursijos tvarkaraščio gavimas pagal ID
  getScheduleByProcedureId: async (id) => {
    try {
      const schedule = await pool.query(
        "SELECT * FROM schedule WHERE procedure_id = $1",
        [id]
      );
      console.log('getScheduleByProcedureId:', schedule.rows);
      return schedule.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Ekskursijos tvarkaraščio atnaujinimas
  updateSchedule: async (id, dateTimes) => {
    try {
      await pool.query("DELETE FROM schedule WHERE procedure_id = $1", [id]);

      const insertPromises = dateTimes.map((dateTime) =>
        pool.query("INSERT INTO schedule (procedure_id, date_time) VALUES ($1, $2)", [
          id,
          dateTime,
        ])
      );
      await Promise.all(insertPromises);

      const result = await pool.query("SELECT date_time FROM schedule WHERE procedure_id = $1", [id]);
      const updatedSchedule = result.rows.map(row => row.date_time);

      return updatedSchedule;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Atsiliepimo sukūrimas
  createReview: async (rating, comment, user_id, procedure_id) => {
    try {
      const result = await pool.query(
        "INSERT INTO ratings (rating, comment, user_id, procedure_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [rating, comment, user_id, procedure_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Ekskursijos reitingų pašalinimas
  deleteRatingsByprocedureId: async (procedureId) => {
    try {
      const query = "DELETE FROM ratings WHERE procedure_id = $1";
      await pool.query(query, [procedureId]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Vidutinio reitingo gavimas
  getAverageRatingForProcedure: async (procedureId) => {
    try {
      const result = await pool.query(
        "SELECT AVG(rating) AS average_rating FROM ratings WHERE procedure_id = $1",
        [procedureId]
      );

      if (result.rows.length === 0 || result.rows[0].average_rating === null) {
        return null;
      }

      const averageRating = parseFloat(result.rows[0].average_rating).toFixed(2);

      return averageRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Vidutinio reitingo atnaujinimas
  updateAverageRating: async (procedure_id) => {
    try {
      const result = await pool.query(
        "UPDATE procedures SET average_rating = (SELECT AVG(rating) FROM ratings WHERE procedure_id = $1) WHERE id = $1 RETURNING *",
        [procedure_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Vartotojo registravimas į ekskursiją
  createRegistration: async (user_id, procedure_id, name, date_time) => {
    try {
      const result = await pool.query(
        "INSERT INTO registrations (user_id, procedure_id, name, date_time, confirmation) VALUES ($1, $2, $3, $4, 'false') RETURNING *",
        [user_id, procedure_id, name, date_time]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Tikrinimas, ar vartotojas aplankė ekskursiją
  hasUserVisitedProcedure: async (userId, procedureId) => {
    try {
      const query = "SELECT * FROM visited_procedures WHERE user_id = $1 AND procedure_id = $2";
      const result = await pool.query(query, [userId, procedureId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default proceduresModel;
