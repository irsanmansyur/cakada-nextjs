import { MdiBookmarkSuccess } from "@/commons/icons/MdiBookmarkSuccess";
import { MdiCity } from "@/commons/icons/MdiCity";
import { MdiPeopleGroup } from "@/commons/icons/MdiPeopleGroup";

export default function Home() {
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <MdiPeopleGroup className="h-8 w-8" />
            </div>
            <div className="stat-title">Total DPT</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">21 Kabupaten</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <MdiCity className="h-8 w-8" />
            </div>
            <div className="stat-title">Jumlah Kabupaten</div>
            <div className="stat-value text-secondary">2.6M</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="w-16 rounded-full">
                  <MdiBookmarkSuccess className="w-full h-full" />
                </div>
              </div>
            </div>
            <div className="stat-value">10K</div>
            <div className="stat-title">DTDOOR</div>
            <div className="stat-desc text-secondary">10% of 100K</div>
          </div>
        </div>
      </div>
    </div>
  );
}
