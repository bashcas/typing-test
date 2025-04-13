export interface LeaderboardRepository {
  getLeaderboard: () => Promise<LeaderboardEntry[]>;
  addLeaderboardEntry: (leaderboardEntry: LeaderboardEntry) => Promise<void>;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  accuracy: number;
  wpm: number;
  words: number;
}

export default LeaderboardRepository;
