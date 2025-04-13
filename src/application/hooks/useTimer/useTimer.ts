import { useState, useEffect, useCallback } from "react";

interface UseTimerProps {
  isActive?: boolean;
  startTimeOverride?: Date | null;
}

interface UseTimerReturn {
  elapsedTime: number;
  formattedTime: string;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const useTimer = ({
  isActive = false,
  startTimeOverride,
}: UseTimerProps = {}): UseTimerReturn => {
  const [elapsedTime, setElapsedTime] = useState(0); // in milliseconds
  const [startTime, setStartTime] = useState<Date | null>(
    startTimeOverride || null
  );
  const [isRunning, setIsRunning] = useState(isActive);

  // Format elapsed time to display as MM:SS
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = useCallback(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
    setIsRunning(true);
  }, [startTime]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setStartTime(null);
    setElapsedTime(0);
    setIsRunning(false);
  }, []);

  // Update elapsed time when timer is running
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isRunning && startTime) {
      timerId = setInterval(() => {
        const milliseconds = new Date().getTime() - startTime.getTime();
        setElapsedTime(milliseconds);
      }, 100); // Update more frequently for better precision
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, startTime]);

  // Sync with external active state if provided
  useEffect(() => {
    setIsRunning(isActive);
  }, [isActive]);

  // Sync with external startTime if provided
  useEffect(() => {
    if (startTimeOverride !== undefined) {
      setStartTime(startTimeOverride);
    }
  }, [startTimeOverride]);

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    startTimer,
    stopTimer,
    resetTimer,
  };
};

export default useTimer;
