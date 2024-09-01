"use client";
import Chart from "react-google-charts";

const options = {
  chart: {
    title: "Jumlah Door To Door Kecamatan",
    subtitle: "Jumlah door to door tiap kecamatan",
  },
};

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
      options={options}
    />
  );
}
