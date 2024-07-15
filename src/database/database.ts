import dotenv from 'dotenv';
import { connect, ConnectOptions } from "mongoose";
import { logger } from "../util/logger";
dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@rpmanager.lywzass.mongodb.net/?retryWrites=true&w=majority&appName=RPManager`;

const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export async function database() {
  try {
    logger.database.info('starting connection to database')

    await connect(uri, clientOptions)
    .then(() => logger.database.info('connection to database established'))

  } catch (error) {
    logger.database.error(__dirname, error)
  }
}