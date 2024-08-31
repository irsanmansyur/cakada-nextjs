"use client";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import { MdiLinkVariant } from "@/commons/icons/MdiLinkVariant";
import { MdiPeopleGroup } from "@/commons/icons/MdiPeopleGroup";
import { MdiViewDashboard } from "@/commons/icons/MdiViewDashboard";
import { getPayload } from "@/utils/helpers";
import axios from "axios";
import { configure } from "axios-hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { MdiDoorSliding } from "../icons/MdiDoorSliding";

const links = [
  { name: "Home", href: "/", icon: <MdiViewDashboard className="h-6 w-6" /> },
  { name: "DPT", href: "/dpt", icon: <MdiPeopleGroup className="h-6 w-6" /> },
  {
    name: "Door To Door",
    href: "/dtdoor",
    icon: <MdiDoorSliding className="h-6 w-6" />,
  },
];

type SidebarProps = {
  accessToken: string;
};

export default function Sidebar({ accessToken }: SidebarProps) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  configure({ axios });
  const { showSidebar, setShowSidebar, setUser } = useStoreDashboard();
  const pathname = usePathname();
  useEffect(() => {
    const user = getPayload(accessToken);
    setUser(user);
    return () => {};
  }, [accessToken, setUser]);
  return (
    <div
      className={
        `transition-all ease-in-out duration-300 min-h-screen overflow-y-auto text-white absolute inset-0 sm:w-[200px] sm:relative bg-black bg-opacity-20 backdrop-blur-lg z-50 flex-shrink-0` +
        ` ${
          showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowSidebar(false);
        }
      }}
    >
      <ul className={`h-full bg-base-content w-[200px] space-y-2 p-2`}>
        <li className="py-5"></li>
        {links.map((link, i) => (
          <li
            key={i}
            className={`group p-2 rounded shadow-lg ${
              link.href == pathname ? "bg-primary" : "bg-white/10"
            }`}
          >
            <Link href={link.href} className="flex gap-2 justify-between">
              <div className="flex gap-2">
                {link.icon}
                <span className="truncate whitespace-nowrap">{link.name}</span>
              </div>
              <MdiLinkVariant className="h-6 w-6 transition-all opacity-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
