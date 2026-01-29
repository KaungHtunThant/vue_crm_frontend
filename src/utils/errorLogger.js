/**
 * Error Logger Utility
 * Provides automatic error logging with localStorage persistence for service functions
 */

const ERROR_LOG_KEY = "service_error_logs";
const MAX_LOGS = 100; // Maximum number of error logs to store

/**
 * Sanitize arguments to remove sensitive data before logging
 * @param {Array} args - Arguments to sanitize
 * @returns {string} Sanitized JSON string
 */
const sanitizeArgs = (args) => {
  try {
    // Don't log arguments to avoid sensitive data exposure
    // Just log the count of arguments
    return `[${args.length} argument(s)]`;
  } catch (error) {
    return "[unable to serialize arguments]";
  }
};

/**
 * Log an error to localStorage
 * @param {Object} errorInfo - Error information
 * @param {string} errorInfo.serviceName - Name of the service function
 * @param {Error} errorInfo.error - The error object
 * @param {Array} errorInfo.args - Arguments passed to the service function
 */
export const logError = (errorInfo) => {
  try {
    const { serviceName, error, args } = errorInfo;

    const errorLog = {
      timestamp: new Date().toISOString(),
      serviceName,
      message: error.message || "Unknown error",
      // Only store minimal stack trace info (first line only) to avoid exposing internal paths
      stack: error.stack ? error.stack.split("\n")[0] : "",
      args: args ? sanitizeArgs(args) : "[]",
    };

    // Get existing logs
    const logs = getErrorLogs();

    // Add new log at the beginning
    logs.unshift(errorLog);

    // Keep only the last MAX_LOGS entries
    const trimmedLogs = logs.slice(0, MAX_LOGS);

    // Save to localStorage with size check
    const logsJson = JSON.stringify(trimmedLogs);
    // Check if we're within a reasonable size (1MB)
    if (logsJson.length > 1024 * 1024) {
      // If too large, keep only the most recent 50 logs
      const reducedLogs = trimmedLogs.slice(0, 50);
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(reducedLogs));
    } else {
      localStorage.setItem(ERROR_LOG_KEY, logsJson);
    }
  } catch (storageError) {
    // If localStorage fails, log to console instead
    console.error("Failed to log error to localStorage:", storageError);
    console.error("Original error:", errorInfo);
  }
};

/**
 * Get all error logs from localStorage
 * @returns {Array} Array of error logs
 */
export const getErrorLogs = () => {
  try {
    const logs = localStorage.getItem(ERROR_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Failed to retrieve error logs:", error);
    return [];
  }
};

/**
 * Clear all error logs from localStorage
 */
export const clearErrorLogs = () => {
  try {
    localStorage.removeItem(ERROR_LOG_KEY);
  } catch (error) {
    console.error("Failed to clear error logs:", error);
  }
};

/**
 * Wrapper function to add automatic error logging to service functions
 * Preserves the synchronous/asynchronous nature of the original function
 * @param {Function} serviceFunction - The service function to wrap
 * @param {string} serviceName - Name of the service function for logging
 * @returns {Function} Wrapped function with error logging
 */
export const withErrorLogging = (serviceFunction, serviceName) => {
  return (...args) => {
    try {
      const result = serviceFunction(...args);

      // Check if the result is a Promise (async function)
      if (result && typeof result.then === "function") {
        // For async functions, catch and log errors
        return result.catch((error) => {
          logError({
            serviceName,
            error,
            args,
          });
          throw error;
        });
      }

      // For sync functions, just return the result
      return result;
    } catch (error) {
      // For sync functions that throw immediately
      logError({
        serviceName,
        error,
        args,
      });
      throw error;
    }
  };
};
