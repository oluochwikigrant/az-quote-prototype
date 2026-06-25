import { NextResponse } from "next/server";
import { users } from "@/lib/dummyData";

// In-memory user store
let userStore = [...users];
let nextUserId = userStore.length + 1;

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, role, password } = await request.json();

    const newUser = {
      user_id: `user-${Date.now()}`,
      system_role: role === "admin" ? 1 : role === "sales" ? 3 : 2,
      position: role === "admin" ? "Administrator" : role === "sales" ? "Sales" : "User",
      email: email,
      firstName: firstName || "",
      lastName: lastName || "",
      phone: "",
      signature: null,
      passport: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userStore.push(newUser as any);
    return NextResponse.json({ userId: newUser.user_id }, { status: 201 });
  } catch (err: any) {
    console.error("create_user error:", err);
    return NextResponse.json(
      {
        errors: [
          {
            code: "server_error",
            message: err.message || "Unable to create user",
            longMessage: err.message,
          },
        ],
      },
      { status: 400 }
    );
  }
}
