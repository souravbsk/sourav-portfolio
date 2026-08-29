import { setDefaultResultOrder, setServers } from "node:dns";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Windows + Node often returns IPv6 first, then fails the Atlas SRV lookup
// with `querySrv ECONNREFUSED` even though nslookup works. Prefer IPv4.
setDefaultResultOrder("ipv4first");

/**
 * The previous Express server connected with the native driver and then called
 * `client.db("souravPortfolio")`, so the connection string itself has no
 * database path. Passing `dbName` reproduces that exactly, which is what keeps
 * the existing `Projects` collection reachable without a migration.
 */
const MONGODB_DB = process.env.MONGODB_DB || "souravPortfolio";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reused across hot reloads in dev and across warm invocations in production,
// so a serverless function never opens a second pool.
const globalForMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose._mongooseCache ?? {
  conn: null,
  promise: null,
};

globalForMongoose._mongooseCache = cache;

export async function connectToDatabase() {
  if (cache.conn) return cache.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  if (!cache.promise) {
    cache.promise = connectOnce().catch(async (error) => {
      // Local resolvers (VPNs, some Windows DNS) refuse SRV queries. Public
      // DNS can still see the Atlas records — retry once before giving up.
      if (isSrvLookupFailure(error) && MONGODB_URI.startsWith("mongodb+srv://")) {
        setServers(["8.8.8.8", "1.1.1.1"]);
        try {
          return await connectOnce();
        } catch (retryError) {
          cache.promise = null;
          throw retryError;
        }
      }

      cache.promise = null;
      throw error;
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

/**
 * Turns a Mongoose document into something safe to hand to a client component:
 * ObjectIds and Dates become strings.
 */
function connectOnce() {
  return mongoose.connect(MONGODB_URI!, {
    dbName: MONGODB_DB,
    bufferCommands: false,
    serverSelectionTimeoutMS: 10_000,
    family: 4,
  });
}

function isSrvLookupFailure(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: string }).code)
      : "";
  const message = error instanceof Error ? error.message : String(error);
  return (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "ETIMEOUT" ||
    /querySrv/i.test(message)
  );
}

export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
