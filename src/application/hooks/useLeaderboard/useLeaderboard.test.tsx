import { renderHook, waitFor } from "@testing-library/react";
import useLeaderboard from "./useLeaderboard";
import { LeaderboardRepositoryContext } from "@/application/contexts/LeaderboardRepositoryContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import {
  LeaderboardEntry,
  LeaderboardRepository,
} from "@/domain/repositories/LeaderboardRepository";

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: "1",
    username: "User 1",
    score: 100,
    accuracy: 0.95,
    words: 100,
    wpm: 50,
  },
  {
    id: "2",
    username: "User 2",
    score: 200,
    words: 200,
    wpm: 60,
    accuracy: 0.98,
  },
  {
    id: "3",
    username: "User 3",
    score: 150,
    accuracy: 0.96,
    words: 150,
    wpm: 55,
  },
];

// Mock repository
const mockLeaderboardRepository: LeaderboardRepository = {
  getLeaderboard: jest.fn().mockResolvedValue(mockLeaderboardData),
  addLeaderboardEntry: jest.fn(),
};

const wrapper = ({
  children,
  mockLeaderboardRepository,
}: {
  children: React.ReactNode;
  mockLeaderboardRepository: LeaderboardRepository;
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LeaderboardRepositoryContext.Provider value={mockLeaderboardRepository}>
        {children}
      </LeaderboardRepositoryContext.Provider>
    </QueryClientProvider>
  );
};

describe("useLeaderboard hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch leaderboard data", async () => {
    const { result } = renderHook(() => useLeaderboard(), {
      wrapper: ({ children }) =>
        wrapper({ children, mockLeaderboardRepository }),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to be fetched
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check if data is sorted by score
    expect(result.current.data).toHaveLength(mockLeaderboardData.length);
    expect(result.current.data![0].id).toBe("2"); // User 2 (highest score: 200)
    expect(result.current.data![1].id).toBe("3"); // User 3 (middle score: 150)
    expect(result.current.data![2].id).toBe("1"); // User 1 (lowest score: 100)

    // Verify repository method was called
    expect(mockLeaderboardRepository.getLeaderboard).toHaveBeenCalledTimes(1);
  });

  it("should handle error state", async () => {
    // Override mock to reject
    const mockLeaderboardRepository: LeaderboardRepository = {
      getLeaderboard: jest.fn().mockRejectedValue(new Error("Failed to fetch")),
      addLeaderboardEntry: jest.fn(),
    };

    const { result } = renderHook(() => useLeaderboard(), {
      wrapper: ({ children }) =>
        wrapper({ children, mockLeaderboardRepository }),
    });

    // Wait for query to fail
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
