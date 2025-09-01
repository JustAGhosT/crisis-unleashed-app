import { NextRequest, NextResponse } from "next/server";

/**
 * Handles social login requests by validating with our backend
 * and creating/updating user accounts as needed
 */
export async function POST(req: NextRequest) {
  try {
    const {
      provider,
      providerId,
      email,
      name,
      image,
      idToken,
      authorizationCode,
      accessToken,
    } = await req.json();

    // Define allowed providers
    const allowedProviders = ['google', 'github', 'apple'];

    // Validate the provider against the allow-list
    if (!provider || !allowedProviders.includes(provider)) {
      return NextResponse.json(
        { error: "Invalid or unsupported provider" },
        { status: 400 }
      );
    }

    // Require at least one verifiable credential
    if (!(idToken || authorizationCode || accessToken)) {
      return NextResponse.json(
        { error: "Missing provider credentials" },
        { status: 400 }
      );
    }

    // Call backend to verify/register the social login
    const backendUrl = process.env.AUTH_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Forward the request to our backend with verifiable credentials
    const response = await fetch(`${backendUrl}/api/auth/social-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider,
        providerId,
        email,
        name,
        image,
        idToken,
        authorizationCode,
        accessToken,
      }),
    });

    // Pass-through to preserve Set-Cookie and all headers/status
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Social login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}