import { withErrorLogging } from "@/plugins/errorLogger";
import Cookies from "js-cookie";

// Mock js-cookie
jest.mock("js-cookie");

describe("errorLogger", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    Cookies.get.mockReturnValue(null);
  });

  it("should call the wrapped function and return its result", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const wrapped = withErrorLogging(mockFn, "testService.testFunction");

    const result = await wrapped("arg1", "arg2");

    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    expect(result).toBe("success");
  });

  it("should log error to cookie when function throws", async () => {
    const mockError = new Error("Test error");
    mockError.response = { status: 404 };
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const wrapped = withErrorLogging(mockFn, "testService.testFunction");

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const expectedCookieName = `error_logs_${year}-${month}-${day}`;

    await expect(wrapped("arg1")).rejects.toThrow("Test error");

    expect(Cookies.set).toHaveBeenCalled();
    const setCalls = Cookies.set.mock.calls;
    expect(setCalls[0][0]).toBe(expectedCookieName);
    
    const loggedData = JSON.parse(setCalls[0][1]);
    expect(loggedData).toHaveLength(1);
    expect(loggedData[0].path).toBe("testService.testFunction");
    expect(loggedData[0].errorMessage).toBe("Test error");
    expect(loggedData[0].errorCode).toBe(404);
    expect(loggedData[0].timestamp).toBeDefined();
    
    expect(setCalls[0][2]).toEqual({ expires: 2 });
  });

  it("should append to existing error logs in cookie", async () => {
    const existingLogs = JSON.stringify([
      {
        path: "oldService.oldFunction",
        errorMessage: "Old error",
        errorCode: 500,
        timestamp: "2024-01-01T00:00:00.000Z",
      },
    ]);
    Cookies.get.mockReturnValue(existingLogs);

    const mockError = new Error("New error");
    mockError.response = { status: 403 };
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const wrapped = withErrorLogging(mockFn, "testService.newFunction");

    await expect(wrapped()).rejects.toThrow("New error");

    const setCalls = Cookies.set.mock.calls;
    const loggedData = JSON.parse(setCalls[0][1]);
    expect(loggedData).toHaveLength(2);
    expect(loggedData[0].path).toBe("oldService.oldFunction");
    expect(loggedData[1].path).toBe("testService.newFunction");
  });

  it("should handle errors without response.status", async () => {
    const mockError = new Error("Network error");
    mockError.code = "NETWORK_ERROR";
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const wrapped = withErrorLogging(mockFn, "testService.testFunction");

    await expect(wrapped()).rejects.toThrow("Network error");

    const setCalls = Cookies.set.mock.calls;
    const loggedData = JSON.parse(setCalls[0][1]);
    expect(loggedData[0].errorCode).toBe("NETWORK_ERROR");
  });

  it("should use UNKNOWN as error code if none is available", async () => {
    const mockError = new Error("Unknown error");
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const wrapped = withErrorLogging(mockFn, "testService.testFunction");

    await expect(wrapped()).rejects.toThrow("Unknown error");

    const setCalls = Cookies.set.mock.calls;
    const loggedData = JSON.parse(setCalls[0][1]);
    expect(loggedData[0].errorCode).toBe("UNKNOWN");
  });

  it("should not throw if cookie operations fail", async () => {
    Cookies.set.mockImplementation(() => {
      throw new Error("Cookie error");
    });

    const mockError = new Error("Service error");
    const mockFn = jest.fn().mockRejectedValue(mockError);
    const wrapped = withErrorLogging(mockFn, "testService.testFunction");

    // Should still throw the original error, not the cookie error
    await expect(wrapped()).rejects.toThrow("Service error");
  });
});
