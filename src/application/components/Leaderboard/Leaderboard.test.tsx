import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Leaderboard from "./Leaderboard";
import useLeaderboard from "@/application/hooks/useLeaderboard";

jest.mock("@/application/hooks/useLeaderboard");

describe("Leaderboard Component", () => {
  const mockLeaderboardEntries = [
    { id: "1", username: "user1", score: 95.5, wpm: 80.25, accuracy: 0.975 },
    { id: "2", username: "user2", score: 85.75, wpm: 70.5, accuracy: 0.9 },
    { id: "3", username: "user3", score: 75.25, wpm: 60.75, accuracy: 0.825 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state when data is loading", () => {
    // Mock loading state
    (useLeaderboard as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<Leaderboard />);

    expect(screen.getByText("Loading leaderboard...")).toBeInTheDocument();
    expect(screen.queryByText("Leaderboard")).not.toBeInTheDocument();
  });

  it("shows error state when there is an error", () => {
    // Mock error state
    (useLeaderboard as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to load"),
    });

    render(<Leaderboard />);

    expect(screen.getByText("Error loading leaderboard")).toBeInTheDocument();
    expect(screen.queryByText("Leaderboard")).not.toBeInTheDocument();
  });

  it("renders leaderboard data correctly", () => {
    // Mock successful data state
    (useLeaderboard as jest.Mock).mockReturnValue({
      data: mockLeaderboardEntries,
      isLoading: false,
      error: null,
    });

    render(<Leaderboard />);

    // Check that the leaderboard title is shown
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();

    // Check that the table headers are rendered
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("WPM")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();

    // Check that the leaderboard entries are rendered correctly
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("95.50")).toBeInTheDocument();
    expect(screen.getByText("80.25")).toBeInTheDocument();
    expect(screen.getByText("97.50%")).toBeInTheDocument();

    expect(screen.getByText("user2")).toBeInTheDocument();
    expect(screen.getByText("85.75")).toBeInTheDocument();
    expect(screen.getByText("70.50")).toBeInTheDocument();
    expect(screen.getByText("90.00%")).toBeInTheDocument();

    expect(screen.getByText("user3")).toBeInTheDocument();
    expect(screen.getByText("75.25")).toBeInTheDocument();
    expect(screen.getByText("60.75")).toBeInTheDocument();
    expect(screen.getByText("82.50%")).toBeInTheDocument();
  });

  it("renders the correct rankings", () => {
    // Mock successful data state
    (useLeaderboard as jest.Mock).mockReturnValue({
      data: mockLeaderboardEntries,
      isLoading: false,
      error: null,
    });

    render(<Leaderboard />);

    // Check that the rankings are displayed correctly (1-based indexing)
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    // Get all rows and verify the rank in each row
    const rows = screen.getAllByRole("row").slice(1); // Skip header row

    // Use within to query within each row
    expect(within(rows[0]).getByText("1")).toBeInTheDocument();
    expect(within(rows[1]).getByText("2")).toBeInTheDocument();
    expect(within(rows[2]).getByText("3")).toBeInTheDocument();
  });

  it("renders empty table when leaderboard data is empty", () => {
    // Mock empty data state
    (useLeaderboard as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Leaderboard />);

    // Check that the leaderboard title and table headers are shown
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();

    // Check that no entries are rendered
    const tableRows = screen.queryAllByRole("row");
    // There should only be the header row
    expect(tableRows.length).toBe(1);
  });
});
