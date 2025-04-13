import React from "react";
import useLeaderboard from "@/application/hooks/useLeaderboard";
import "./Leaderboard.css";

const Leaderboard: React.FC = () => {
  const { data: leaderboardEntries, isLoading, error } = useLeaderboard();

  if (isLoading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error loading leaderboard</div>;

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>WPM</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardEntries?.map((entry, index) => (
            <tr key={entry.id}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td>{entry.score.toFixed(2)}</td>
              <td>{entry.wpm.toFixed(2)}</td>
              <td>{(entry.accuracy * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
