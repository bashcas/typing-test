import { renderHook } from "@testing-library/react";
import useTimer from "./useTimer";
import { act } from "react";
jest.useFakeTimers();

describe("useTimer hook", () => {
  it("should initialize with zero elapsed time", async () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.formattedTime).toBe("00:00");
  });

  it("should start the timer when startTimer is called", async () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedTime).toBeGreaterThan(0);
    expect(result.current.formattedTime).toBe("00:01");
  });

  it("should stop the timer when stopTimer is called", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const timeAfterStart = result.current.elapsedTime;

    act(() => {
      result.current.stopTimer();
    });

    // Advance timer by another second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Timer should be stopped, so elapsedTime should not change
    expect(result.current.elapsedTime).toBe(timeAfterStart);
  });

  it("should reset the timer when resetTimer is called", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    // Advance timer by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.elapsedTime).toBeGreaterThan(0);

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.formattedTime).toBe("00:00");
  });

  it("should format time correctly", () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.startTimer();
    });

    // Advance timer by 65 seconds (1 min and 5 seconds)
    act(() => {
      jest.advanceTimersByTime(65000);
    });

    expect(result.current.formattedTime).toBe("01:05");
  });

  it("should not start the timer when isActive is false", async () => {
    const { result } = renderHook((props) => useTimer(props), {
      initialProps: { isActive: false },
    });

    expect(result.current.elapsedTime).toBe(0);

    // Advance timer while inactive
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedTime).toBe(0);
  });

  it("should start the timer when isActive is true", async () => {
    const { result } = renderHook((props) => useTimer(props), {
      initialProps: { isActive: true },
    });

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedTime).toBeGreaterThan(0);
    expect(result.current.formattedTime).not.toBe("00:00");
  });

  it("should respect startTimeOverride prop", async () => {
    const startTime = new Date(Date.now() - 10000); // 10 seconds ago
    const { result } = renderHook(() =>
      useTimer({ startTimeOverride: startTime, isActive: true })
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.elapsedTime).toBeGreaterThanOrEqual(10000);

    // Format should reflect this time
    expect(result.current.formattedTime).not.toBe("00:00");
  });
});
