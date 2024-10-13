import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { TProgramHarapan } from "..";

interface PrgoramHarapanExcelProps {
  dateStart?: string;
  dateEnd?: string;
  status?: string;
  kabName?: string;
  kelName?: string;
  kecName?: string;
}

export const ProgramHarapanExcel: React.FC<PrgoramHarapanExcelProps> = ({
  dateStart,
  dateEnd,
  kelName,
  status,
  kabName,
  kecName,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const getData = async () => {
    setLoading(true);
    const { data: dt } = await axios.get<{ data: TProgramHarapan[] }>(
      "/api/program-harapan?page=1&limit=300000",
      {
        params: {
          statusDtdoor: "active",
          ...(dateEnd && { dateEnd }),
          ...(dateStart && { dateStart }),
          ...(kelName && { kelName }),
          ...(status && { status }),
          ...(kabName && { kabName }),
          ...(kecName && { kecName }),
        },
      },
    );

    const newData: any[] = [
      [
        "No",
        "NIK",
        "Nama Kepala Keluarga",
        "Nama Lengkap",
        "Kabupaten",
        "Kecamatan",
        "Kelurahan/Desa",
        "Tps",
        "RT",
        "RW",
        "Jenis Kelamin",
        "No. Telpon",
        "Jumlah Pemilih",
        "Jumlah Kunjungan",
        "Nama Relawan",
        "Kontak Relawan",
        "Harapan Pemilih",
        "Dukungan Pemilih",
        "Tindakan Sosialisasi",
      ],
    ];

    const tambahan = dt.data.map((programHarapan, i) => {
      return [
        i + 1,
        programHarapan.nik,
        programHarapan.kepalaKeluarga,
        programHarapan.namaLengkap,
        programHarapan.kabName,
        programHarapan.kecName,
        programHarapan.kelName,
        programHarapan.tps,
        programHarapan.rt,
        programHarapan.rw,
        programHarapan.jenisKelamin,
        programHarapan.noTelpon,
        programHarapan.jumlahWajibPilih,
        programHarapan.jumlahKunjungan,
        programHarapan.namaRelawan,
        programHarapan.kontakRelawan,
        programHarapan.harapan,
        programHarapan.mendukung,
        programHarapan.mensosialisasikan,
      ];
    });

    newData.push(...tambahan);
    setLoading(false);
    return newData;
  };

  const handleDownloadExcel = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await getData();
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!rows"] = [{ hpt: 26, hpx: 26 }];
    ws["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 20 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 22 },
      { wch: 10 },
      { wch: 6 },
      { wch: 6 },
      { wch: 16 },
      { wch: 16 },
      { wch: 22 },
      { wch: 22 },
      { wch: 10 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
    ];

    // Center-align vertically for rows
    const centerAlignStyle = {
      alignment: { vertical: "center" },
    };

    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
      ws[`A${rowIndex + 1}`] = {
        ...centerAlignStyle,
        ...ws[`A${rowIndex + 1}`],
      };
    }

    // Border style for cells
    const borderStyle = {
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Header style
    const headerStyle = {
      bold: true,
      size: 13,
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 }, // Bold, white text, size 14
      fill: { fgColor: { rgb: "000000" } }, // Black background
      ...borderStyle, // Border style
    };

    // Ensure NIK column is string type
    data.forEach((row, rowIndex) => {
      if (rowIndex > 0 && typeof row[1] === "number") {
        row[1] = String(row[1]);
      }
    });

    // Apply header style to worksheet
    ws["A1"] = { ...headerStyle, ...ws["A1"] };
    ws["B1"] = { ...headerStyle, ...ws["B1"] };
    ws["C1"] = { ...headerStyle, ...ws["C1"] };
    ws["D1"] = { ...headerStyle, ...ws["D1"] };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataSheet");
    XLSX.writeFile(wb, "programHarapan.xlsx", { compression: true });
  };

  return (
    <form onSubmit={handleDownloadExcel}>
      <button
        disabled={loading}
        className="py-2 px-4 rounded-md bg-green-600 text-white whitespace-nowrap font-semibold"
        onClick={handleDownloadExcel}
      >
        Export Excel
      </button>
    </form>
  );
};
