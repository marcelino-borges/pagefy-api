import cors from "cors";
import dotenvSafe from "dotenv-safe";
import express from "express";
import firebaseAdmin from "firebase-admin";
import helmet from "helmet";
import "newrelic";
import swaggerUi from "swagger-ui-express";

import swaggerFile from "../swagger_output.json";
import firebaseConfig from "./config/firebase";
import connectMongo from "./config/mongo";
import mainRoutes from "./routes";
import log from "./utils/logs";

dotenvSafe.config({
  allowEmptyValues: true,
});

const canReadEnv = String(process.env.MONGO_CONNECTION_STRING).includes(
  "mongodb+srv://",
);

if (!canReadEnv) {
  log.error(".ENV not available. API not running.");
  process.exit(1);
}

const startServer = () => {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseConfig),
    storageBucket: firebaseConfig.storageBucket,
  });

  const PORT = parseInt((process.env.PORT || "3000") as string, 10);
  const HOST = String(process.env.HOST);

  const app = express();

  const publicCors = cors();

  connectMongo()
    .then(() => {
      app.use(publicCors);
      app.use(helmet());
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
      // Health check
      app.options("*", publicCors);
      app.use("/health-check", publicCors, (_, res) =>
        res.status(200).json({ message: "API running." }),
      );
      app.use(
        "/swagger",
        publicCors,
        swaggerUi.serve,
        swaggerUi.setup(swaggerFile),
      );
      app.options("/api/v1");
      app.use("/api/v1", mainRoutes);

      const server = app.listen(PORT, HOST, () => {
        log.success(`API listening on port ${HOST}:${PORT}`);
      });

      const TIMEOUT = parseInt(process.env.SERVER_TIMEOUT || "3000", 10);

      server.timeout = TIMEOUT;
    })
    .catch((e) =>
      log.error(
        "Error trying to connect to MongoDB. API not running.",
        "Details:",
        e,
      ),
    );
};

startServer();
