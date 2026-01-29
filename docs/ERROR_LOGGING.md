# Error Logging Implementation

This implementation adds automatic error logging with localStorage persistence to all service functions.

## Features

- **Automatic Error Logging**: All service functions now automatically log errors when they occur
- **localStorage Persistence**: Error logs are saved to localStorage for later review
- **Preserves Function Behavior**: Service functions maintain their original synchronous/asynchronous behavior
- **Security-Conscious**: Arguments and stack traces are sanitized to prevent sensitive data exposure
- **Log Management**: Maintains the last 100 error logs automatically with size limits

## How It Works

All service functions have been wrapped with `withErrorLogging()` which:
1. Calls the original service function
2. If an error occurs, logs it to localStorage (with sanitized data)
3. Re-throws the error so normal error handling continues to work
4. Preserves the original function's synchronous or asynchronous behavior

## Error Log Structure

Each error log contains:
```javascript
{
  timestamp: "2026-01-29T11:00:00.000Z",  // ISO 8601 timestamp
  serviceName: "getUserById",              // Name of the service function
  message: "Network Error",                // Error message
  stack: "Error: Network Error",           // First line of stack trace (sanitized)
  args: "[1 argument(s)]"                  // Argument count (sensitive data not logged)
}
```

## Usage Examples

### Viewing Error Logs

```javascript
import { getErrorLogs } from '@/utils/errorLogger';

// Get all error logs
const logs = getErrorLogs();
console.log('Total errors:', logs.length);

// View the most recent error
if (logs.length > 0) {
  const latestError = logs[0];
  console.log(`Error in ${latestError.serviceName}:`, latestError.message);
}
```

### Clearing Error Logs

```javascript
import { clearErrorLogs } from '@/utils/errorLogger';

// Clear all error logs
clearErrorLogs();
```

### Service Functions Continue to Work Normally

```javascript
import { getUserById } from '@/plugins/services/userService';

try {
  const user = await getUserById(123);
  // Use user data
} catch (error) {
  // Error is automatically logged to localStorage
  // You can still handle it normally
  console.error('Failed to get user:', error);
}
```

## Implementation Details

### Service Files Updated

All 30 service files have been updated with automatic error logging:

- answerService.js
- approvalService.js
- authService.js
- backgroundService.js
- boardService.js
- broadcastService.js
- commentService.js
- commentsTagsService.js
- contactService.js
- dealService.js
- documentService.js
- hospitalService.js
- importLabelService.js
- kanbanService.js
- languageService.js
- logService.js
- originService.js
- packageService.js
- ratingService.js
- roleService.js
- salaryService.js
- settingService.js
- sourceService.js
- stageService.js
- tagService.js
- taskEventService.js
- taskService.js
- userService.js
- whatsappService.js

### Pattern Used

Each service function follows this pattern:

```javascript
// Before
export const getUserById = (userId) => {
  return axios.get(`/users/${userId}`);
};

// After
import { withErrorLogging } from "@/utils/errorLogger";

const getUserByIdBase = (userId) => {
  return axios.get(`/users/${userId}`);
};

export const getUserById = withErrorLogging(getUserByIdBase, "getUserById");
```

## Future Enhancements

Potential improvements that could be made:

1. **Error Dashboard**: Create a UI component to view and analyze error logs
2. **Error Filtering**: Add ability to filter logs by service, date range, or error type
3. **Remote Logging**: Send error logs to a remote server for centralized monitoring
4. **Error Notifications**: Alert developers when critical errors occur
5. **Error Statistics**: Track error rates and trends over time
