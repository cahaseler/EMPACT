import { NextResponse } from "next/server";

/**
 * Retrieves the version information.
 * @returns The response containing the version information.
 * NOTE: This file is automatically updated by a script. You don't need to increment this version manually.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ version: "1.3.0" });
}
