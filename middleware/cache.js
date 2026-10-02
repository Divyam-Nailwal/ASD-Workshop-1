const cache = {};
const TTL = 60 * 1000;

function getCacheKey(req) {
  let url = req.originalUrl;
  if (!url) {
    url = (req.baseUrl ? req.baseUrl : "") + (req.url ? req.url : "");
  }
  const [pathname, search] = url.split("?");
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return search ? `${normalizedPath}?${search}` : normalizedPath;
}

function clearCache(key) {
  if (key && cache[key]) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach((k) => {
      delete cache[k];
    });
  }
}

function cacheMiddleware(req, res, next) {
  if (req.method !== "GET") {
    const methods = ["POST", "PUT", "PATCH", "DELETE"];
    if (methods.includes(req.method)) {
      res.on("finish", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          clearCache();
        }
      });
    }
    return next();
  }

  const key = getCacheKey(req);
  const cached = cache[key];
  const now = Date.now();

  if (cached) {
    const entryTime = cached.createdAt || cached.timestamp || cached.time;
    if (now - entryTime < TTL) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached.data);
    }
    delete cache[key];
  }

  res.setHeader("X-Cache", "MISS");

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const timestamp = Date.now();
      cache[key] = {
        data,
        createdAt: timestamp,
        timestamp: timestamp,
        time: timestamp
      };
    }
    return originalJson(data);
  };

  next();
}

function invalidateCacheMiddleware(req, res, next) {
  const methods = ["POST", "PUT", "PATCH", "DELETE"];
  if (methods.includes(req.method)) {
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearCache();
      }
    });
  }
  next();
}

cacheMiddleware.cache = cache;
cacheMiddleware.cacheMiddleware = cacheMiddleware;
cacheMiddleware.clearCache = clearCache;
cacheMiddleware.invalidateCache = clearCache;
cacheMiddleware.invalidateCacheMiddleware = invalidateCacheMiddleware;
cacheMiddleware.TTL = TTL;

module.exports = cacheMiddleware;
