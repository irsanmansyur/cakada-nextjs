"use client";
import { kabKode } from "@/commons/helpers";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import useAxios from "axios-hooks";
import Chart from "react-google-charts";
import { TProggressInput } from ".";
import { TApi } from "@/utils";
import { useState } from "react";
import Swal from "sweetalert2";

export function ChartProgramHarapanKecamatan({
	data,
}: {
	data: { kecamatan: string; dtdoor: number; target: number }[];
}) {
	const [jenis, setJenis] = useState("jumlah");
	const totalTarget = data.reduce((total, item) => total + item.target, 0);
	const totalJumlah = data.reduce((total, item) => total + item.dtdoor, 0);
	const totalPersentase = ((totalJumlah / totalTarget) * 100)
		.toFixed(2)
		.replace(".00", "");

	return (
		<>
			<div className="flex items-center gap-4 mb-5">
				<button
					className="btn bg-[#427ef5] text-white"
					onClick={() => setJenis("jumlah")}
				>
					Jumlah Inputan
					<div className="badge">{totalJumlah}</div>
				</button>
				<button className="btn" onClick={() => setJenis("persentase")}>
					Persantase Umum
					<div className="badge bg-[#f54842] text-white">
						{totalPersentase + "%"}
					</div>
				</button>
			</div>
			{jenis == "jumlah" ? (
				<KecJumlahKunjunganChart data={data} />
			) : (
				<PersentaseKecamatans data={data} />
			)}
		</>
	);
}

function KecJumlahKunjunganChart({
	data,
}: {
	data: { kecamatan: string; dtdoor: number }[];
}) {
	const dataChart = [
		["Kecamatan", "Jumlah Kunjungan"],
		...data.map((item) => [item.kecamatan, item.dtdoor]),
	];
	return (
		<Chart
			chartType="Bar"
			width="100%"
			height="400px"
			data={dataChart}
			options={{
				legend: { position: "none" },
				chart: {
					title: "Jumlah Program harapan Kecamatan",
					subtitle: "Jumlah Kunjungan Program Harapan tiap kecamatan",
				},
			}}
		/>
	);
}
function PersentaseKecamatans({
	data,
}: {
	data: { kecamatan: string; dtdoor: number; target: number }[];
}) {
	const persentaseData = [
		[
			"Kecamatan",
			"Persentase (%)",
			{ role: "tooltip", type: "string", p: { html: true } },
		],
		...data.map((item) => {
			const persentase = ((item.dtdoor / item.target) * 100).toFixed(2);

			// Membuat tooltip yang berisi informasi target dan dtdoor
			const tooltip = `Kecamatan: ${item.kecamatan}\nTarget: ${item.target}\nJumlah: ${item.dtdoor}`;
			return [item.kecamatan, Number(persentase), tooltip];
		}),
	];

	return (
		<Chart
			chartType="Bar"
			width="100%"
			height="400px"
			data={persentaseData}
			options={{
				legend: "none",
				chart: {
					title: "Persentase Program harapan Kecamatan",
				},
				hAxis: {
					title: "Persentase (%)",
					minValue: 0,
					maxValue: 100,
				},
				vAxis: {
					title: "Kecamatan",
				},
				colors: ["#f44336"],
			}}
			chartEvents={[
				{
					eventName: "select",
					callback: ({ chartWrapper }) => {
						const chart = chartWrapper.getChart();
						const selection = chart.getSelection();
						const item = selection[0];
						if (item) {
							const kecamatan = data[item.row].kecamatan;
							const target = data[item.row].target;
							const dtdoor = data[item.row].dtdoor;
							Swal.fire({
								title: "Detail Persentase Kecamatan",
								html: `
								<table style="width:100%">
									<tbody>
										<tr>
											<th style="text-align:left">Kecamatan</th>
											<th style="padding:0 10px">:</th>
											<th style="text-align:left">${kecamatan}</th>
										</tr>
										<tr>
											<th style="text-align:left">Target</th>
											<th style="padding:0 10px">:</th>
											<th style="text-align:left">${target}</th>
										</tr>
										<tr>
											<th style="text-align:left">Jumlah</th>
											<th style="padding:0 10px">:</th>
											<th style="text-align:left">${dtdoor}</th>
										</tr>
									</tbody>
								</table>
								`,
							});
						}
					},
				},
			]}
		/>
	);
}
export function ChartProgressRelawan({ kabKode }: { kabKode: string }) {
	const proKode = kabKode.toString().slice(0, 2);

	const [{ data, loading }] = useAxios<TApi<TProggressInput[]>>(
		{
			url:
				process.env.NEXT_PUBLIC_DOMAIN +
				`/api/dashboard/progress-relawan/${proKode}_${kabKode}`,
			params: { kabKode },
		},
		{},
	);
	if (loading || !data?.data)
		return (
			<div className="flex w-full flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
					<div className="flex flex-col gap-4">
						<div className="skeleton h-4 w-20"></div>
						<div className="skeleton h-4 w-28"></div>
					</div>
				</div>
				<div className="skeleton h-32 w-full"></div>
			</div>
		);

	const dataChart = [
		["Nama Relawan", "Jumlah"],
		...data.data.map((p) => {
			return [p.user.name, p.total];
		}),
	];

	return (
		<Chart
			chartType="Bar"
			width="100%"
			height="400px"
			data={dataChart}
			options={{
				legend: { position: "none" },
				chart: {
					title: "Progress Input User",
					subtitle: "Jumlah inputan user ",
				},
				colors: ["#f44336"],
			}}
		/>
	);
}
