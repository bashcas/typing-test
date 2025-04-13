import { ChangeEvent, useMemo, useRef, useEffect } from "react";
import classes from "./LineInput.module.css";
import { useMeasure } from "@uidotdev/usehooks";
import TextDisplay from "./TextDisplay/TextDisplay";
import InputField from "./InputField/InputField";

interface LineInputProps {
  line: string[];
  text: string;
  onLineComplete: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isActive?: boolean;
  isLastLine?: boolean;
}

/**
 * Component that displays two things:
 * 1. The text of the line (with highlighting)
 * 2. The input field to type the line
 *
 * It coordinates the text display and user input, handling focus and line completion.
 *
 * @returns React component
 */
const LineInput: React.FC<LineInputProps> = ({
  line,
  text,
  onLineComplete,
  onChange,
  isActive = false,
  isLastLine = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineText = useMemo(() => line.join(" "), [line]);

  // Check if the line is complete - user has typed all characters AND a space after (unless it's the last line)
  const isComplete = useMemo(() => {
    // The user has typed all characters in the line
    const hasTypedAllChars = text.length >= lineText.length;

    // For normal lines - require space at the end
    // For the last line - don't require space, just completing the text is enough
    if (isLastLine) {
      return hasTypedAllChars;
    } else {
      // The last character typed is a space (required to move to next line)
      const endsWithSpace = text.endsWith(" ");
      return hasTypedAllChars && endsWithSpace;
    }
  }, [text, lineText, isLastLine]);

  // Handle line completion
  useEffect(() => {
    if (isComplete) {
      onLineComplete();
    }
  }, [isComplete, onLineComplete]);

  // Click handler to focus back on input
  const handleContainerClick = () => {
    if (containerRef.current) {
      // This will be handled by the InputField component's focus management
      containerRef.current.querySelector("input")?.focus();
    }
  };

  const [textDisplayRef, { width: textDisplayWidth }] = useMeasure();

  return (
    <div
      ref={containerRef}
      className={classes.lineInputContainer}
      onClick={handleContainerClick}
    >
      <TextDisplay
        targetText={lineText}
        typedText={text}
        ref={textDisplayRef}
        isActive={isActive}
      />
      <InputField
        value={text}
        width={textDisplayWidth ?? undefined}
        isActive={isActive}
        onChange={onChange}
      />
    </div>
  );
};

export default LineInput;
