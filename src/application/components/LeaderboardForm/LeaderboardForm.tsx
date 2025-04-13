import React, { useState } from "react";
import useAddToLeaderboard, {
  LeaderboardEntryData,
} from "@/application/hooks/useAddToLeaderboard";
import calculateScore from "@/domain/utils/calculateScore";
import ResetButton from "../ResetButton/ResetButton";
import "./LeaderboardForm.css";

interface LeaderboardFormProps {
  wordsPerMinute: number;
  accuracy: number;
  wordCount: number;
  finalScore?: number;
  onReset: () => void;
  isTestComplete: boolean;
  deleteCount: number;
}

const LeaderboardForm: React.FC<LeaderboardFormProps> = ({
  wordsPerMinute,
  accuracy,
  wordCount,
  finalScore,
  onReset,
  isTestComplete,
  deleteCount,
}) => {
  const [username, setUsername] = useState("");
  const { isPending, mutate, isSuccess } = useAddToLeaderboard({
    onSuccess: () => {
      setUsername("");
    },
    onError: (error) => {
      alert("Failed to add to leaderboard");
    },
  });

  // Get the score using our utility or use the provided finalScore if available
  const getScore = (): number => {
    if (finalScore !== undefined) {
      return finalScore;
    }
    return calculateScore({
      wordsPerMinute,
      accuracy,
      wordsTyped: wordCount,
      deletes: deleteCount,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    const newEntry: LeaderboardEntryData = {
      username,
      score: getScore(),
      accuracy,
      wpm: wordsPerMinute,
      words: wordCount,
    };

    mutate(newEntry);
  };

  if (isSuccess) {
    return (
      <div className="leaderboard-form">
        <div className="success-message">
          <h3>Score Submitted!</h3>
          <p>Your score has been added to the leaderboard.</p>
          <div className="reset-button-container">
            <ResetButton onReset={onReset} isTestComplete={isTestComplete} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-form">
      <h3>Add Your Score to Leaderboard</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="stats-summary">
          <p>WPM: {wordsPerMinute.toFixed(2)}</p>
          <p>Accuracy: {(accuracy * 100).toFixed(2)}%</p>
          <p>Words: {wordCount}</p>
          <p>Score: {getScore().toFixed(2)}</p>
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={isPending} className="submit-button">
            {isPending ? "Submitting..." : "Submit Score"}
          </button>
          <ResetButton onReset={onReset} isTestComplete={isTestComplete} />
        </div>
      </form>
    </div>
  );
};

export default LeaderboardForm;
