// Pažymėtas pakeitimas: importavimas naudojant pavadintą eksportą
import { connectDB } from './db/postgresConnection.mjs';
// Pažymėtas pakeitimas: pridedamas importas naudojant numatytąjį eksportą
import createTables from './db/createTables.mjs';

connectDB().then(() => {
  createTables().then(() => {
    console.log('Connected to the database and tables created');
  }).catch((error) => {
    console.error('Failed to create tables:', error);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});
