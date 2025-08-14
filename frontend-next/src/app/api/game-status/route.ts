"use server";

import { NextResponse } from "next/server";

// Mock game status data
const mockGameStatus = {
  status: "online",
  score: 1250,
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  // In a real application, this would fetch data from a database or external API
  return NextResponse.json(mockGameStatus);
}
