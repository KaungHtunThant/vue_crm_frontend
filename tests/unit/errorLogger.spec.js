import {
  logError,
  getErrorLogs,
  clearErrorLogs,
  withErrorLogging,
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
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Error Logger", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("logError", () => {
    it("should log an error to localStorage", () => {
      const errorInfo = {
        serviceName: "testService",
        error: new Error("Test error"),
        args: [1, 2, 3],
      };

      logError(errorInfo);

      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].serviceName).toBe("testService");
      expect(logs[0].message).toBe("Test error");
      // Args should be sanitized to just show count
      expect(logs[0].args).toBe("[3 argument(s)]");
    });

    it("should add new logs at the beginning", () => {
      logError({
        serviceName: "service1",
        error: new Error("Error 1"),
        args: [],
      });

      logError({
        serviceName: "service2",
        error: new Error("Error 2"),
        args: [],
      });

      const logs = getErrorLogs();
      expect(logs).toHaveLength(2);
      expect(logs[0].serviceName).toBe("service2");
      expect(logs[1].serviceName).toBe("service1");
    });

    it("should limit logs to MAX_LOGS entries", () => {
      // Log 101 errors
      for (let i = 0; i < 101; i++) {
        logError({
          serviceName: `service${i}`,
          error: new Error(`Error ${i}`),
          args: [],
        });
      }

      const logs = getErrorLogs();
      expect(logs).toHaveLength(100);
      // The most recent log should be service100
      expect(logs[0].serviceName).toBe("service100");
      // The oldest log should be service1 (service0 should be removed)
      expect(logs[99].serviceName).toBe("service1");
    });

    it("should sanitize stack traces to only include first line", () => {
      const error = new Error("Test error");
      error.stack = "Error: Test error\n    at Function1\n    at Function2";

      logError({
        serviceName: "testService",
        error,
        args: [],
      });

      const logs = getErrorLogs();
      expect(logs[0].stack).toBe("Error: Test error");
    });
  });

  describe("getErrorLogs", () => {
    it("should return an empty array when no logs exist", () => {
      const logs = getErrorLogs();
      expect(logs).toEqual([]);
    });

    it("should return all stored logs", () => {
      logError({
        serviceName: "testService",
        error: new Error("Test error"),
        args: [],
      });

      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toHaveProperty("timestamp");
      expect(logs[0]).toHaveProperty("serviceName");
      expect(logs[0]).toHaveProperty("message");
      expect(logs[0]).toHaveProperty("stack");
      expect(logs[0]).toHaveProperty("args");
    });
  });

  describe("clearErrorLogs", () => {
    it("should remove all error logs", () => {
      logError({
        serviceName: "testService",
        error: new Error("Test error"),
        args: [],
      });

      expect(getErrorLogs()).toHaveLength(1);

      clearErrorLogs();

      expect(getErrorLogs()).toHaveLength(0);
    });
  });

  describe("withErrorLogging", () => {
    it("should call the original async function and return its result", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");
      const wrappedFn = withErrorLogging(mockFn, "testService");

      const result = await wrappedFn(1, 2, 3);

      expect(result).toBe("success");
      expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
    });

    it("should log async errors and re-throw them", async () => {
      const testError = new Error("Test error");
      const mockFn = jest.fn().mockRejectedValue(testError);
      const wrappedFn = withErrorLogging(mockFn, "testService");

      await expect(wrappedFn(1, 2, 3)).rejects.toThrow("Test error");

      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].serviceName).toBe("testService");
      expect(logs[0].message).toBe("Test error");
    });

    it("should preserve synchronous behavior for sync functions", () => {
      const mockFn = jest.fn().mockReturnValue("sync result");
      const wrappedFn = withErrorLogging(mockFn, "testService");

      const result = wrappedFn(1, 2);

      expect(result).toBe("sync result");
      expect(mockFn).toHaveBeenCalledWith(1, 2);
    });

    it("should log synchronous errors and re-throw them", () => {
      const testError = new Error("Sync error");
      const mockFn = jest.fn(() => {
        throw testError;
      });
      const wrappedFn = withErrorLogging(mockFn, "testService");

      expect(() => wrappedFn()).toThrow("Sync error");

      const logs = getErrorLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].serviceName).toBe("testService");
      expect(logs[0].message).toBe("Sync error");
    });
  });
});
