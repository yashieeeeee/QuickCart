import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db.js";
import User from "@/models/user.js"; // ✅ Ensure this import is present and correct

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    await connectDB();

    const foundUser = await User.findById(userId); // ✅ Renamed to avoid TDZ
    if (!foundUser) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    return NextResponse.json({ success: true, user: foundUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}