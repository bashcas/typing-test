import React from "react";
import classes from "./Timer.module.css";

interface TimerProps {
  time: string;
  label?: string;
  className?: string;
  variant?: "default" | "inline" | "large";
  fixed?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  time,
  label = "Time",
  className = "",
  variant = "default",
  fixed = false,
}) => {
  const getContainerClass = () => {
    if (fixed) {
      return classes.fixedTimer;
    }

    switch (variant) {
      case "inline":
        return classes.inlineTimer;
      case "large":
        return classes.largeTimer;
      default:
        return classes.defaultTimer;
    }
  };

  return (
    <div className={`${getContainerClass()} ${className}`}>
      {label && <span className={classes.label}>{label}: </span>}
      <span className={classes.time}>{time}</span>
    </div>
  );
};

export default Timer;
