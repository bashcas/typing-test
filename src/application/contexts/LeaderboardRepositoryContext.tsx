import React, { createContext } from "react";
import LeaderboardRepository from "@/domain/repositories/LeaderboardRepository";
import jsonServerLeaderboardRepository from "@/infrastructure/repositories/LeaderboardRepositories/jsonServerLeaderboardRepository";

/**
 * We will fallback to jsonServerLeaderboardRepository if no repository is provided
 * In a real world scenario, I would fall back to the api repository
 */
export const LeaderboardRepositoryContext =
  createContext<LeaderboardRepository>(jsonServerLeaderboardRepository);

interface LeaderboardRepositoryProviderProps {
  repository?: LeaderboardRepository;
  children: React.ReactNode;
}
export const LeaderboardRepositoryProvider: React.FC<
  LeaderboardRepositoryProviderProps
> = ({ repository = jsonServerLeaderboardRepository, children }) => {
  return (
    <LeaderboardRepositoryContext.Provider value={repository}>
      {children}
    </LeaderboardRepositoryContext.Provider>
  );
};
