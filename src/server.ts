import helmet from "helmet";
import cors from "cors";
import express from "express";
import mainRoutes from "./routes";
import dotenvSafe from "dotenv-safe";
import swaggerFile from "../swagger_output.json";
import swaggerUi from "swagger-ui-express";
import connectMongo from "./config/mongo";
import admin from "firebase-admin";
import firebaseConfig from "./config/firebase";
import { log } from "./utils";

dotenvSafe.config({
  allowEmptyValues: true,
});

const canReadEnv = String(process.env.MONGO_CONNECTION_STRING).includes(
  "mongodb+srv://"
);

if (canReadEnv) {
  log(".ENV verified!");

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(firebaseConfig)),
    storageBucket: JSON.parse(firebaseConfig).storageBucket,
  });

  const PORT = parseInt(process.env.PORT as string, 10);

  const app = express();

  const publicCors = cors();
  const privateCors = cors({
    origin: [
      "http://socialbio.me",
      "https://socialbio.me",
      "http://socialbio-api.onrender.com",
      "https://socialbio-api.onrender.com",
    ],
  });

  connectMongo()
    .then(() => {
      app.use(helmet());
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
      // Health check
      app.use("/health-check", publicCors, (_, res) =>
        res.status(200).json({ message: "API running." })
      );
      app.use(
        "/swagger",
        swaggerUi.serve,
        privateCors,
        swaggerUi.setup(swaggerFile)
      );
      app.use("/api/v1", privateCors, mainRoutes);

      const server = app.listen(PORT, () => {
        log(`API listening on port ${PORT}`);
      });

      const TIMEOUT = parseInt(process.env.SERVER_TIMEOUT || "3000", 10);

      server.timeout = TIMEOUT;
    })
    .catch((e) =>
      log("Error trying to connect to MongoDB. API not running.", "Details:", e)
    );
} else {
  log(".ENV not available. API not running.");
}
