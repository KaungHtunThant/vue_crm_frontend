import {
  saveErrorLog,
  cleanupOldErrorLogs,
  withErrorLogging,
  getErrorLogs,
} from "@/utils/errorLogger";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    // Add a method to get all keys for testing
    _getStore: () => store,
  };
})();

// Override Object.keys for localStorage to make it work with cleanupOldErrorLogs
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Patch Object.keys to work with our mock
const originalObjectKeys = Object.keys;
Object.keys = function (obj) {
  if (obj === localStorage) {
    return originalObjectKeys(localStorageMock._getStore());
  }
  return originalObjectKeys(obj);
};

describe("errorLogger", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("saveErrorLog", () => {
    it("should save an error to localStorage", () => {
      const path = "testService/testFunction";
      const message = "Test error message";
      const code = 500;

      saveErrorLog(path, message, code);

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const key = `error_logs_${dateStr}`;

      const logs = JSON.parse(localStorage.getItem(key));
      expect(logs).toHaveLength(1);
      expect(logs[0].path).toBe(path);
      expect(logs[0].message).toBe(message);
      expect(logs[0].code).toBe(code);
      expect(logs[0].timestamp).toBeDefined();
    });

    it("should append multiple errors to the same day", () => {
      saveErrorLog("service1/func1", "Error 1", 404);
      saveErrorLog("service2/func2", "Error 2", 500);

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const key = `error_logs_${dateStr}`;

      const logs = JSON.parse(localStorage.getItem(key));
      expect(logs).toHaveLength(2);
    });
  });

  describe("cleanupOldErrorLogs", () => {
    it("should remove logs older than 2 days", () => {
      // Manually set dates to ensure clear difference
      const oldKey = "error_logs_2026-01-20"; // 9 days ago from 2026-01-29
      const recentKey = "error_logs_2026-01-29"; // today

      localStorage.setItem(
        oldKey,
        JSON.stringify([
          {
            timestamp: "2026-01-20T00:00:00.000Z",
            path: "old/service",
            message: "Old error",
            code: 500,
          },
        ])
      );

      localStorage.setItem(
        recentKey,
        JSON.stringify([
          {
            timestamp: "2026-01-29T00:00:00.000Z",
            path: "new/service",
            message: "New error",
            code: 404,
          },
        ])
      );

      cleanupOldErrorLogs();

      expect(localStorage.getItem(oldKey)).toBeNull();
      expect(localStorage.getItem(recentKey)).not.toBeNull();
    });
  });

  describe("getErrorLogs", () => {
    it("should retrieve error logs for today", () => {
      const path = "testService/testFunction";
      const message = "Test error";
      const code = 500;

      saveErrorLog(path, message, code);

      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].path).toBe(path);
    });

    it("should return empty array if no logs exist", () => {
      const logs = getErrorLogs();
      expect(logs).toEqual([]);
    });

    it("should retrieve error logs for a specific date", () => {
      const specificDate = "2024-01-15";
      const key = `error_logs_${specificDate}`;
      const testLog = [
        {
          timestamp: "2024-01-15T10:00:00.000Z",
          path: "test/service",
          message: "Test error",
          code: 404,
        },
      ];
      localStorage.setItem(key, JSON.stringify(testLog));

      const logs = getErrorLogs(specificDate);
      expect(logs).toHaveLength(1);
      expect(logs[0].path).toBe("test/service");
    });
  });

  describe("withErrorLogging", () => {
    it("should wrap a function and log errors", async () => {
      const errorMessage = "API error";
      const errorCode = 500;
      const servicePath = "testService/testFunction";

      const testFunction = async () => {
        const error = new Error(errorMessage);
        error.response = { status: errorCode };
        throw error;
      };

      const wrappedFunction = withErrorLogging(testFunction, servicePath);

      await expect(wrappedFunction()).rejects.toThrow(errorMessage);

      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].path).toBe(servicePath);
      expect(logs[0].message).toBe(errorMessage);
      expect(logs[0].code).toBe(errorCode);
    });

    it("should not log when function succeeds", async () => {
      const servicePath = "testService/successFunction";
      const successFunction = async () => {
        return { data: "success" };
      };

      const wrappedFunction = withErrorLogging(successFunction, servicePath);
      const result = await wrappedFunction();

      expect(result).toEqual({ data: "success" });

      const logs = getErrorLogs();
      expect(logs).toHaveLength(0);
    });

    it("should handle errors without response status", async () => {
      const servicePath = "testService/networkError";
      const testFunction = async () => {
        const error = new Error("Network error");
        error.code = "NETWORK_ERROR";
        throw error;
      };

      const wrappedFunction = withErrorLogging(testFunction, servicePath);

      await expect(wrappedFunction()).rejects.toThrow("Network error");

      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].code).toBe("NETWORK_ERROR");
    });

    it("should pass arguments to the wrapped function", async () => {
      const servicePath = "testService/withArgs";
      let receivedArgs;

      const testFunction = async (...args) => {
        receivedArgs = args;
        return { success: true };
      };

      const wrappedFunction = withErrorLogging(testFunction, servicePath);
      await wrappedFunction("arg1", "arg2", 123);

      expect(receivedArgs).toEqual(["arg1", "arg2", 123]);
    });
  });
});
