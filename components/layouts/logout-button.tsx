"use client";
import { clearCookies } from "@/utils/helpers";

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        clearCookies();
        window.location.reload();
      }}
    >
      Logout
    </button>
  );
}
