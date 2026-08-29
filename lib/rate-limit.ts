import { ApiError } from "@/lib/api";

type Bucket = { count: number; resetAt: number };

const globalForBuckets = globalThis as typeof globalThis & {
  _rateLimitBuckets?: Map<string, Bucket>;
};

const buckets =
  globalForBuckets._rateLimitBuckets ?? new Map<string, Bucket>();
globalForBuckets._rateLimitBuckets = buckets;

/**
 * Fixed-window limiter held in process memory. Good enough to blunt casual
 * abuse of the public contact form and the login route on a single-instance
 * deployment; a distributed store would be needed to make it authoritative.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  existing.count += 1;

  if (existing.count > limit) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    throw new ApiError(429, `Too many requests. Try again in ${retryAfter}s.`);
  }

  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
