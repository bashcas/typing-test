import React from "react";
import "./App.css";
import TypingTest from "../components/TypingTest/TypingTest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LeaderboardRepositoryProvider } from "../contexts/LeaderboardRepositoryContext";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <LeaderboardRepositoryProvider>
          <TypingTest />
        </LeaderboardRepositoryProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
