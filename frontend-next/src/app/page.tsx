"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// Define the expected data shape
type GameStatus = {
  status: string;
  score: number;
  updatedAt: string;
};

// Example fetcher function — adjust the URL to your API route
async function fetchGameStatus(): Promise<GameStatus> {
  const response = await fetch("/api/game-status");
  if (!response.ok) {
    throw new Error("Failed to fetch game status");
  }
  return response.json();
}

export default function HomePage() {
  const router = useRouter();

  const {
    data: gameStatus,
    isLoading,
    error,
  } = useQuery<GameStatus>({
    queryKey: ["game-status"],
    queryFn: fetchGameStatus,
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">Error: {(error as Error).message}</div>;
  if (!gameStatus) return <div>No game status found.</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Game Status</h1>
      <div className="bg-white shadow rounded p-6">
        <p>
          <strong>Status:</strong> {gameStatus.status}
        </p>
        <p>
          <strong>Score:</strong> {gameStatus.score}
        </p>
        <p>
          <strong>Updated at:</strong> {new Date(gameStatus.updatedAt).toLocaleString()}
        </p>
      </div>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => router.push("/somewhere")}
      >
        Go somewhere
      </button>
    </main>
  );
}