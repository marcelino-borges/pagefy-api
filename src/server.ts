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
import log from "./utils/logs";

dotenvSafe.config({
  allowEmptyValues: true,
});

const canReadEnv = String(process.env.MONGO_CONNECTION_STRING).includes(
  "mongodb+srv://"
);

if (canReadEnv) {
  log.success(".ENV verified!");

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(firebaseConfig)),
    storageBucket: JSON.parse(firebaseConfig).storageBucket,
  });

  const PORT = parseInt(process.env.PORT as string, 10);
  const HOST = String(process.env.HOST);

  const app = express();

  const publicCors = cors();
  // const privateCors = cors({
  //   origin: (origin, callback) => {
  //     if (!origin || ALLOWED_ORIGINS.indexOf(origin) === -1) {
  //       log.info("Blocked access from origin: " + origin);
  //       var msg =
  //         "The CORS policy for this site does not " +
  //         "allow access from the specified Origin.";
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   },
  // });

  connectMongo()
    .then(() => {
      app.use(publicCors);
      app.use(helmet());
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
      // Health check
      app.options("*", publicCors);
      app.use("/health-check", publicCors, (_, res) =>
        res.status(200).json({ message: "API running." })
      );
      app.use(
        "/swagger",
        publicCors,
        swaggerUi.serve,
        swaggerUi.setup(swaggerFile)
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
        e
      )
    );
} else {
  log.error(".ENV not available. API not running.");
}
