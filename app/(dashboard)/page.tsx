import { MdiBookmarkSuccess } from "@/commons/icons/MdiBookmarkSuccess";
import { MdiCity } from "@/commons/icons/MdiCity";
import { MdiPeopleGroup } from "@/commons/icons/MdiPeopleGroup";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";
import { ChartDtdoorKecamatan } from "./(components)/chart-dtdoor";

const getDataDashboard = async () => {
  const { data } = await axiosInstance().get<
    TApi<{
      totalDpt: number;
      totalKecamatan: number;
      totalDtdoor: number;
      kecamatansDtdoor: { kecamatan: string; dtdoor: number }[];
    }>
  >(`/api/dashboard/cakada/73_7371`);
  return data.data;
};
export default async function Home() {
  const { totalDpt, totalDtdoor, totalKecamatan, kecamatansDtdoor } =
    await getDataDashboard();
  const dtdoorKecamatans = [
    ["Kecamatan", "Jumlah DTDoor"],
    ...kecamatansDtdoor.map((d) => [d.kecamatan, d.dtdoor]),
  ];
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
            <div className="stat-value">{totalDtdoor.toLocaleString()}</div>
            <div className="stat-title">DTDOOR</div>
            {/* <div className="stat-desc text-secondary">10% of 100K</div> */}
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-5 shadow-md bg-white relative">
        <ChartDtdoorKecamatan data={dtdoorKecamatans} />
      </div>
    </div>
  );
}
