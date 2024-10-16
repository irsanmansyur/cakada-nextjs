"use client";
import { kabKode } from "@/commons/helpers";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import useAxios from "axios-hooks";
import Chart from "react-google-charts";
import Loading from "../loading";
import { TProggressInput } from ".";
import { TApi } from "@/utils";

export function ChartProgramHarapanKecamatan({
  data,
}: {
  data: (string | number)[][];
}) {
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="400px"
      data={data}
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

export function ChartProgressRelawan({ kabKode }: { kabKode: string }) {
  const proKode = kabKode.toString().slice(0, 2);

  const [{ data, loading }] = useAxios<TApi<TProggressInput[]>>(
    {
      url: `/api/dashboard/progress-relawan/${proKode}_${kabKode}`,
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
      }}
    />
  );
}
