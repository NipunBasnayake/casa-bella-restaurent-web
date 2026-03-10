import mongoose from 'mongoose';
import { initAdmin } from './initAdmin';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let memoryServer: import('mongodb-memory-server').MongoMemoryServer | null = null;

async function connectWithUri(uri: string): Promise<typeof mongoose> {
  return mongoose.connect(uri, { bufferCommands: false });
}

async function connectWithInMemoryMongo(): Promise<typeof mongoose> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('In-memory MongoDB fallback is disabled in production.');
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server');

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'casa-bella-dev',
      },
    });
    console.warn('Using in-memory MongoDB fallback for development.');
  }

  return connectWithUri(memoryServer.getUri());
}

async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached!.promise = (async () => {
      try {
        if (!MONGODB_URI) {
          if (process.env.NODE_ENV === 'production') {
            throw new Error('Please define the MONGODB_URI environment variable.');
          }
          return await connectWithInMemoryMongo();
        }

        return await connectWithUri(MONGODB_URI);
      } catch (primaryError) {
        if (process.env.NODE_ENV === 'production') {
          throw primaryError;
        }

        console.error('Primary MongoDB connection failed:', primaryError);
        return connectWithInMemoryMongo();
      }
    })().then(async (mongooseInstance) => {
      await initAdmin();
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (connectionError) {
    cached!.promise = null;
    throw connectionError;
  }

  return cached!.conn;
}

export default connectToDatabase;
