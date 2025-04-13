import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeaderboardForm from "./LeaderboardForm";
import useAddToLeaderboard from "@/application/hooks/useAddToLeaderboard";
import calculateScore from "@/domain/utils/calculateScore";

// Mock the hooks and utilities
jest.mock("@/application/hooks/useAddToLeaderboard");
jest.mock("@/domain/utils/calculateScore");

describe("LeaderboardForm Component", () => {
  // Default props for most tests
  const defaultProps = {
    wordsPerMinute: 75.5,
    accuracy: 0.95,
    wordCount: 150,
    onReset: jest.fn(),
    isTestComplete: true,
    deleteCount: 5,
  };

  // Mock implementation for useAddToLeaderboard
  const mockMutate = jest.fn();
  const mockUseAddToLeaderboard = () => ({
    isPending: false,
    mutate: mockMutate,
    isSuccess: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useAddToLeaderboard as jest.Mock).mockImplementation(
      mockUseAddToLeaderboard
    );
    (calculateScore as jest.Mock).mockReturnValue(85.25);
  });

  it("renders form with stats correctly", () => {
    render(<LeaderboardForm {...defaultProps} />);

    // Check form title
    expect(
      screen.getByText("Add Your Score to Leaderboard")
    ).toBeInTheDocument();

    // Check input field
    expect(screen.getByLabelText("Username:")).toBeInTheDocument();

    // Check stats display
    expect(screen.getByText("WPM: 75.50")).toBeInTheDocument();
    expect(screen.getByText("Accuracy: 95.00%")).toBeInTheDocument();
    expect(screen.getByText("Words: 150")).toBeInTheDocument();
    expect(screen.getByText("Score: 85.25")).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText("Submit Score")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("uses provided finalScore if available", () => {
    const propsWithFinalScore = {
      ...defaultProps,
      finalScore: 100.5,
    };

    render(<LeaderboardForm {...propsWithFinalScore} />);

    // Should display provided score without calling calculateScore
    expect(screen.getByText("Score: 100.50")).toBeInTheDocument();
    expect(calculateScore).not.toHaveBeenCalled();
  });

  it("calculates score if finalScore is not provided", () => {
    render(<LeaderboardForm {...defaultProps} />);

    // Should call calculateScore with the correct parameters
    expect(calculateScore).toHaveBeenCalledWith({
      wordsPerMinute: defaultProps.wordsPerMinute,
      accuracy: defaultProps.accuracy,
      wordsTyped: defaultProps.wordCount,
      deletes: defaultProps.deleteCount,
    });
  });

  it("updates username input when typing", () => {
    render(<LeaderboardForm {...defaultProps} />);

    const usernameInput = screen.getByLabelText("Username:");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    expect(usernameInput).toHaveValue("testuser");
  });

  it("prevents submission with empty username through HTML validation", () => {
    render(<LeaderboardForm {...defaultProps} />);

    // Get the username input
    const usernameInput = screen.getByLabelText("Username:");

    // Verify that the input has the required attribute
    expect(usernameInput).toHaveAttribute("required");
  });

  it("validates trimmed empty username and shows alert", () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<LeaderboardForm {...defaultProps} />);

    // Enter spaces as username (will be trimmed)
    const usernameInput = screen.getByLabelText("Username:");
    fireEvent.change(usernameInput, { target: { value: "   " } });

    // Submit form by clicking the submit button
    const submitButton = screen.getByText("Submit Score");
    fireEvent.click(submitButton);

    // Check alert was called
    expect(alertMock).toHaveBeenCalledWith("Please enter a username");
    expect(mockMutate).not.toHaveBeenCalled();

    // Cleanup
    alertMock.mockRestore();
  });

  it("submits form with valid data", () => {
    render(<LeaderboardForm {...defaultProps} />);

    // Enter username
    const usernameInput = screen.getByLabelText("Username:");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    // Submit form by clicking the submit button
    const submitButton = screen.getByText("Submit Score");
    fireEvent.click(submitButton);

    // Verify mutation was called with correct data
    expect(mockMutate).toHaveBeenCalledWith({
      username: "testuser",
      score: 85.25,
      accuracy: defaultProps.accuracy,
      wpm: defaultProps.wordsPerMinute,
      words: defaultProps.wordCount,
    });
  });

  it("disables submit button when submission is pending", () => {
    // Override the mock to indicate pending state
    (useAddToLeaderboard as jest.Mock).mockImplementation(() => ({
      isPending: true,
      mutate: mockMutate,
      isSuccess: false,
    }));

    render(<LeaderboardForm {...defaultProps} />);

    const submitButton = screen.getByText("Submitting...");
    expect(submitButton).toBeDisabled();
  });

  it("shows success message after successful submission", () => {
    // Override the mock to indicate success
    (useAddToLeaderboard as jest.Mock).mockImplementation(() => ({
      isPending: false,
      mutate: mockMutate,
      isSuccess: true,
    }));

    render(<LeaderboardForm {...defaultProps} />);

    // Check success message
    expect(screen.getByText("Score Submitted!")).toBeInTheDocument();
    expect(
      screen.getByText("Your score has been added to the leaderboard.")
    ).toBeInTheDocument();

    // Form should no longer be visible
    expect(screen.queryByLabelText("Username:")).not.toBeInTheDocument();
  });

  it("calls onReset when reset button is clicked", () => {
    render(<LeaderboardForm {...defaultProps} />);

    const resetButton = screen.getByText("Try Again");
    fireEvent.click(resetButton);

    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });
});
