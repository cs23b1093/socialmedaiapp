import "dotenv/config";
import { connectDB } from "./db/index.js";
import express from "express";

connectDB();
