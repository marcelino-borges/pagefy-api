import mongoose from "mongoose";

import log from "../utils/logs";

const connect = async () => {
  if (!process.env.MONGO_CONNECTION_STRING) return;

  log.info("Connecting to mongo...");

  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      ignoreUndefined: true,
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.on("open", function () {
      log.success("MongoDB connected!");
    });
  } catch (e) {
    throw e;
  }
};

export default connect;
