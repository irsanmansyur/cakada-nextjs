import Breadcrumbs from "@/components/layouts/breadcrumbs";
import DptClient from "./dpt-client";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";

const getTotalDpt = (kabId: number) => {
  return axiosInstance().get<TApi<number>>(`/api/dpt/2024/total/${kabId}`);
};
export default async function Home() {
  const {
    data: { data: totalDpt },
  } = await getTotalDpt(7371);
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "DPT", url: "/dpt" }]} />
      <div className="my-3">
        <DptClient totalDpt={totalDpt} />
      </div>
    </>
  );
}
