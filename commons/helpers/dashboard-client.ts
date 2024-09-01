import { TUser } from "@/utils/type/user";
import { create } from "zustand";

export const useStoreDashboard = create<{
  showSidebar: boolean;
  user: TUser | null;
  setShowSidebar: (showSidebar: boolean) => void;
  setUser: (user: TUser | null) => void;
  position: {
    latitude: number;
    longitude: number;
  };
  setPosition: (position: { latitude: number; longitude: number }) => void;
  locationEnabled: boolean | null;
  setLocationEnabled: (locationEnabled: boolean | null) => void;
}>((set) => ({
  showSidebar: false,
  user: null,
  setUser: (user: TUser | null) => set({ user }),
  setShowSidebar: (showSidebar: boolean) => set({ showSidebar }),
  locationEnabled: true,
  setLocationEnabled: (locationEnabled: boolean | null) =>
    set({ locationEnabled }),

  position: { latitude: 0, longitude: 0 },
  setPosition: (position: { latitude: number; longitude: number }) =>
    set({ position }),
}));
