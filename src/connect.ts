import "dotenv/config";
import { client, logger } from ".";

export function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      client.login(process.env.TOKEN);
      logger.info("login successful", 5);
      resolve();
    } catch (error) {
      logger.error("failed to login", error, 5, __filename);
      reject(error);
    }
  });
}
