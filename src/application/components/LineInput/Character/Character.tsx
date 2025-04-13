import React from "react";
import classes from "./Character.module.css";

interface CharacterProps {
  char: string;
  status: "correct" | "incorrect" | "current" | "pending";
}

/**
 * Component that renders a single character with appropriate styling
 * based on its typing status.
 */
const Character: React.FC<CharacterProps> = ({ char, status }) => {
  let className;

  // Determine the className based on character status
  switch (status) {
    case "correct":
      className = classes.correct;
      break;
    case "incorrect":
      className = classes.incorrect;
      break;
    case "current":
      className = classes.current;
      break;
    case "pending":
      className = classes.pending;
      break;
  }

  // For spaces, we need to use a special approach to make them visible for highlighting
  if (char === " ") {
    return (
      <span
        className={className}
        style={{ whiteSpace: "pre" }}
        data-testid="space-character"
        data-status={status}
      >
        {" "}
      </span>
    );
  }

  return (
    <span className={className} data-status={status}>
      {char}
    </span>
  );
};

export default Character;
