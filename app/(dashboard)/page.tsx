import { MdiBookmarkSuccess } from "@/commons/icons/MdiBookmarkSuccess";
import { MdiCity } from "@/commons/icons/MdiCity";
import { MdiPeopleGroup } from "@/commons/icons/MdiPeopleGroup";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";
import { ChartDtdoorKecamatan } from "./(components)/chart-dtdoor";
import { kabKode } from "@/commons/helpers";
import {
	ChartProgramHarapanKecamatan,
	ChartProgressRelawan,
} from "./(components)/chart-program-harapan";

const getDataDashboard = async () => {
	const proKode = kabKode.toString().substring(0, 2);
	const { data } = await axiosInstance().get<
		TApi<{
			totalDpt: number;
			totalKecamatan: number;
			totalProgramHarapan: number;
			kecamatanProgramHarapan: {
				kecamatan: string;
				dtdoor: number;
				target: number;
			}[];
		}>
	>(`/api/dashboard/cakada/${proKode}_${kabKode}`);
	return data.data;
};

export default async function Home() {
	const {
		totalDpt,
		totalProgramHarapan,
		totalKecamatan,
		kecamatanProgramHarapan,
	} = await getDataDashboard();
	return (
		<div className="space-y-5">
			<div className="flex justify-center">
				<div className="stats shadow">
					<div className="stat">
						<div className="stat-figure text-primary">
							<MdiPeopleGroup className="h-10 w-10" />
						</div>
						<div className="stat-title">Total DPT</div>
						<div className="stat-value text-primary">
							{totalDpt.toLocaleString()}
						</div>
					</div>

					<div className="stat">
						<div className="stat-figure text-secondary">
							<MdiCity className="h-8 w-8" />
						</div>
						<div className="stat-title">Jumlah Kecamatan</div>
						<div className="stat-value text-secondary">
							{totalKecamatan.toLocaleString()}
						</div>
					</div>

					<div className="stat">
						<div className="stat-figure text-secondary">
							<div className="avatar online">
								<div className="w-16 rounded-full">
									<MdiBookmarkSuccess className="w-full h-full" />
								</div>
							</div>
						</div>
						<div className="stat-value">
							{totalProgramHarapan.toLocaleString()}
						</div>
						<div className="stat-title">Program Harapan</div>
						{/* <div className="stat-desc text-secondary">10% of 100K</div> */}
					</div>
				</div>
			</div>
			<div className="border rounded-lg p-5 shadow-md bg-white relative">
				<ChartProgramHarapanKecamatan data={kecamatanProgramHarapan} />
			</div>
			<div className="border rounded-lg p-5 shadow-md bg-white relative">
				<ChartProgressRelawan kabKode={kabKode + ""} />
			</div>
		</div>
	);
}
