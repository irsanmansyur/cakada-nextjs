"use client";

import Swal from "sweetalert2";
import { MdiLogout } from "../icons/MdiLogout";
import { clearCookies } from "@/utils/helpers";

export default function LogoutForm() {
  return (
    <form
      className="group"
      onSubmit={(e) => {
        e.preventDefault();
        Swal.fire({
          title: "Logout",
          text: "Are you sure you want to logout?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Logout!",
        }).then((result) => {
          if (result.isConfirmed) {
            clearCookies();
            Swal.fire("Logout!", "You have been logged out.", "success").then(
              () => {
                window.location.href = "/auth/signin";
              }
            );
          }
          return;
        });
      }}
    >
      <button className="inline-flex gap-2 !w-full items-center" type="submit">
        <MdiLogout className="w-6 h-6 text-red-500" />
        <span className="group-hover:text-red-500 font-bold">Logout</span>
      </button>
    </form>
  );
}
