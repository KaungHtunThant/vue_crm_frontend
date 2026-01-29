/**
 * Demo script showing how error logging works
 *
 * This demonstrates the error logging functionality that has been added
 * to all service files in src/plugins/services.
 *
 * HOW IT WORKS:
 *
 * 1. When a service function runs and encounters an error:
 *    - The error details are captured (path, message, code, timestamp)
 *    - They're saved to a cookie named: error_logs_YYYY-MM-DD
 *    - The cookie expires after 2 days
 *    - The original error is still thrown (normal behavior preserved)
 *
 * 2. Error Log Format:
 *    Cookie Name: error_logs_2026-01-29 (example for today)
 *    Cookie Value: JSON array of error objects
 *    [
 *      {
 *        "path": "userService.getUser",
 *        "errorMessage": "Network Error",
 *        "errorCode": 500,
 *        "timestamp": "2026-01-29T08:00:00.000Z"
 *      }
 *    ]
 *
 * 3. Example Service Call:
 *
 *    // Before (in userService.js):
 *    export const getUser = async (params) => {
 *      return axios.get("/users", { params });
 *    };
 *
 *    // After (with error logging):
 *    const getUserFn = async (params) => {
 *      return axios.get("/users", { params });
 *    };
 *    export const getUser = withErrorLogging(getUserFn, "userService.getUser");
 *
 *    // When called in a component:
 *    try {
 *      await getUser({ page: 1 });
 *    } catch (error) {
 *      // Error is logged to cookie AND thrown
 *      // Component can still handle it normally
 *      console.error("Error:", error);
 *    }
 *
 * 4. Accessing Error Logs:
 *
 *    // In browser console:
 *    import Cookies from 'js-cookie';
 *    const today = new Date().toISOString().split('T')[0];
 *    const logs = JSON.parse(Cookies.get(`error_logs_${today}`) || '[]');
 *    console.table(logs);
 *
 * 5. Benefits:
 *    - Automatic error tracking for all service calls
 *    - No changes to existing error handling code
 *    - Errors persist in browser for 2 days
 *    - Easy to access and debug
 *    - Minimal performance impact
 */

// This file is for documentation purposes only
export default {};
