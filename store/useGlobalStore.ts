import { Database } from "@/lib/database.types";
import { User } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface CartItems {
  id: string;
  productId: string;
  added_at: string;
  size: string;
}

export interface IApp {
  isLoading: boolean;
}

export type IDatabaseUser = User;

interface IGlobalStateValues {
  app: IApp;
  user: IDatabaseUser;
  cart: CartItems[];
}

export interface IGlobalState extends IGlobalStateValues {
  clearState: () => void;
  setApp: (state: Partial<IApp>) => void;
  setState: (state: Partial<IGlobalStateValues>) => void;
  setUser: (state: Partial<IDatabaseUser>) => void;
  addItemToCart: (state: any) => void;
}

export const initialState: IGlobalStateValues = {
  app: {
    isLoading: true,
  },
  user: {
    email: "",
    email_subscribed: false,
    id: "",
    phone_number: "",
    firstName: "",
    banned: false,
    hashedPassword: "",
    image: null,
    lastName: "",
    isAdmin: false,
    emailVerified: false,
    name: "",
  },
  cart: [],
};

const useGlobalStore = create<IGlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setApp: (newApp): void => {
          set((state) => ({
            app: {
              ...state.app,
              ...newApp,
            },
          }));
        },
        setUser: (newUser): void => {
          set((state) => ({
            user: {
              ...state.user,
              ...newUser,
            },
          }));
        },
        setState: (newState): void => {
          set((state) => ({ ...state, ...newState }));
        },
        clearState: (): void => {
          set({ ...initialState });
        },
        addItemToCart: (newItem: CartItems): void => {
          set((state) => ({
            cart: [...state.cart, newItem],
          }));
        },
      }),
      {
        name: "global-store",
      }
    )
  )
);

export default useGlobalStore;
