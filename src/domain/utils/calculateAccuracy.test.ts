import calculateAccuracy from "./calculateAccuracy";

describe("calculateAccuracy", () => {
  it("calculates 100% accuracy when all characters match", () => {
    const originalLines = [
      ["Hello", "world"],
      ["Test", "line"],
    ];
    const enteredLines = ["Hello world", "Test line"];

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    expect(result).toBe(1); // 100% accuracy
  });

  it("calculates partial accuracy correctly", () => {
    const originalLines = [["Hello", "world"]];
    const enteredLines = ["Hello worlx"]; // One character is wrong

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // 10 out of 11 characters are correct (including the space)
    expect(result).toBeCloseTo(10 / 11);
  });

  it("handles case where entered text is shorter than original", () => {
    const originalLines = [["Hello", "world"]];
    const enteredLines = ["Hello"]; // Missing " world"

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // 5 out of 11 characters are correct
    expect(result).toBeCloseTo(5 / 11);
  });

  it("handles case where entered text is longer than original", () => {
    const originalLines = [["Hello"]];
    const enteredLines = ["Hello world"]; // Extra " world"

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // 5 out of 5 characters are correct (extra characters not counted)
    expect(result).toBe(1);
  });

  it("handles case with multiple lines", () => {
    const originalLines = [
      ["First", "line"],
      ["Second", "line"],
    ];
    const enteredLines = [
      "First line",
      "Secxnd lino", // Two errors
    ];

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // 18 out of 20 characters are correct (including spaces)
    expect(result).toBeCloseTo(18 / 20);
  });

  it("handles case where entered lines is shorter than original lines", () => {
    const originalLines = [
      ["First", "line"],
      ["Second", "line"],
    ];
    const enteredLines = ["First line"];

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // Based on the implementation, we need to adjust our expectation
    // The total characters in originalLines is 21 (including spaces)
    // The matched characters in enteredLines is 10 (9 letters + 1 space)
    // So the accuracy is 10/21
    expect(result).toBeCloseTo(10 / 21, 4);
  });

  it("handles case where entered lines is longer than original lines", () => {
    const originalLines = [["First", "line"]];
    const enteredLines = ["First line", "Extra line"];

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // 10 out of 10 characters are correct (extra lines not counted)
    expect(result).toBe(1);
  });

  it("returns 100% accuracy for empty input", () => {
    const originalLines: string[][] = [];
    const enteredLines: string[] = [];

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // No characters to compare, so perfect accuracy
    expect(result).toBe(1);
  });

  it("handles empty strings correctly", () => {
    const originalLines = [[""]];
    const enteredLines = [""];

    const result = calculateAccuracy({
      originalLines,
      enteredLines,
    });

    // 0 out of 0 characters are correct, should be 100%
    expect(result).toBe(1);
  });
});
