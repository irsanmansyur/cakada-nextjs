"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { MdiHome } from "./icons/MdiHome";
import { useStoreDashboard } from "@/store/dashboard";
import { getPayload } from "@/utils/helpers";
import { MdiStoreSettingsOutline } from "./icons/MdiStoreSettingsOutline";
import { MdiFoodOutline } from "./icons/MdiFoodOutline";
import { MdiPeopleGroup } from "./icons/MdiPeopleGroup";
import { ERoleClient } from "@/utils/enum.client";
import axios from "axios";
const menuSidebar = [
  {
    name: "Toko",
    path: "/toko",
    role: ERoleClient.ADMIN,
    icon: <MdiStoreSettingsOutline className="w-6 h-6" />,
  },
  {
    name: "Home",
    path: "/produk",
    icon: <MdiFoodOutline className="w-6 h-6" />,
  },
  {
    name: "Users",
    path: "/user",
    icon: <MdiPeopleGroup className="w-6 h-6" />,
  },
];

export default function Sidebar({ accessToken }: { accessToken: string }) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  const { showSidebar, setUser } = useStoreDashboard();
  useEffect(() => {
    const user = getPayload(accessToken);
    setUser(user);
    return () => {};
  }, [accessToken, setUser]);
  const pathname = usePathname();
  return (
    <div
      className={`absolute top-0 ${
        !showSidebar ? "-translate-x-full" : ""
      } left-0 sm:relative sm:translate-x-0 sm:flex flex-col gap-y-4 items-center py-4  h-screen border-r bg-white`}
    >
      <div className="flex flex-col gap-y-2 items-end self-end pb-10">
        <CardSideBar
          active={pathname == "/"}
          path={"/"}
          icon={<MdiHome className="w-6 h-6" />}
          isShow
        />
      </div>

      <div className="flex flex-col gap-y-2 items-end self-end">
        {menuSidebar.map((item, i) => {
          const active = pathname.startsWith(item.path);
          return (
            <CardSideBar
              key={i}
              active={active}
              path={item.path}
              icon={item.icon}
              role={item.role}
            />
          );
        })}
      </div>
    </div>
  );
}

function CardSideBarOld({
  active,
  path,
  icon,
  role,
  isShow,
}: {
  active: boolean;
  name?: string;
  path: string;
  role?: ERoleClient | ERoleClient[];
  icon?: React.ReactNode;
  isShow?: boolean;
}) {
  const { hasRole } = useStoreDashboard();
  if (role && !hasRole(role)) return <></>;
  return (
    <div className={active ? "bg-slate-100 rounded-l-xl relative" : ""}>
      {active && (
        <>
          <div className="absolute w-4 h-8 -top-8 right-0 z-10 bg-slate-100 before:absolute before:w-4 before:h-8 before:rounded-br-xl before:right-0  before:bg-slate-600 before:shadow-inverse-top"></div>
          <div className="absolute w-4 h-8 -bottom-8 right-0 z-10 bg-slate-100 before:absolute before:w-4 before:h-8 before:rounded-tr-xl before:right-0  before:bg-slate-600 before:shadow-inverse-top"></div>
        </>
      )}
      <Link
        href={path}
        className={
          "p-3 my-4 mr-4 ml-3 rounded-xl flex" +
          (active || isShow
            ? " text-white shadow-primary bg-blue-500"
            : " text-blue-500 hover:text-white hover:bg-blue-500")
        }
      >
        {icon}
      </Link>
    </div>
  );
}
function CardSideBar({
  active,
  path,
  icon,
  role,
  isShow,
}: {
  active: boolean;
  name?: string;
  path: string;
  icon?: React.ReactNode;
  role?: ERoleClient | ERoleClient[];
  isShow?: boolean;
}) {
  const { hasRole } = useStoreDashboard();
  if (role) {
    if (!hasRole(role)) return <></>;
  }

  return (
    <div className={"rounded-l-xl relative"}>
      <Link
        href={path}
        className={
          "p-3 my-4 mr-4 ml-3 rounded-xl flex" +
          (active || isShow
            ? " text-theme shadow shadow-theme bg-theme/20"
            : " text-theme hover:bg-theme/20")
        }
      >
        {icon}
      </Link>
    </div>
  );
}
