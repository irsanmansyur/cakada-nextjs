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
import { MdiLocationCheckOutline } from "../icons/MdiLocationCheckOutline";
import { MdiAccountCircle } from "../icons/MdiAccountCircle";
import { HugeiconsMapsSearch } from "../icons/ArcticonsMaps";

type TLink = { name: string; href: string; icon: React.ReactNode };
type TGroup = {
	title: string;
	links: TLink[];
};

type SidebarProps = {
	accessToken: string;
	kabKode: number;
};

export default function Sidebar({ accessToken, kabKode }: SidebarProps) {
	const { showSidebar, setShowSidebar, setUser, user, setKabKode } =
		useStoreDashboard();

	const links: (TLink | TGroup)[] = [
		{ name: "Home", href: "/", icon: <MdiViewDashboard className="h-6 w-6" /> },
		{ name: "DPT", href: "/dpt", icon: <MdiPeopleGroup className="h-6 w-6" /> },
		{
			name: "Program Harapan",
			href: "/program-harapan",
			icon: <MdiDoorSliding className="h-6 w-6" />,
		},
		{
			name: "Profile",
			icon: <MdiAccountCircle className="h-6 w-6" />,
			href: "/setting/profile",
		},
	];
	if (["admin", "superadmin"].includes(user?.role?.name)) {
		links.push({
			title: "Pengguna",
			links: [
				{
					name: "Relawan Kabupaten",
					href: "/pengguna/kabupaten",
					icon: <></>,
				},
				{
					name: "Relawan Kecamatan",
					href: "/pengguna/kecamatan",
					icon: <></>,
				},
				{
					name: "Relawan Kelurahan",
					href: "/pengguna/kelurahan",
					icon: <></>,
				},
				{
					name: "Tambah Relawan",
					href: "/pengguna/tambah",
					icon: <></>,
				},
			],
		});
		links.push({
			title: "Setting",
			links: [
				{
					name: "Kecamatan",
					icon: <HugeiconsMapsSearch className="h-6 w-6" />,
					href: "/setting/kecamatan",
				},
				{
					name: "Lokasi Input",
					icon: <MdiLocationCheckOutline className="h-6 w-6" />,
					href: "/setting/lokasi",
				},
			],
		});
	}

	axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	configure({ axios });
	const pathname = usePathname();
	useEffect(() => {
		const user = getPayload(accessToken);
		setKabKode(kabKode);
		setUser(user);
		return () => {};
	}, [accessToken, setUser, kabKode, setKabKode]);

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
				{links.map((link, i) => {
					if ("title" in link && "links" in link) {
						return (
							<li key={"title" + i}>
								<h3 className="mb-4 text-sm font-medium text-gray-500 pt-8">
									{link.title}
								</h3>
								<ul className="space-y-2">
									{link.links.map((link, i) => {
										return (
											<li
												key={`link-${i}`}
												className={`group p-2 rounded shadow-lg ${
													link.href == pathname ? "bg-primary" : "bg-white/10"
												}`}
											>
												<Link
													href={link.href}
													className="flex gap-2 justify-between"
													onClick={() => {
														setShowSidebar(false);
													}}
												>
													<div className="flex gap-2">
														{link.icon}
														<span className="truncate whitespace-nowrap">
															{link.name}
														</span>
													</div>
													<MdiLinkVariant className="h-6 w-6 transition-all opacity-0 group-hover:opacity-100" />
												</Link>
											</li>
										);
									})}
								</ul>
							</li>
						);
					}
					return (
						<li
							key={i}
							className={`group p-2 rounded shadow-lg ${
								link.href == pathname ? "bg-primary" : "bg-white/10"
							}`}
						>
							<Link
								href={link.href}
								className="flex gap-2 justify-between"
								onClick={() => {
									setShowSidebar(false);
								}}
							>
								<div className="flex gap-2">
									{link.icon}
									<span className="truncate whitespace-nowrap">
										{link.name}
									</span>
								</div>
								<MdiLinkVariant className="h-6 w-6 transition-all opacity-0 group-hover:opacity-100" />
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
