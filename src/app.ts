import express from "express";
import { createConnection } from "typeorm";
import routes from "./routes";
import config from "../ormconfig";
import "reflect-metadata";
import scrapeData from "./utils/crawler";
import clearDatabase from "./utils/crawler";

class App {
  public server;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.startFunction();
  }
  middlewares() {
    this.server.use(express.json());
  }
 
  routes() {
    this.server.use(routes);
  }
  async startFunction() {
    try {
      await createConnection(config).then(() => {
        console.log("Connected to PostgreSQL");
      });
      await scrapeData();
    } catch (error) {
      console.log("Error connecting to PostgreSQL:", error);
    }
  }
}

export default new App().server;

