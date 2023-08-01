import { get, set } from 'lodash';

const rateLimit = 10; // Number of allowed requests per minute

const rateLimiter = {};

export const rateLimiterMiddleware = (ip: string) => {
  const now = Date.now();
  const windowStart = now - 60 * 1000; // 1 minute ago

  const requestTimestamps = get(rateLimiter, ip, []).filter((timestamp: number) => timestamp > windowStart);
  requestTimestamps.push(now);

  set(rateLimiter, ip, requestTimestamps);

  return requestTimestamps.length <= rateLimit;
};