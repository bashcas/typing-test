import calculateScore from "./calculateScore";

describe("calculateScore", () => {
  it("calculates score correctly with typical values", () => {
    const result = calculateScore({
      wordsPerMinute: 60,
      wordsTyped: 100,
      accuracy: 0.9,
      deletes: 10,
    });

    // Expected: 60 * 100 * 0.9 - 10 = 5390
    expect(result).toBe(5390);
  });

  it("calculates score correctly with perfect accuracy and no deletes", () => {
    const result = calculateScore({
      wordsPerMinute: 70,
      wordsTyped: 150,
      accuracy: 1.0,
      deletes: 0,
    });

    // Expected: 70 * 150 * 1.0 - 0 = 10500
    expect(result).toBe(10500);
  });

  it("calculates score correctly with low values", () => {
    const result = calculateScore({
      wordsPerMinute: 10,
      wordsTyped: 20,
      accuracy: 0.5,
      deletes: 5,
    });

    // Expected: 10 * 20 * 0.5 - 5 = 95
    expect(result).toBe(95);
  });

  it("returns a negative score when deletes are high", () => {
    const result = calculateScore({
      wordsPerMinute: 5,
      wordsTyped: 10,
      accuracy: 0.2,
      deletes: 20,
    });

    // Expected: 5 * 10 * 0.2 - 20 = -10
    expect(result).toBe(-10);
  });

  it("returns zero when all metrics are zero", () => {
    const result = calculateScore({
      wordsPerMinute: 0,
      wordsTyped: 0,
      accuracy: 0,
      deletes: 0,
    });

    // Expected: 0 * 0 * 0 - 0 = 0
    expect(result).toBe(0);
  });

  it("handles extreme values correctly", () => {
    const result = calculateScore({
      wordsPerMinute: 1000,
      wordsTyped: 1000,
      accuracy: 1.0,
      deletes: 1000,
    });

    // Expected: 1000 * 1000 * 1.0 - 1000 = 999000
    expect(result).toBe(999000);
  });

  it("handles decimal values correctly", () => {
    const result = calculateScore({
      wordsPerMinute: 75.5,
      wordsTyped: 150,
      accuracy: 0.95,
      deletes: 5,
    });

    const expected = 75.5 * 150 * 0.95 - 5;
    expect(result).toBe(expected);
  });
});
