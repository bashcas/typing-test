import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { LeaderboardRepositoryContext } from "@/application/contexts/LeaderboardRepositoryContext";
import { LeaderboardEntry } from "@/domain/repositories/LeaderboardRepository";
import { useLeaderboardQueryKey } from "../useLeaderboard/useLeaderboard";

export type LeaderboardEntryData = Omit<LeaderboardEntry, "id">;

interface UseAddToLeaderboardProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const useAddToLeaderboard = (props: UseAddToLeaderboardProps) => {
  const leaderboardRepository = useContext(LeaderboardRepositoryContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryData: LeaderboardEntryData) => {
      const newEntry: LeaderboardEntry = {
        ...entryData,
        id: uuidv4(),
      };

      return leaderboardRepository.addLeaderboardEntry(newEntry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useLeaderboardQueryKey });
      props.onSuccess?.();
    },
    onError: (error) => {
      props.onError?.(error);
    },
  });
};

export default useAddToLeaderboard;
