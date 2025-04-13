import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import useLines from "@/application/hooks/useLines/useLines";
import useTimer from "@/application/hooks/useTimer/useTimer";
import classes from "./TypingTest.module.css";
import LineInput from "../LineInput/LineInput";
import Title from "../Title/Title";
import Leaderboard from "../Leaderboard";
import LeaderboardForm from "../LeaderboardForm";
import Timer from "../Timer/Timer";
import { usePrevious } from "@uidotdev/usehooks";
import calculateScore from "@/domain/utils/calculateScore";

const TypingTest: React.FC = () => {
  const {
    lines,
    refreshLines,
    removeLine,
    totalWords,
    calculateTotalAccuracy,
  } = useLines({
    numberOfLines: 3, // TODO: Make this dynamic
  });

  const [enteredText, setEnteredText] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [accuracy, setAccuracy] = useState(1);
  const [deleteCount, setDeleteCount] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  // Keep track of previous entered text to detect deletions
  const prevEnteredText = usePrevious<string | null>(enteredText);

  const isTestComplete = useMemo(
    () => startTime !== null && lines.length === 0,
    [lines, startTime]
  );

  const isTestActive = useMemo(
    () => startTime !== null && !isTestComplete,
    [startTime, isTestComplete]
  );

  const { elapsedTime, formattedTime, resetTimer } = useTimer({
    isActive: isTestActive,
    startTimeOverride: startTime,
  });

  useEffect(() => {
    if (!isTestComplete || !startTime) return;

    const wordsPerMinute = calculateWordsPerMinute(totalWords, elapsedTime);
    setWordsPerMinute(wordsPerMinute);

    const accuracy = calculateTotalAccuracy();
    setAccuracy(accuracy);

    const score = calculateScore({
      wordsPerMinute,
      wordsTyped: totalWords,
      accuracy: accuracy,
      deletes: deleteCount,
    });
    setFinalScore(Math.max(0, score)); // Ensure score isn't negative
  }, [
    isTestComplete,
    elapsedTime,
    startTime,
    totalWords,
    deleteCount,
    calculateTotalAccuracy,
  ]);

  const calculateWordsPerMinute = (
    wordsTyped: number,
    milliseconds: number
  ): number => {
    return Math.floor(wordsTyped * (60000 / milliseconds));
  };

  const onTextChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newText = e.currentTarget.value;

    if (!startTime) {
      setStartTime(new Date());
    }
    // Check if this is a deletion (backspace/delete key press)
    if (prevEnteredText && newText.length < prevEnteredText.length) {
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1);
    }

    setEnteredText(newText);
  };

  const onLineComplete = () => {
    removeLine(enteredText);
    setEnteredText("");
  };

  const handleReset = useCallback(() => {
    setEnteredText("");
    setStartTime(null);
    setWordsPerMinute(0);
    setAccuracy(1);
    setDeleteCount(0);
    setFinalScore(0);
    resetTimer();
    refreshLines();
  }, [refreshLines, resetTimer]);

  return (
    <div className={classes.typingTestContainer}>
      <div className={classes.header}>
        <Title />
      </div>

      {isTestActive && <Timer time={formattedTime} fixed={true} />}

      {!isTestComplete && (
        <div className={classes.linesContainer}>
          {lines.map((line, index) => (
            <div
              key={`line-${index}-${line.join("")}`}
              className={
                index === 0 ? classes.activeLine : classes.inactiveLine
              }
            >
              <LineInput
                line={line}
                text={index === 0 ? enteredText : ""}
                onChange={index === 0 ? onTextChange : () => {}}
                onLineComplete={index === 0 ? onLineComplete : () => {}}
                isActive={index === 0}
                isLastLine={index === 0 && lines.length === 1}
              />
            </div>
          ))}

          {isTestActive && (
            <div className={classes.cancelButtonContainer}>
              <button className={classes.cancelButton} onClick={handleReset}>
                Cancel Test
              </button>
            </div>
          )}
        </div>
      )}

      {isTestComplete && (
        <>
          <div className={classes.completedMessage}>
            <h2>Great job! You've completed the typing test.</h2>
            <Timer time={formattedTime} variant="large" label="Your time" />
          </div>

          <LeaderboardForm
            wordsPerMinute={wordsPerMinute}
            accuracy={accuracy}
            wordCount={totalWords}
            finalScore={finalScore}
            onReset={handleReset}
            isTestComplete={isTestComplete}
            deleteCount={deleteCount}
          />

          <Leaderboard />
        </>
      )}
    </div>
  );
};

export default TypingTest;
