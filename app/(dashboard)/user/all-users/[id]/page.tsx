// app/(dashboard)/user/all-users/[id]/page.tsx
import { clerkClient } from "@/lib/clerkServerMocks";
import UserView, { UserDetails } from "@/components/UserView";

interface PageProps {
  // Next.js now supplies params as a Promise
  params: Promise<{ id: string }>;
}

export default async function UserPage(props: PageProps) {
  // 1. Await the params promise
  const { id } = await props.params;

  // 2. Await the Clerk client instance
  const client = await clerkClient();

  // 3. Fetch the user
  const user = await client.users.getUser(id);

  // 4. Map and render
  const data: UserDetails = {
    id: user.id,
    firstName: user.firstName || "-",
    lastName: user.lastName || "-",
    userName: user.username || "-",
    email: user.emailAddresses[0]?.emailAddress || "-",
    role: (user.publicMetadata as { role?: string })?.role || "undefined",
  };

  return <UserView data={data} />;
}
