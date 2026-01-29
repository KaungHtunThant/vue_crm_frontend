import Cookies from "js-cookie";

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get the cookie name for today's error logs
 */
const getErrorLogCookieName = () => {
  return `error_logs_${getTodayDate()}`;
};

/**
 * Save error to cookie
 * @param {string} path - The function/service path where error occurred
 * @param {string} errorMessage - The error message
 * @param {string|number} errorCode - The error code (e.g., HTTP status code)
 */
const saveErrorToCookie = (path, errorMessage, errorCode) => {
  const cookieName = getErrorLogCookieName();

  // Get existing logs from cookie
  let existingLogs = [];
  try {
    const existingData = Cookies.get(cookieName);
    if (existingData) {
      existingLogs = JSON.parse(existingData);
    }
  } catch (e) {
    // If parsing fails, start fresh
    existingLogs = [];
  }

  // Add new error log
  const newLog = {
    path,
    errorMessage,
    errorCode,
    timestamp: new Date().toISOString(),
  };
  existingLogs.push(newLog);

  // Save back to cookie with 2 days expiry
  Cookies.set(cookieName, JSON.stringify(existingLogs), { expires: 2 });
};

/**
 * Wraps a service function with error logging
 * @param {Function} fn - The service function to wrap
 * @param {string} functionPath - The path/name of the function for logging
 * @returns {Function} - The wrapped function
 */
export const withErrorLogging = (fn, functionPath) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // Extract error details
      const errorMessage = error.message || "Unknown error";
      const errorCode = error.response?.status || error.code || "UNKNOWN";

      // Log error to cookie (wrapped in try-catch to not mask original error)
      try {
        saveErrorToCookie(functionPath, errorMessage, errorCode);
      } catch (loggingError) {
        // Silently ignore logging errors to ensure original error is thrown
        console.warn("Failed to log error to cookie:", loggingError);
      }

      // Re-throw the error to maintain original behavior
      throw error;
    }
  };
};
