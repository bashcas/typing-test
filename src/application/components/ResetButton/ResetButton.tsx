import React from "react";
import classes from "./ResetButton.module.css";

interface ResetButtonProps {
  onReset: () => void;
  isTestComplete: boolean;
}

const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  isTestComplete,
}) => {
  return (
    <button
      className={`${classes.resetButton} ${
        isTestComplete ? classes.visible : classes.hidden
      }`}
      onClick={onReset}
    >
      Try Again
    </button>
  );
};

export default ResetButton;
