//clerkServerMocks.ts

export const createRouteMatcher = (p0: string[]) => {
  // Always “matches” in mocks
  return (_req: any) => true;
};

export const currentUser = async () => ({
  id: "mock-user-id",
  emailAddresses: [{ emailAddress: "mock@example.com" }],
  publicMetadata: { role: "admin" },
  firstName: "Wicklife",
  lastName: "Oluoch",
});

//clerkClientMocks.ts

// --- In‐memory user store ---
interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  password?: string;
  emailAddresses: { emailAddress: string }[];
  publicMetadata: { role: string; userName?: string };
  createdAt: Date;
}

let FAKE_USERS: MockUser[] = [];

// simple ID generator
let nextId = 1;
const genId = () => `user-${nextId++}`;

// --- Mock client export ---
export const clerkClient = async () => ({
  users: {
    /**
     * List users with pagination + optional query by email/username
     */
    getUserList: async ({
      limit,
      offset,
      query,
    }: {
      limit: number;
      offset: number;
      query?: string;
    }) => {
      let filtered = FAKE_USERS;
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (u) =>
            u.username?.toLowerCase().includes(q) ||
            u.emailAddresses.some((e) =>
              e.emailAddress.toLowerCase().includes(q)
            )
        );
      }
      const totalCount = filtered.length;
      const data = filtered.slice(offset, offset + limit);
      return { data, totalCount };
    },

    /**
     * Fetch a single user by ID
     */
    getUser: async (userId: string) => {
      const u = FAKE_USERS.find((u) => u.id === userId);
      if (!u) throw new Error(`User ${userId} not found`);
      return { ...u };
    },

    /**
     * Update only publicMetadata (e.g. role)
     */
    updateUserMetadata: async (_userId: string, { publicMetadata }: any) => {
      const idx = FAKE_USERS.findIndex((u) => u.id === _userId);
      if (idx === -1) throw new Error(`User ${_userId} not found`);
      FAKE_USERS[idx].publicMetadata = {
        ...FAKE_USERS[idx].publicMetadata,
        ...publicMetadata,
      };
      return { ...FAKE_USERS[idx] };
    },

    /**
     * Create a new user
     */
    createUser: async ({
      firstName = "",
      lastName = "",
      username,
      password,
      emailAddress,
      emailAddresses,
      publicMetadata = { role: "admin" },
    }: {
      firstName?: string;
      lastName?: string;
      username?: string;
      password?: string;
      emailAddress?: string[];
      emailAddresses?: string[];
      publicMetadata?: { role: "admin" };
    }) => {
      const id = genId();
      const emails = emailAddresses || (emailAddress ? emailAddress : []);
      const newUser: MockUser = {
        id,
        firstName,
        lastName,
        username,
        password,
        emailAddresses: emails.map((e) => ({ emailAddress: e })),
        publicMetadata,
        createdAt: new Date(),
      };
      FAKE_USERS.unshift(newUser);
      return { ...newUser };
    },

    /**
     * Update user fields (username, names, password, etc.)
     */
    updateUser: async (
      userId: string,
      updates: {
        firstName?: string;
        lastName?: string;
        username?: string;
        password?: string;
      }
    ) => {
      const idx = FAKE_USERS.findIndex((u) => u.id === userId);
      if (idx === -1) throw new Error(`User ${userId} not found`);
      FAKE_USERS[idx] = {
        ...FAKE_USERS[idx],
        ...updates,
      };
      return { ...FAKE_USERS[idx] };
    },

    /**
     * Delete a user
     */
    deleteUser: async (userId: string) => {
      const idx = FAKE_USERS.findIndex((u) => u.id === userId);
      if (idx === -1) throw new Error(`User ${userId} not found`);
      FAKE_USERS.splice(idx, 1);
      return { id: userId };
    },
  },
});
