import { pool } from '../db/postgresConnection.mjs';

const usersModel = {
  //Vartotojo sukūrimas
  createUser: async (newUser) => {
    try {
      const { name, email, password, role = 'user' } = newUser;
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, password, role]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Vartotojo gavimas pagal el. paštą
  getUserByEmail: async ({ email }) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Vartotojo prisijungimas
  login: async ({ email }) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log(result);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    const user = result.rows[0];
    return user;
  },

  //Vartotojo gavimas pagal ID
  getUserById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  //Vartotojo ekskursijų gavimas
  getUserProcedures: async (userId) => {
    try {
      const query = `
      SELECT r.id AS registration_id, e.title AS procedure_title, e.duration, e.type, e.price, e.image, e.average_rating, 
      r.confirmation, r.name, r.date_time
      FROM registrations r
      JOIN procedures e ON r.procedure_id = e.id
      WHERE r.user_id = $1;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error('Failed to get user\'s procedures from the database:', error);
      throw error;
    }
  },

  //Aplankytų ekskursijų atnaujinimas
  updateVisitedprocedures: async (userId, procedureId) => {
    try {
      const result = await pool.query(
        'INSERT INTO visited_procedures (user_id, procedure_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        [userId, procedureId]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  //Tikrina, ar vartotojas aplankė ekskursiją
  hasVisitedProcedures: async (userId, procedureId) => {
    const result = await pool.query(
      'SELECT * FROM visited_procedures WHERE user_id = $1 AND procedure_id = $2',
      [userId, procedureId]
    );
    return result.rows.length > 0;
  },

  //Vartotojo registracijos atšaukimas
  cancelRegistration: async (registrationId) => {
    try {
      const query = `
        DELETE FROM registrations
        WHERE id = $1;
      `;
      await pool.query(query, [registrationId]);
    } catch (error) {
      console.error('Failed to cancel registration in the database:', error);
      throw error;
    }
  },
};

export default usersModel;
