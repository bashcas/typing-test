import LeaderboardRepository, {
  LeaderboardEntry,
} from "@/domain/repositories/LeaderboardRepository";

const apiLeaderboardRepository: LeaderboardRepository = {
  getLeaderboard: async () => {
    throw new Error("Not implemented");
  },
  addLeaderboardEntry: async (leaderboardEntry: LeaderboardEntry) => {
    throw new Error("Not implemented");
  },
};

export default apiLeaderboardRepository;
