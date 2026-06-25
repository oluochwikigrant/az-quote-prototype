import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Buffer } from "buffer";

// Cleaned up API routes without Clerk
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { userId, firstName, lastName, phone, signature } = data;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const updatePayload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    signature?: Buffer;
  } = {};

  if (typeof firstName === "string") updatePayload.firstName = firstName;
  if (typeof lastName === "string") updatePayload.lastName = lastName;
  if (typeof phone === "string") updatePayload.phone = phone;
  if (typeof signature === "string") {
    updatePayload.signature = Buffer.from(
      signature.replace(/^data:.*;base64,/, ""),
      "base64"
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: updatePayload,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
