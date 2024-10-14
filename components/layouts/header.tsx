import React from "react";
import TimeNow from "../time-now";
import Image from "next/image";
import LogoutForm from "./logout-btn";
import MenuButtonSidebar from "./menu-button";

export default function Header({ title }: { title: string }) {
	return (
		<header className="flex justify-between items-center border-b border-slate-300 -mt-4 -mx-4 p-2 sm:p-4 bg-white">
			<div className="space-y-1">
				<h1 className="text-lg sm:text-3xl font-semibold text-theme">
					{title}
				</h1>
			</div>
			<div className="flex gap-2 items-center justify-center">
				<div className=" flex-col items-end space-y-[-2px] hidden sm:flex">
					<span className="font-bold">Irsan Mansyur</span>
					<TimeNow />
				</div>
				<div className="dropdown dropdown-bottom dropdown-end">
					<div
						tabIndex={0}
						role="button"
						className="cursor-pointer items-center flex justify-center"
					>
						<div className="avatar">
							<div className="w-[35px] sm:w-[50px] rounded-full">
								<Image
									alt="avatar thumbnail"
									width={35}
									height={35}
									src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
								/>
							</div>
						</div>
					</div>
					<ul
						tabIndex={0}
						className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
					>
						<li>
							<LogoutForm />
						</li>
					</ul>
				</div>
				<MenuButtonSidebar />
			</div>
		</header>
	);
}
