import { validateDueDate } from "../utils/validate-due-date";

describe("validateDueDate", () => {
  jest.useFakeTimers();

  afterAll(() => {
    jest.useRealTimers();
  });

  // Test case 1: Due date is more than one month from now
  test("should return true if the due date is more than one month from the current date", () => {
    // Arrange: Set a fixed current date to "2025-10-15"
    const mockCurrentDate = new Date("2025-10-15T00:00:00.000Z");
    jest.setSystemTime(mockCurrentDate);

    // Arrange: Set a due date that is more than one month later
    const inputDate = new Date("2025-11-16T00:00:00.000Z");

    // Act: Call the function with the input date
    const result = validateDueDate(inputDate);

    // Assert: Expect the result to be true
    expect(result).toBe(true);
  });

  // Test case 2: Due date is less than or equal to one month from now
  test("should return false if the due date is within one month of the current date", () => {
    // Arrange: Set a fixed current date to "2025-10-15"
    const mockCurrentDate = new Date("2025-10-15T00:00:00.000Z");
    jest.setSystemTime(mockCurrentDate);

    // Arrange: Set a due date that is less than one month later
    const inputDate = new Date("2025-11-14T00:00:00.000Z");

    // Act: Call the function with the input date
    const result = validateDueDate(inputDate);

    // Assert: Expect the result to be false
    expect(result).toBe(false);
  });

  // Test case 3: The due date is exactly one month from now
  test("should return false if the due date is exactly one month from the current date", () => {
    // Arrange: Set a fixed current date to "2025-10-15"
    const mockCurrentDate = new Date("2025-10-15T00:00:00.000Z");
    jest.setSystemTime(mockCurrentDate);

    // Arrange: Set a due date that is exactly one month later
    const inputDate = new Date("2025-11-15T00:00:00.000Z");

    // Act: Call the function with the input date
    const result = validateDueDate(inputDate);

    // Assert: Expect the result to be false
    expect(result).toBe(false);
  });
});
