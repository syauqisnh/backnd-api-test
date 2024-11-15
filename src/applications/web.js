import express from "express";
import { publicRouter } from "../routes/public.js";
import { privateRouter } from "../routes/private.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

export const web = express();
web.use(express.json());

web.use(cookieParser());

web.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware);
