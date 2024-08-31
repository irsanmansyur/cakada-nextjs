import Breadcrumbs from "@/components/layouts/breadcrumbs";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";
import { TTipePemilih } from "@/utils/type/dpt";
import {
  TKabupaten,
  TPilihanPileg,
  TProgramBantuan,
} from "@/utils/type/kabupaten";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
import DtdoorClient from "./pageClient";

const getFilters = async () => {
  const {
    data: { data },
  } = await axiosInstance().get<
    TApi<{
      kabupatens: TKabupaten[];
      kecamatans: TKecamatan[];
      kelurahans: TKelurahan[];
      pilihanPileg: TPilihanPileg[];
      programBantuans: TProgramBantuan[];
      tipePemilihs: TTipePemilih[];
    }>
  >(`/api/dtdoor/filter`);
  return data;
};
export default async function Home() {
  const filters = await getFilters();
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "Program DTDOOR", url: "/dtdoor" }]} />
      <div className="my-3">
        <DtdoorClient filters={filters} />
      </div>
    </>
  );
}
