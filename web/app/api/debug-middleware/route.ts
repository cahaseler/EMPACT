import { NextRequest, NextResponse } from "next/server"

// This route is for debugging middleware behavior
export async function GET(req: NextRequest) {
  // Collect information about the request
  const url = req.url
  const headers = Object.fromEntries(req.headers)
  
  // For debugging
  console.log("Debug middleware route accessed:", url)
  console.log("Request headers:", headers)
  
  // Return debug information
  return NextResponse.json({
    success: true,
    message: "Middleware debug endpoint",
    url,
    headers,
    timestamp: new Date().toISOString()
  })
}