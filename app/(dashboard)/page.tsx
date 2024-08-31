import { MdiBookmarkSuccess } from "@/commons/icons/MdiBookmarkSuccess";
import { MdiCity } from "@/commons/icons/MdiCity";
import { MdiPeopleGroup } from "@/commons/icons/MdiPeopleGroup";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";

const getDataDashboard = async () => {
  const { data } = await axiosInstance().get<
    TApi<{ totalDpt: number; totalKecamatan: number; totalDtdoor: number }>
  >(`/api/dashboard/cakada/73_7371`);
  return data.data;
};
export default async function Home() {
  const { totalDpt, totalDtdoor, totalKecamatan } = await getDataDashboard();
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <MdiPeopleGroup className="h-8 w-8" />
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
            <div className="stat-value text-secondary">{totalKecamatan}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="w-16 rounded-full">
                  <MdiBookmarkSuccess className="w-full h-full" />
                </div>
              </div>
            </div>
            <div className="stat-value">{totalDtdoor}</div>
            <div className="stat-title">DTDOOR</div>
            {/* <div className="stat-desc text-secondary">10% of 100K</div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
