import express from "express";
import dotenv from "dotenv";
import passport from "./strategies/auth.mjs";
import { connectDB } from "./db/postgresConnection.mjs";
import usersRouter from "./routes/index.mjs";
import proceduresRouter from "./routes/index.mjs";
import cors from "cors";

dotenv.config();

const app = express();

const startServer = async () => {
  try {
    const message = await connectDB();
    console.log(message);

   
    app.use(
      cors({
        origin: "http://localhost:3000", 
        credentials: true, 
      })
    );
    app.use(express.json()); 
    app.use(passport.initialize());

    app.use("/api/beauty", usersRouter, proceduresRouter);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the server or database", error);
  }
};

startServer();