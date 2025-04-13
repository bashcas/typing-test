import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import Character from "./Character";

describe("Character Component", () => {
  it("renders a character with correct status", () => {
    render(<Character char="a" status="correct" />);

    const element = screen.getByText("a");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("data-status", "correct");
  });

  it("renders a character with incorrect status", () => {
    render(<Character char="b" status="incorrect" />);

    const element = screen.getByText("b");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("data-status", "incorrect");
  });

  it("renders a character with current status", () => {
    render(<Character char="c" status="current" />);

    const element = screen.getByText("c");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("data-status", "current");
  });

  it("renders a character with pending status", () => {
    render(<Character char="d" status="pending" />);

    const element = screen.getByText("d");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("data-status", "pending");
  });

  it("renders space character properly", () => {
    render(<Character char=" " status="correct" />);

    // For space characters, we use the data-testid
    const spaceElement = screen.getByTestId("space-character");

    expect(spaceElement).toBeInTheDocument();
    expect(spaceElement).toHaveAttribute("data-status", "correct");
    expect(spaceElement).toHaveStyle("whiteSpace: pre");
  });

  it("applies the correct data-status based on status prop", () => {
    const { rerender } = render(<Character char="x" status="correct" />);
    expect(screen.getByText("x")).toHaveAttribute("data-status", "correct");

    rerender(<Character char="x" status="incorrect" />);
    expect(screen.getByText("x")).toHaveAttribute("data-status", "incorrect");

    rerender(<Character char="x" status="current" />);
    expect(screen.getByText("x")).toHaveAttribute("data-status", "current");

    rerender(<Character char="x" status="pending" />);
    expect(screen.getByText("x")).toHaveAttribute("data-status", "pending");
  });
});
