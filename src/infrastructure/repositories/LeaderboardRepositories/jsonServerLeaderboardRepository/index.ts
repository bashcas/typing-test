import LeaderboardRepository, {
  LeaderboardEntry,
} from "@/domain/repositories/LeaderboardRepository";

const jsonServerLeaderboardRepository: LeaderboardRepository = {
  getLeaderboard: async () => {
    const response = await fetch("http://localhost:3001/leaderboard");
    const data = await response.json();
    return data;
  },
  addLeaderboardEntry: async (leaderboardEntry: LeaderboardEntry) => {
    const response = await fetch("http://localhost:3001/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaderboardEntry),
    });

    if (!response.ok) {
      throw new Error("Failed to add leaderboard entry");
    }

    return;
  },
};

export default jsonServerLeaderboardRepository;
