/**
 * Error Logger Utility
 * Provides automatic error logging with localStorage persistence for service functions
 */

const ERROR_LOG_KEY = "service_error_logs";
const MAX_LOGS = 100; // Maximum number of error logs to store

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
      stack: error.stack || "",
      args: args ? JSON.stringify(args) : "[]",
    };

    // Get existing logs
    const logs = getErrorLogs();

    // Add new log at the beginning
    logs.unshift(errorLog);

    // Keep only the last MAX_LOGS entries
    const trimmedLogs = logs.slice(0, MAX_LOGS);

    // Save to localStorage
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(trimmedLogs));
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
 * @param {Function} serviceFunction - The service function to wrap
 * @param {string} serviceName - Name of the service function for logging
 * @returns {Function} Wrapped function with error logging
 */
export const withErrorLogging = (serviceFunction, serviceName) => {
  return async (...args) => {
    try {
      return await serviceFunction(...args);
    } catch (error) {
      // Log the error
      logError({
        serviceName,
        error,
        args,
      });

      // Re-throw the error so the calling code can handle it
      throw error;
    }
  };
};
