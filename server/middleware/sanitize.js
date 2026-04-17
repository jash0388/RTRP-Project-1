/**
 * Input Sanitization Middleware
 * Strips HTML tags and potential XSS payloads from all string inputs in req.body.
 * This prevents stored XSS attacks when user input is rendered later.
 */

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript\s*:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove data: protocol for non-image uses
    .replace(/data\s*:\s*(?!image\/(png|jpg|jpeg|gif|webp))[^;]+;/gi, '')
    // Trim whitespace
    .trim();
};

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(item => sanitizeObject(item));
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Don't sanitize password fields (they get hashed anyway)
      if (key === 'password' || key === 'currentPassword' || key === 'newPassword' || key === 'confirmPassword') {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  return obj;
};

const sanitize = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

module.exports = sanitize;
