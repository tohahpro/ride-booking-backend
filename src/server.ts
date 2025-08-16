/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";


let server: Server;

const PORT = envVars.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected to MongoDB");

        server = app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });

    } catch (error) {
        console.error(error);
    }
}


(async () => {
    await startServer();
})()




process.on("uncaughtException", () => {
    console.log("Unhandled Rejection detected.... Server Shutting down.");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }
    process.exit(1)
})

process.on("uncaughtException", () => {
    console.log("Uncaught Exception detected.... Server Shutting down.");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }
    process.exit(1)
})


process.on("SIGTERM", () => {
    console.log("SIGTERM signal received.... Server Shutting down.");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }
    process.exit(1)
})


process.on("SIGINT", () => {
    console.log("SIGINT signal received.... Server Shutting down.");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }
    process.exit(1)
})
