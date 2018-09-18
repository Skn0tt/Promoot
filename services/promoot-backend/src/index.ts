import express from "express";
import { tickets } from "./controllers/tickets";
import { setupDB } from "./db";
import morgan from "morgan";
import * as bodyParser from "body-parser";
import { admin } from "./controllers/admin";
import { setupCheckin } from "./checkIn";

const app = express();

app.use(morgan("combined"));

app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/tickets", tickets);
app.use("/admin", admin);

setupDB();
setupCheckin();

app.listen(3000);