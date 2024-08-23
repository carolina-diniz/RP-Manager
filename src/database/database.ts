import dotenv from 'dotenv';
import { connect, ConnectOptions } from "mongoose";
import { logger } from "..";
dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@rpmanager.lywzass.mongodb.net/?retryWrites=true&w=majority&appName=RPManager`;
const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export async function database(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      await connect(uri, clientOptions)
      logger.info("Database connected successfully", 2)
      resolve()
    } catch (error) {
      logger.error('Failed to connect to database', error, 2, __filename)
      reject(error)
    }
  })
}