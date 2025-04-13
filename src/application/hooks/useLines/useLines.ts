import { useState, useCallback, useEffect, useMemo } from "react";
import someText from "@/domain/data/text";
import calculateAccuracy from "@/domain/utils/calculateAccuracy";

interface UseLinesProps {
  numberOfLines: number;
}

interface UseLinesReturn {
  lines: string[][];
  originalLines: string[][];
  refreshLines: () => void;
  removeLine: (enteredText: string) => void;
  totalWords: number;
  currentLineIndex: number;
  calculateTotalAccuracy: () => number;
}

const LINE_LENGTH = 40;

const useLines = ({ numberOfLines }: UseLinesProps): UseLinesReturn => {
  const words = useMemo(
    () => someText.split(" ").filter((word: string) => word.trim().length > 0),
    []
  );

  const [lines, setLines] = useState<string[][]>([]);
  const [originalLines, setOriginalLines] = useState<string[][]>([]);
  const [enteredLines, setEnteredLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Calculate total words in the completed lines
  const totalWords = useMemo(() => {
    let wordCount = 0;

    // Count words in all completed lines
    for (let i = 0; i < originalLines.length; i++) {
      wordCount += originalLines[i].length;
    }

    return wordCount;
  }, [originalLines]);

  const getRandomLines = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * words.length);

    const buildLine = (startIndex: number): string[] => {
      const line: string[] = [];

      for (let i = 0; i < words.length; i++) {
        const word = words[(startIndex + i) % words.length];
        const currentLineLength = line.join(" ").length;
        if (currentLineLength + word.length + 1 <= LINE_LENGTH) {
          line.push(word);
        } else {
          break;
        }
      }

      return line;
    };

    return Array.from({ length: numberOfLines }).reduce<{
      lines: string[][];
      currentIndex: number;
    }>(
      (acc, _) => {
        const line = buildLine(acc.currentIndex);
        return {
          lines: [...acc.lines, line],
          currentIndex: (acc.currentIndex + line.length) % words.length,
        };
      },
      { lines: [], currentIndex: randomIndex }
    ).lines;
  }, [words, numberOfLines]);

  const refreshLines = useCallback(() => {
    const newLines = getRandomLines();
    setLines(newLines);
    setOriginalLines(newLines);
    setEnteredLines([]);
  }, [getRandomLines]);

  const removeLine = useCallback((enteredText: string) => {
    setLines((prevLines) => prevLines.slice(1));
    setCurrentLineIndex((prev) => prev + 1);
    setEnteredLines((prev) => [...prev, enteredText]);
  }, []);

  const calculateTotalAccuracy = useCallback(() => {
    return calculateAccuracy({
      originalLines,
      enteredLines,
    });
  }, [originalLines, enteredLines]);

  useEffect(() => {
    const newLines = getRandomLines();
    setLines(newLines);
    setOriginalLines(newLines);
  }, [getRandomLines]);

  return {
    lines,
    originalLines,
    refreshLines,
    removeLine,
    totalWords,
    currentLineIndex,
    calculateTotalAccuracy,
  };
};

export default useLines;
