"use client";
import Chart from "react-google-charts";
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomData(days: number) {
  const data: [string, string | number, string | number][] = [
    ["Tanggal", "Total Produk", "Jumlah Penjualan"],
  ];
  const startDate = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

    const totalProduk = getRandomInt(500, 1500); // Total produk antara 500 dan 1500
    const jumlahPenjualan = getRandomInt(200, totalProduk); // Jumlah penjualan antara 200 dan total produk

    data.push([formattedDate, totalProduk, jumlahPenjualan]);
  }

  return data;
}

export const ChartProduct = () => {
  const data = generateRandomData(30);

  const options = {
    title: "Penjualan Sebulan Terakhir",
    hAxis: { title: "Tanggal", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 },
    chartArea: { width: "100%", height: "70%" },
  };
  return (
    <div className="rounded border px-3 py-5 bg-white">
      <Chart
        chartType="AreaChart"
        // width="100%"
        height="400px"
        data={data}
        options={{
          title: "Penjualan Sebulan Terakhir",
          is3D: true,
          chartArea: { width: `100%`, height: "60%" },
          legend: { position: "bottom" },
        }}
      />
    </div>
  );
};
