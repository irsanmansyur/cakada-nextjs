"use client";
import Chart from "react-google-charts";

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
