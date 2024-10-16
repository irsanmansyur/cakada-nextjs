"use client";
import Chart from "react-google-charts";

export function ChartDtdoorKecamatan({
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
          title: "Jumlah Kunjungan Kecamatan",
          subtitle: "Jumlah door to door tiap kecamatan",
        },
      }}
    />
  );
}
