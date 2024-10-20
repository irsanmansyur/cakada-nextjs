"use client";
import TbodySkeleton from "@/components/tbody-skeleton";
import { TApi, TApiPaginate, TMeta } from "@/utils";
import { TKecamatan } from "@/utils/type/kecamatan";
import useAxios from "axios-hooks";
import EditKecamatan from "./(components)/edit-model";
import { useEffect, useState } from "react";

export default function TableKecamatan({ kabId }: { kabId: number }) {
	const [{ data, loading }] = useAxios<TApi<TKecamatan[]>>({
		url: process.env.NEXT_PUBLIC_DOMAIN + "/api/kecamatan",
		params: { kabId },
	});
	return (
		<div className="bg-gray-50">
			<div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
				<table className="table">
					<thead>
						<tr>
							<th className="w-4"></th>
							<th>Nama Kec</th>
							<th className="text-center">Target</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{loading || (!data && <TbodySkeleton row={20} col={6} />)}
						<Tbody kecamatans={data?.data} />
					</tbody>
				</table>
			</div>
		</div>
	);
}

function Tbody({ kecamatans: kcs }: { kecamatans?: TKecamatan[] }) {
	const [kecamatans, setKecamatans] = useState(kcs);
	useEffect(() => {
		setKecamatans(kcs);
		return () => {};
	}, [kcs]);
	if (!kecamatans) return "";
	if (kecamatans.length === 0)
		return (
			<tr>
				<td colSpan={99999} className="text-center">
					Data Kosong
				</td>
			</tr>
		);

	return (
		<>
			{kecamatans.map((kecamatan, i) => (
				<tr key={kecamatan.wilId} className="hover">
					<th>{i + 1}</th>
					<td>{kecamatan.kecNama}</td>
					<td className="text-center">
						{(kecamatan.target || 0).toLocaleString()}
					</td>
					<td className="flex justify-center gap-2">
						<EditKecamatan
							kecamatan={kecamatan}
							onSuccess={(kec) => {
								const newKecamatans = [...kecamatans];
								newKecamatans[i] = kec;
								setKecamatans(newKecamatans);
							}}
						/>
					</td>
				</tr>
			))}
		</>
	);
}
