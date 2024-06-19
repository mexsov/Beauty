import { pool } from "../db/postgresConnection.mjs";

const registrationsModel = {
  //Visų registracijų gavimas
  getAllRegistrations: async () => {
    try {
      const query = `
        SELECT r.id AS registration_id, e.title AS procedure_title, e.duration, e.type, e.price, e.image, e.average_rating, 
               r.confirmation, r.name, r.date_time
        FROM registrations r
        JOIN procedures e ON r.procedure_id = e.id;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Failed to get all registrations:", error);
      throw error;
    }
  },

  //Registracijos patvirtinimas
  confirmRegistration: async (registrationId) => {
    try {
      const query = `
        UPDATE registrations 
        SET confirmation = true 
        WHERE id = $1
      `;
      await pool.query(query, [registrationId]);
    } catch (error) {
      console.error("Failed to confirm registration:", error);
      throw error;
    }
  },

  //Registracijos būsenos gavimas
  getRegistrationStatusForUser: async () => {
    try {
      const registrations = await pool.query("SELECT * FROM registrations");
      return registrations.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Registracijos gavimas pagal ID
  getRegistrationById: async (id) => {
    try {
      const result = await pool.query(
        "SELECT * FROM registrations WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Registracijos atnaujinimas
  updateRegistration: async (id, updatedRegistration) => {
    try {
      const setFields = Object.keys(updatedRegistration)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(", ");
      const values = Object.values(updatedRegistration);
      const query = `UPDATE registrations SET ${setFields} WHERE id = $${
        values.length + 1
      } RETURNING *`;
      const result = await pool.query(query, [...values, id]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Registracijos ištrynimas
  deleteRegistration: async (procedureId) => {
    try {
      const result = await pool.query(
        "DELETE FROM registrations WHERE procedure_id = $1 RETURNING *",
        [procedureId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Registracijų su apžvalgos informacija gavimas
  getRegistrationsWithReviewInfo: async () => {
    try {
      const query = `
        SELECT 
            r.id AS registration_id, 
            e.title AS procedure_title, 
            e.duration, 
            e.type, 
            e.price, 
            e.image, 
            e.average_rating, 
            r.confirmation, 
            r.name, 
            r.date_time,
            r.has_review
        FROM 
            registrations r
        JOIN 
            procedures e ON r.procedure_id = e.id;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Failed to get registrations with review info:", error);
      throw error;
    }
  },
};

export default registrationsModel;
