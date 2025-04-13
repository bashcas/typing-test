import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import TextDisplay from "./TextDisplay";

describe("TextDisplay Component", () => {
  it("renders the target text", () => {
    const targetText = "hello world";
    const typedText = "";

    render(<TextDisplay targetText={targetText} typedText={typedText} />);

    const displayElement = screen.getByTestId("text-display");
    expect(displayElement).toBeInTheDocument();

    // Instead of checking each character, check that the number of character spans matches
    // the length of targetText (excluding spaces which are handled differently)
    const nonSpaceChars = targetText.replace(/ /g, "");
    const characterElements = screen.getAllByText(/[a-z]/i);
    expect(characterElements.length).toBe(nonSpaceChars.length);

    // Check that a space is rendered for each space in the target text
    const spaces = targetText.split("").filter((char) => char === " ").length;
    const spaceElements = screen.queryAllByTestId("space-character");
    expect(spaceElements.length).toBe(spaces);
  });

  it("marks characters as correct when typed correctly", () => {
    const targetText = "test";
    const typedText = "te";

    render(<TextDisplay targetText={targetText} typedText={typedText} />);

    // First two characters should be marked as correct
    const chars = screen.getAllByText(/[test]/); // Get all target text characters

    expect(chars[0]).toHaveAttribute("data-status", "correct"); // 't'
    expect(chars[1]).toHaveAttribute("data-status", "correct"); // 'e'
  });

  it("marks characters as incorrect when typed incorrectly", () => {
    const targetText = "test";
    const typedText = "ta";

    render(<TextDisplay targetText={targetText} typedText={typedText} />);

    const chars = screen.getAllByText(/[test]/);

    expect(chars[0]).toHaveAttribute("data-status", "correct"); // 't' is correct
    expect(chars[1]).toHaveAttribute("data-status", "incorrect"); // 'e' was typed as 'a'
  });

  it("marks the next character to be typed as current", () => {
    const targetText = "test";
    const typedText = "te";

    render(<TextDisplay targetText={targetText} typedText={typedText} />);

    const chars = screen.getAllByText(/[test]/);

    expect(chars[2]).toHaveAttribute("data-status", "current"); // 's' is the next character
  });

  it("marks characters not yet reached as pending", () => {
    const targetText = "test";
    const typedText = "te";

    render(<TextDisplay targetText={targetText} typedText={typedText} />);

    const chars = screen.getAllByText(/[test]/);

    expect(chars[3]).toHaveAttribute("data-status", "pending"); // 't' at the end is pending
  });

  it("handles spaces in the text properly", () => {
    const targetText = "hello world";
    const typedText = "hello ";

    render(<TextDisplay targetText={targetText} typedText={typedText} />);

    // Check that the space is rendered with data-testid="space-character"
    const spaceElement = screen.getByTestId("space-character");
    expect(spaceElement).toBeInTheDocument();
    expect(spaceElement).toHaveAttribute("data-status", "correct");
  });

  it("forwards the ref properly", () => {
    const targetText = "test";
    const typedText = "";
    const ref = React.createRef<HTMLDivElement>();

    render(
      <TextDisplay ref={ref} targetText={targetText} typedText={typedText} />
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("updates correctly when typedText changes", () => {
    const targetText = "test";
    const { rerender } = render(
      <TextDisplay targetText={targetText} typedText="" />
    );

    // Initially all characters should be pending except the first one which is current
    let chars = screen.getAllByText(/[test]/);
    expect(chars[0]).toHaveAttribute("data-status", "current");

    // Update typed text
    rerender(<TextDisplay targetText={targetText} typedText="te" />);

    // Now first two characters should be correct, third should be current, fourth should be pending
    chars = screen.getAllByText(/[test]/);
    expect(chars[0]).toHaveAttribute("data-status", "correct");
    expect(chars[1]).toHaveAttribute("data-status", "correct");
    expect(chars[2]).toHaveAttribute("data-status", "current");
    expect(chars[3]).toHaveAttribute("data-status", "pending");
  });
});
