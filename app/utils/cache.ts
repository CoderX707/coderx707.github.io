const cache: { [key: string]: { data: any; timestamp: number } } = {};
const cacheDuration = 15 * 24 * 60 * 60 * 1000; // Cache duration set to 15 days in milliseconds

export function getCache(key: string) {
  const cached = cache[key];
  if (!cached) {
    return null;
  }
  // Check if the cache is still valid
  const isExpired = Date.now() - cached.timestamp > cacheDuration;
  if (isExpired) {
    // Cache is expired, remove it
    delete cache[key];
    return null;
  }
  return cached.data;
}

export function setCache(key: string, data: any) {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}
