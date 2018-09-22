import express from "express";
import { tickets } from "./controllers/tickets";
import { setupDB } from "./db";
import morgan from "morgan";
import * as bodyParser from "body-parser";
import { admin } from "./controllers/admin";
import { setupRedis } from "./redis";
import { status } from "./controllers/status";
import { setupMail } from "./mail";

const app = express();

app.use(morgan("combined"));

app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/tickets", tickets);
app.use("/admin", admin);
app.use("/status", status);

setupDB();
setupRedis();
setupMail();

app.listen(3000);