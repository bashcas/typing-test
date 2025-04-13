import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { LeaderboardRepositoryContext } from "@/application/contexts/LeaderboardRepositoryContext";
import { LeaderboardEntry } from "@/domain/repositories/LeaderboardRepository";

export const useLeaderboardQueryKey = ["leaderboard"];

const useLeaderboard = () => {
  const leaderboardRepository = useContext(LeaderboardRepositoryContext);

  return useQuery<LeaderboardEntry[]>({
    queryKey: useLeaderboardQueryKey,
    queryFn: () =>
      leaderboardRepository
        .getLeaderboard()
        .then((entries) => entries.sort((a, b) => b.score - a.score)),
  });
};

export default useLeaderboard;
