import { currentUser } from "@/lib/clerkServerMocks";
import ClientMenu from "./ClientMenu";

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  return <ClientMenu role={role} />;
};

export default Menu;
