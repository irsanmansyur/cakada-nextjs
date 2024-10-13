import Breadcrumbs from "@/components/layouts/breadcrumbs";
import DptClient from "./dpt-client";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";
import { kabKode } from "@/commons/helpers";

const getTotalDpt = (kabId: number) => {
  return axiosInstance().get<TApi<number>>(`/api/dpt/total/${kabId}`);
};
export default async function Home() {
  const {
    data: { data: totalDpt },
  } = await getTotalDpt(kabKode);
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "DPT", url: "/dpt" }]} />
      <div className="my-3">
        <DptClient totalDpt={totalDpt} />
      </div>
    </>
  );
}
