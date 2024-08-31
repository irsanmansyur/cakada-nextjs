"use client";
import React from "react";
import { useStoreDashboard } from "@/store/dashboard";

export default function MenuButtonSidebar() {
  const { setShowSidebar } = useStoreDashboard();
  const refChecked = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (refChecked.current) {
      setShowSidebar(refChecked.current.checked);
    }
  };

  React.useEffect(() => {
    if (refChecked.current) {
      setShowSidebar(refChecked.current.checked);
    }
  }, [refChecked, setShowSidebar]);

  return (
    <label
      className="sm:hidden btn btn-sm !p-3 btn-circle swap swap-rotate"
      onClick={handleClick}
    >
      {/* this hidden checkbox controls the state */}
      <input ref={refChecked} type="checkbox" />
      {/* hamburger icon */}
      <svg
        className="swap-off fill-current"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 512 512"
      >
        <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
      </svg>

      {/* close icon */}
      <svg
        className="swap-on fill-current"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 512 512"
      >
        <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
      </svg>
    </label>
  );
}
