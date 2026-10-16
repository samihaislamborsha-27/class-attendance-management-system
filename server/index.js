import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

const app = express();

const port = Number(process.env.PORT || 5000);
const databaseName = process.env.MONGODB_DB || "classtrack";

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  })
);

app.use(express.json());

let client;
let server;

async function startServer() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !/^mongodb(\+srv)?:\/\//.test(uri)) {
    console.error(
      "Add your MongoDB connection string to MONGODB_URI in server/.env."
    );
    process.exitCode = 1;
    return;
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("PORT in server/.env must be a valid port number.");
    process.exitCode = 1;
    return;
  }

  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    await client.connect();

    const db = client.db(databaseName);

    await db.command({ ping: 1 });

    console.log(`MongoDB connected: ${databaseName}`);

    app.get("/", (req, res) => {
      res.json({
        message: "ClassTrack backend is running.",
      });
    });

    app.get("/api/health", async (req, res) => {
      try {
        await db.command({ ping: 1 });

        res.json({
          status: "ok",
          database: "connected",
          databaseName,
        });
      } catch {
        res.status(503).json({
          status: "error",
          database: "disconnected",
        });
      }
    });

    server = app.listen(port, "127.0.0.1", () => {
      console.log(`Backend running: http://localhost:${port}`);
      console.log(`Connection test: http://localhost:${port}/api/health`);
    });

    server.on("error", async (error) => {
      console.error("Server could not start. Error code:", error.code);
      await client.close();
      process.exitCode = 1;
    });
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error("Error type:", error.name);
    console.error(
      "Check your database username, password, connection string and Atlas IP Access List."
    );

    if (client) {
      await client.close();
    }

    process.exitCode = 1;
  }
}

async function shutdown() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  if (client) {
    await client.close();
  }

  process.exit(0);
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

startServer();