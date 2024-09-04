import { TPayloadUser } from "@/utils/type/user";
import { create } from "zustand";

export const useStoreDashboard = create<{
  showSidebar: boolean;
  user: TPayloadUser;
  setShowSidebar: (showSidebar: boolean) => void;
  setUser: (user: TPayloadUser) => void;
  position: {
    latitude: number;
    longitude: number;
  };
  setPosition: (position: { latitude: number; longitude: number }) => void;
  locationEnabled: boolean | null;
  setLocationEnabled: (locationEnabled: boolean | null) => void;
}>((set) => ({
  showSidebar: false,
  user: {} as TPayloadUser,
  setUser: (user: TPayloadUser) => set({ user }),
  setShowSidebar: (showSidebar: boolean) => set({ showSidebar }),
  locationEnabled: true,

  setLocationEnabled: (locationEnabled: boolean | null) =>
    set({ locationEnabled }),

  position: { latitude: 0, longitude: 0 },
  setPosition: (position: { latitude: number; longitude: number }) =>
    set({ position }),
}));
