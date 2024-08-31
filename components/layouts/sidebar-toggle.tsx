"use client";

import { useStoreDashboard } from "@/commons/helpers/dashboard-client";

export default function SidebarToggle() {
  const { showSidebar, setShowSidebar } = useStoreDashboard();
  return (
    <>
      <div
        tabIndex={0}
        role="button"
        onClick={() => setShowSidebar(!showSidebar)}
        className="btn btn-ghost btn-circle sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </div>
    </>
  );
}
