import { NextResponse } from "next/server";
import { clerkClient } from "@/lib/clerkServerMocks";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, role, password } = await request.json();

    const client = await clerkClient();
    const user = await client.users.createUser({
      firstName: firstName || "",
      lastName: lastName || "",
      emailAddress: [email],
      publicMetadata: { role },
      password: password || "",
    });

    revalidatePath("/user/all-users");
    return NextResponse.json({ userId: user.id }, { status: 201 });
  } catch (err: any) {
    console.error("create_user error:", err);

    // If Clerk returned field errors, it will attach an `errors` array:
    const maybeErrors = (err as any).errors;
    if (Array.isArray(maybeErrors)) {
      // Normalize and forward them as a 400
      const errors = maybeErrors.map((e: any) => ({
        code: e.code,
        message: e.message,
        longMessage: e.longMessage,
        meta: e.meta,
      }));
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Fallback generic error
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
