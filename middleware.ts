import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For a real application, you would validate JWT tokens or session cookies here
  // This is a simplified example that checks for a user in localStorage
  // Note: In a production app, you would use a more secure approach with server-side validation

  // Since localStorage is not available in middleware (server-side),
  // we'll rely on the client-side protection in the admin page component
  // and this is just an additional layer of protection

  // For demonstration purposes, we'll just let the request through
  // and handle authentication in the component
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/:path*",
}
