import { create } from "zustand";
import { persist } from "zustand/middleware";
import { encrypt } from "crypto-js/aes";
import bcrypt from "bcryptjs";

const ENCRYPTION_KEY = "your-secret-key";

interface SafeUser {
  id: string;
  email: string;
  name: string;
}

interface User extends SafeUser {
  passwordHash: string;
}

interface AuthState {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registeredUsers: User[];
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      registeredUsers: [],
      signIn: async (email, password) => {
        set({ isLoading: true });
        try {
          const { registeredUsers } = get();
          const user = registeredUsers.find((u) => u.email === email);

          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isValidPassword = await bcrypt.compare(
            password,
            user.passwordHash
          );
          if (!isValidPassword) {
            throw new Error("Invalid email or password");
          }

          const token = encrypt(
            JSON.stringify({ userId: user.id, timestamp: Date.now() }),
            ENCRYPTION_KEY
          ).toString();

          const { passwordHash, ...safeUser } = user;
          set({
            user: safeUser,
            isAuthenticated: true,
            token,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      signUp: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const { registeredUsers } = get();

          if (registeredUsers.find((u) => u.email === email)) {
            throw new Error("User already exists");
          }

          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password, salt);

          const newUser: User = {
            id: Date.now().toString(),
            email,
            name,
            passwordHash,
          };

          const token = encrypt(
            JSON.stringify({ userId: newUser.id, timestamp: Date.now() }),
            ENCRYPTION_KEY
          ).toString();

          const { passwordHash: _, ...safeUser } = newUser;
          set((state) => ({
            user: safeUser,
            isAuthenticated: true,
            token,
            registeredUsers: [...state.registeredUsers, newUser],
            isLoading: false,
          }));
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      signOut: () =>
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);
