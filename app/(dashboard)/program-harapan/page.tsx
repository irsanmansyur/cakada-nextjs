import Breadcrumbs from "@/components/layouts/breadcrumbs";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";
import { TKabupaten } from "@/utils/type/kabupaten";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
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
