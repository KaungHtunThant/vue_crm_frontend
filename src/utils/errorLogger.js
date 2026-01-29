/**
 * Error Logger Utility
 * Logs errors to localStorage with 2-day lifetime
 */

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the localStorage key for today's error logs
 */
function getErrorLogKey() {
  return `error_logs_${getTodayDate()}`;
}

/**
 * Clean up error logs older than 2 days
 */
export function cleanupOldErrorLogs() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
  
  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('error_logs_')) {
      const dateStr = key.replace('error_logs_', '');
      const logDate = new Date(dateStr);
      logDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
      
      // Remove logs older than 2 days
      if (logDate < twoDaysAgo) {
        localStorage.removeItem(key);
      }
    }
  });
}

/**
 * Save error to localStorage
 * @param {string} path - The service path where error occurred
 * @param {string} errorMessage - The error message
 * @param {string|number} errorCode - The error code
 */
export function saveErrorLog(path, errorMessage, errorCode) {
  try {
    // Clean up old logs first
    cleanupOldErrorLogs();
    
    const key = getErrorLogKey();
    
    // Get existing logs for today
    let logs = [];
    const existingLogs = localStorage.getItem(key);
    if (existingLogs) {
      try {
        logs = JSON.parse(existingLogs);
      } catch (e) {
        logs = [];
      }
    }
    
    // Add new error log
    const errorLog = {
      timestamp: new Date().toISOString(),
      path,
      message: errorMessage,
      code: errorCode
    };
    
    logs.push(errorLog);
    
    // Save back to localStorage
    localStorage.setItem(key, JSON.stringify(logs));
  } catch (e) {
    // Fail silently if localStorage is not available or quota exceeded
    console.error('Failed to save error log:', e);
  }
}

/**
 * Wrap a service function with error logging
 * @param {Function} fn - The service function to wrap
 * @param {string} servicePath - The path identifier for the service
 * @returns {Function} - Wrapped function with error logging
 */
export function withErrorLogging(fn, servicePath) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      // Extract error information
      const errorMessage = error.message || 'Unknown error';
      const errorCode = error.response?.status || error.code || 'UNKNOWN';
      
      // Save error to localStorage
      saveErrorLog(servicePath, errorMessage, errorCode);
      
      // Re-throw the error so the application can handle it normally
      throw error;
    }
  };
}

/**
 * Get all error logs for a specific date
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Array} - Array of error logs
 */
export function getErrorLogs(date = null) {
  const key = date ? `error_logs_${date}` : getErrorLogKey();
  const logs = localStorage.getItem(key);
  
  if (!logs) {
    return [];
  }
  
  try {
    return JSON.parse(logs);
  } catch (e) {
    return [];
  }
}
