import React, { ChangeEvent, useRef, useEffect } from "react";
import classes from "./InputField.module.css";

interface InputFieldProps {
  value: string;
  width?: number;
  isActive: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Component that renders the input field for typing text.
 * It handles focus management and user input.
 */
const InputField: React.FC<InputFieldProps> = ({
  value,
  width,
  isActive,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on input when component mounts or isActive changes
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <input
      ref={inputRef}
      type="text"
      className={classes.inputField}
      value={value}
      onChange={onChange}
      autoFocus={isActive}
      disabled={!isActive}
      spellCheck="false"
      autoComplete="off"
      autoCorrect="off"
      style={{ width: width ?? undefined }}
      data-testid="input-field"
    />
  );
};

export default InputField;
