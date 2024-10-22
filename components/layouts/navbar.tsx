import { appName } from "@/commons/helpers";
import React from "react";
import SidebarToggle from "./sidebar-toggle";
import { MdiUser } from "../icons/MdiUser";
import { clearCookies } from "@/utils/helpers";
import LogoutButton from "./logout-button";
import Image from "next/image";

export default function Navbar() {
	return (
		<div className="navbar">
			<div className="navbar-start">
				<SidebarToggle />
			</div>
			<div className="navbar-center">
				<a className="btn btn-ghost">
					<Image
						src="/jsilogo.png"
						width={50}
						height={50}
						alt="logo"
						className="h-10 w-10"
					/>
					<span className="text-base sm:text-xl truncate max-w-28">
						{appName}
					</span>
				</a>
			</div>
			<div className="navbar-end">
				<button className="btn btn-ghost btn-circle">
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
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
				{/* <button className="btn btn-ghost btn-circle">
          <div className="indicator">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button> */}
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="btn m-1">
						<MdiUser className="w-5 h-5" />
					</div>
					<ul
						tabIndex={0}
						className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
					>
						<li>
							<LogoutButton />
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
