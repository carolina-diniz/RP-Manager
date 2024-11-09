import 'dotenv/config'
import { connect, ConnectOptions } from 'mongoose';

const connection = async () => {
  const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@rpmanager.lywzass.mongodb.net/?retryWrites=true&w=majority&appName=RPManager`;
  const clientOptions: ConnectOptions = {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    }
  }

  try {
    await connect(URI, clientOptions)
    console.log('Connected to MongoDB');
  } catch (error) {
    
  }
}


export const database = {
  connection,
}
