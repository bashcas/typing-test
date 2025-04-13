import { renderHook } from "@testing-library/react";
import { act } from "react";
import useLines from "./useLines";

// Mock the text data
jest.mock(
  "@/domain/data/text",
  () =>
    "This is a test text for checking the useLines hook functionality with enough words to create multiple lines"
);

// Mock calculateAccuracy
jest.mock("@/domain/utils/calculateAccuracy", () => {
  return jest.fn().mockImplementation(() => 0.95);
});

describe("useLines hook", () => {
  it("should initialize with the correct number of lines", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 3 }));

    expect(result.current.lines.length).toBe(3);
    expect(result.current.originalLines.length).toBe(3);
    expect(result.current.currentLineIndex).toBe(0);
  });

  it("should have proper line structure", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 2 }));

    // Each line should be an array of strings (words)
    expect(Array.isArray(result.current.lines)).toBe(true);
    expect(Array.isArray(result.current.lines[0])).toBe(true);
    expect(typeof result.current.lines[0][0]).toBe("string");
  });

  it("should refresh lines when refreshLines is called", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 2 }));

    // Store initial lines for comparison
    const initialLines = JSON.stringify(result.current.lines);

    // Call refreshLines
    act(() => {
      result.current.refreshLines();
    });

    // Lines should be regenerated
    // There is a small chance they could be the same by random chance
    // but it's very unlikely with our test text
    expect(JSON.stringify(result.current.lines)).not.toBe(initialLines);
    expect(result.current.lines.length).toBe(2);
  });

  it("should remove a line and update state when removeLine is called", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 3 }));

    const initialLinesCount = result.current.lines.length;
    const initialLineIndex = result.current.currentLineIndex;

    // Call removeLine with some text
    act(() => {
      result.current.removeLine("Test entered text");
    });

    // Line should be removed and index incremented
    expect(result.current.lines.length).toBe(initialLinesCount - 1);
    expect(result.current.currentLineIndex).toBe(initialLineIndex + 1);
  });

  it("should calculate total words correctly", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 2 }));

    // Calculate words manually
    let wordCount = 0;
    for (const line of result.current.originalLines) {
      wordCount += line.length;
    }

    // Should match the hook's calculation
    expect(result.current.totalWords).toBe(wordCount);
  });

  it("should calculate accuracy correctly", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 2 }));

    // Submit a line
    act(() => {
      result.current.removeLine("Test entered text");
    });

    // Calculate accuracy
    const accuracy = result.current.calculateTotalAccuracy();

    // Should be using our mocked implementation that returns 0.95
    expect(accuracy).toBe(0.95);
  });

  it("should build lines with appropriate length constraints", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 5 }));

    // Check that each line's joined length doesn't exceed the LINE_LENGTH constant (40)
    for (const line of result.current.lines) {
      const lineText = line.join(" ");
      // Account for spaces between words
      expect(lineText.length).toBeLessThanOrEqual(40);
    }
  });

  it("should maintain original lines and entered lines state separately", () => {
    const { result } = renderHook(() => useLines({ numberOfLines: 3 }));

    // Store original first line
    const firstLine = [...result.current.lines];

    // Remove a line
    act(() => {
      result.current.removeLine("Entered text for first line");
    });

    // Lines should be updated (first line removed)
    expect(result.current.lines.length).toBe(firstLine.length - 1);

    // But original lines should still contain all lines for accuracy calculation
    expect(result.current.originalLines.length).toBe(firstLine.length);
  });
});
