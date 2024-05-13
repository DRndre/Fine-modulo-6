import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { authRouter } from "./services/routes/auth.route.js";
import cors from "cors";

config();

const app = express();

const PORT = process.env.PORT || 3001;

const whitelist = ["https://epicode-deploy.vercel.app"]; 
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.some((domain) => origin.startsWith(domain))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("server listening");
});

const initServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connesso al database");

    app.listen(PORT, () => {
      console.log(`Il server sta ascoltando alla porta ${PORT}`);
    });
  } catch (err) {
    console.error("Connessione fallita!", err);
  }
};

initServer();
