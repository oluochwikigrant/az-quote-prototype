import { NextResponse } from "next/server";
import { users } from "@/lib/dummyData";

// In-memory user store for updates
let userStore = [...users];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const user = userStore.find(u => u.user_id === userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { userId, firstName, lastName, phone, signature } = data;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const idx = userStore.findIndex(u => u.user_id === userId);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (firstName) userStore[idx].firstName = firstName;
    if (lastName) userStore[idx].lastName = lastName;
    if (phone) userStore[idx].phone = phone;
    if (signature) userStore[idx].signature = signature;

    return NextResponse.json(userStore[idx]);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
