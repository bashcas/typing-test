import React, { useMemo, forwardRef } from "react";
import classes from "./TextDisplay.module.css";
import Character from "../Character/Character";

interface TextDisplayProps {
  targetText: string;
  typedText: string;
  isActive?: boolean;
}

/**
 * Component that displays the text with character-based highlighting.
 * It renders each character with appropriate styling based on its typing status.
 * Uses forwardRef to accept a ref from parent component.
 */
const TextDisplay = forwardRef<HTMLDivElement, TextDisplayProps>(
  ({ targetText, typedText, isActive = false }, ref) => {
    // Render text with character-based highlighting
    const renderedText = useMemo(() => {
      const targetCharArray = targetText.split("");
      const typedCharArray = typedText.split("");

      return (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "fit-content",
          }}
          data-testid="text-display"
        >
          {targetCharArray.map((char, index) => {
            let status: "correct" | "incorrect" | "current" | "pending";

            // Characters already typed - should be green (correct) or red (incorrect)
            if (index < typedCharArray.length) {
              status = typedCharArray[index] === char ? "correct" : "incorrect";
            }
            // Next character to be typed - should be blue with underline (current)
            // Only highlight as current if the line is active
            else if (index === typedCharArray.length && isActive) {
              status = "current";
            }
            // Characters not yet reached - should be gray (pending)
            else {
              status = "pending";
            }

            return <Character key={index} char={char} status={status} />;
          })}
        </div>
      );
    }, [targetText, typedText, isActive]);

    return (
      <div ref={ref} className={classes.textDisplay}>
        {renderedText}
      </div>
    );
  }
);

export default TextDisplay;
