import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the type for the cached mongoose connection
interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define a type for the global object with mongoose
type GlobalWithMongoose = typeof globalThis & {
  mongoose?: CachedMongoose;
};

// Use const and avoid any
const cached: CachedMongoose = (global as GlobalWithMongoose).mongoose || { conn: null, promise: null };

if (!(global as GlobalWithMongoose).mongoose) {
  (global as GlobalWithMongoose).mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;