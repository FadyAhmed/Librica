import express, { Express, Request, Response } from "express";
import rootRouter from "./routes/index";
import { PORT } from "./secrets";
import { PrismaClient } from "@prisma/client";
import { errorMiddleWare } from "./middlewares/errors";

const app: Express = express();

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(express.json());

app.use("/api", rootRouter);

app.use(errorMiddleWare);

let extractedPort = PORT ? Number(PORT) : 3000;

app.listen(extractedPort, "0.0.0.0", () => {
  console.log(`listining on: 0.0.0.0:${extractedPort}`);
});
