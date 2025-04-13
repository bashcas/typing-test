import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";
import calculateScore from "@/domain/utils/calculateScore";
global.ResizeObserver = require("resize-observer-polyfill");

describe("App tests", () => {
  describe("Render components", () => {
    it("App should render and contains the heading", () => {
      render(<App />);

      const headingText = "Test Your Typing Speed!";
      const heading = screen.queryByText(headingText);
      expect(heading).toBeInTheDocument();
    });

    it("App should render and contains the sub heading", () => {
      render(<App />);

      const subHeadingText = "I bet you can't beat 500 WPM!";
      const subHeading = screen.queryByText(subHeadingText);
      expect(subHeading).toBeInTheDocument();
    });
  });

  describe("Testing function", () => {
    it("Test calculateScore", () => {
      const score = calculateScore({
        wordsPerMinute: 3,
        wordsTyped: 15,
        accuracy: 100,
        deletes: 0,
      });
      const expectedScore = 3 * 15 * 100 - 0; // wordsPerMinute * wordsTyped * accuracy - deletes

      expect(score).toBe(expectedScore);
    });
  });
});
