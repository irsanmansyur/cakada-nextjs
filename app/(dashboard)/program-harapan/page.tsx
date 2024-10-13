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
import { TUser } from "@/utils/type/user";
import ProgramRelawanClient from "./pageClient";

const getFilters = async () => {
  const {
    data: { data },
  } = await axiosInstance().get<
    TApi<{
      kabupatens: TKabupaten[];
      kecamatans: TKecamatan[];
      kelurahans: TKelurahan[];
      relawans: TUser[];
    }>
  >(`/api/program-harapan/filter`);
  return data;
};
export default async function Home() {
  const filters = await getFilters();
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[{ name: "Program Harapan", url: "/program-harapan" }]}
      />
      <div className="my-3">
        <ProgramRelawanClient filters={filters} />
      </div>
    </>
  );
}
