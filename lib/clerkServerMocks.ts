// Simplified mocks for components that reference currentUser

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  emailAddresses?: { emailAddress: string }[];
  role: string;
  publicMetadata?: { role: string };
  createdAt: Date;
}

let mockUsers: MockUser[] = [
  {
    id: "user-1",
    firstName: "Wicklife",
    lastName: "Oluoch",
    username: "wicklife",
    email: "admin@aztechnos.com",
    emailAddresses: [{ emailAddress: "admin@aztechnos.com" }],
    role: "admin",
    publicMetadata: { role: "admin" },
    createdAt: new Date(),
  },
  {
    id: "user-2",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@aztechnos.com",
    emailAddresses: [{ emailAddress: "john@aztechnos.com" }],
    role: "user",
    publicMetadata: { role: "user" },
    createdAt: new Date(),
  },
];

let nextUserId = 3;

export const currentUser = async (): Promise<MockUser> => {
  return mockUsers[0];
};

export const clerkClient = async () => ({
  users: {
    getUserList: async ({ limit, offset, query }: { limit: number; offset: number; query?: string }) => {
      let filtered = [...mockUsers];
      if (query) {
        filtered = filtered.filter(u =>
          u.email?.toLowerCase().includes(query.toLowerCase())
        );
      }
      return {
        data: filtered.slice(offset, offset + limit),
        totalCount: filtered.length,
      };
    },
    getUser: async (userId: string): Promise<MockUser | undefined> => {
      return mockUsers.find(u => u.id === userId);
    },
    createUser: async ({ firstName, lastName, username, email, password, emailAddresses, publicMetadata }: any) => {
      const newUser: MockUser = {
        id: `user-${nextUserId++}`,
        firstName: firstName || "",
        lastName: lastName || "",
        username: username || "",
        email: (emailAddresses?.[0] || email || ""),
        emailAddresses: emailAddresses || [{ emailAddress: email || "" }],
        role: publicMetadata?.role || "user",
        publicMetadata: publicMetadata || { role: "user" },
        createdAt: new Date(),
      };
      mockUsers.unshift(newUser);
      return newUser;
    },
    updateUser: async (userId: string, updates: any) => {
      const idx = mockUsers.findIndex(u => u.id === userId);
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...updates };
        return mockUsers[idx];
      }
      return null;
    },
    deleteUser: async (userId: string) => {
      const idx = mockUsers.findIndex(u => u.id === userId);
      if (idx !== -1) {
        mockUsers.splice(idx, 1);
      }
      return { id: userId };
    },
  },
});
