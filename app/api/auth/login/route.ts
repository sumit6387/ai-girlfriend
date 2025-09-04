import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Hardcoded credentials check
    if (email === "sumit@gmail.com" && password === "Sumit@12") {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
      
      return NextResponse.json(
        { 
          message: "Login successful", 
          token,
          user: { email }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
