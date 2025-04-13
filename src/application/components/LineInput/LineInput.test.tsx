import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import LineInput from "./LineInput";

// Mock useMeasure hook
jest.mock("@uidotdev/usehooks", () => ({
  useMeasure: () => [React.createRef(), { width: 300 }],
}));

describe("LineInput Component", () => {
  const defaultProps = {
    line: ["This", "is", "a", "test", "line"],
    text: "",
    onChange: jest.fn(),
    onLineComplete: jest.fn(),
    isActive: true,
    isLastLine: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders TextDisplay", () => {
    render(<LineInput {...defaultProps} />);

    // TextDisplay should be rendered
    expect(screen.getByTestId("text-display")).toBeInTheDocument();
  });

  it("renders InputField", () => {
    render(<LineInput {...defaultProps} />);

    // InputField should be rendered
    expect(screen.getByTestId("input-field")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    render(<LineInput {...defaultProps} />);

    const inputField = screen.getByTestId("input-field");
    fireEvent.change(inputField, { target: { value: "T" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("calls onLineComplete when the line is completed", () => {
    // For a complete line, the text should be the line plus a space
    const props = {
      ...defaultProps,
      text: "This is a test line ",
    };

    render(<LineInput {...props} />);

    // onLineComplete should be called for completed line
    expect(defaultProps.onLineComplete).toHaveBeenCalled();
  });

  it("handles last line completion without requiring a space", () => {
    // For the last line, only the exact text is required (no trailing space)
    const props = {
      ...defaultProps,
      text: "This is a test line",
      isLastLine: true,
    };

    render(<LineInput {...props} />);

    expect(defaultProps.onLineComplete).toHaveBeenCalled();
  });

  it("doesn't call onLineComplete for incomplete lines", () => {
    // Partial text
    const props = {
      ...defaultProps,
      text: "This is",
    };

    render(<LineInput {...props} />);

    expect(defaultProps.onLineComplete).not.toHaveBeenCalled();
  });
});
