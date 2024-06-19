// Importuojame pool iš postgresConnection.mjs failo
import { pool } from './postgresConnection.mjs';

// SQL užklausos lentelėms sukurti
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    visitedProcedures INTEGER[]
  );
`;

const createProcedureTable = `
  CREATE TABLE IF NOT EXISTS procedures (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    price FLOAT NOT NULL,
    image VARCHAR(255),
    average_rating FLOAT DEFAULT 0
  );
`;

const createRegistrationsTable = `
  CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    procedure_id INTEGER NOT NULL REFERENCES procedures(id),
    confirmation BOOLEAN DEFAULT FALSE,
    name VARCHAR(255),
    date_time TIMESTAMP NOT NULL
  );
`;

const createVisitedProceduresTable = `
  CREATE TABLE IF NOT EXISTS visited_procedures (
    user_id INTEGER NOT NULL REFERENCES users(id),
    procedure_id INTEGER NOT NULL REFERENCES procedures(id),
    PRIMARY KEY (user_id, procedure_id)
  );
`;

// SQL užklausa schedule lentelės sukūrimui
const createScheduleTable = `
  CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    procedure_id INTEGER NOT NULL REFERENCES procedures(id),
    date_time TIMESTAMP NOT NULL
  );
`;

// Funkcija lentelėms sukurti
const createTables = async () => {
  try {
    await pool.query(createUsersTable);
    await pool.query(createProcedureTable);
    await pool.query(createRegistrationsTable);
    await pool.query(createVisitedProceduresTable);
    await pool.query(createScheduleTable); // Pridėta schedule lentelės sukūrimas
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  } finally {
    pool.end();
  }
};

// Eksportuojame createTables funkciją
export default createTables;
