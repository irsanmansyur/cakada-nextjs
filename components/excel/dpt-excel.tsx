import { TApi } from "@/utils";
import { TDpt } from "@/utils/type/dpt";
import useAxios from "axios-hooks";
import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MdiLoading } from "../icons/MdiLoading";
import { MdiMicrosoftExcel } from "../icons/MdiMicrosoftExcel";
import { MdiFilePdfBox } from "../icons/MdiFilePdfBox";

export const ExportXl2024Comp = ({
  kecamatan,
  kabupaten,
  kelurahan,
  tps,
  kabId,
}: {
  kecamatan: any;
  kabupaten: any;
  kelurahan: any;
  tps: any;
  kabId: number;
}) => {
  const [type, setType] = useState<string | null>(null);
  const [{ data, loading }, getData] = useAxios<TApi<TDpt[]>>(
    {
      url: `/api/dpt/2024/` + kabId,
      params: {
        limit: 2000000,
        ...(kecamatan ? { kecId: kecamatan.wilId } : {}),
        ...(kelurahan ? { kelId: kelurahan.wilId } : {}),
        ...(tps ? { tps: tps.value } : {}),
      },
    },
    { manual: true }
  );
  const submit = async (e: any) => {
    e.preventDefault();
    const dataExcel = [
      [
        "No",
        "Nama Lengkap",
        "Nik",
        "Jenis Kelamin",
        "Provinsi",
        "Kabupaten",
        "Kecamatan",
        "Kelurahan",
        "Tps",
        "alamat",
        "RT",
        "RW",
      ],
    ];
    const resp = await getData();
    const oldData = resp.data["data"];
    dataExcel.push(
      ...oldData.map((dpt, i) => {
        return [
          i + 1,
          dpt.nama,
          dpt.nik,
          dpt.jenisKelamin,
          kabupaten.proNama,
          kabupaten.kabNama,
          dpt.namaKec,
          dpt.namaKel,
          dpt.namaTps,
          dpt.alamat,
          dpt.rt,
          dpt.rw,
        ];
      })
    );

    if (type === "pdf") return generatePDF(dataExcel);

    const ws = XLSX.utils.aoa_to_sheet(dataExcel);
    ws["!rows"] = [{ hpt: 26, hpx: 26 }];
    ws["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 22 },
      { wch: 18 },
      { wch: 24 },
      { wch: 22 },
      { wch: 20 },
      { wch: 20 },
      { wch: 6 },
    ];

    // Mengatur kolom NIK sebagai string
    dataExcel.forEach((row, rowIndex) => {
      if (rowIndex > 0 && typeof row[1] === "number") {
        row[1] = String(row[1]); // Mengubah nilai kolom NIK menjadi string
      }
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `DPT`);

    // Create a new Date object
    const today = new Date();

    // Get the year, month, and day from the date object
    const year = today.getFullYear(); // YYYY
    const month = String(today.getMonth() + 1).padStart(2, "0"); // MM (month is zero-based)
    const day = String(today.getDate()).padStart(2, "0"); // DD

    XLSX.writeFile(
      wb,
      `dpt-${kabupaten.nama}-${kelurahan["kelNama"]}-${year}-${month}-${day}.xlsx`,
      { compression: true }
    );
  };
  return (
    <>
      <form onSubmit={submit} className="flex gap-2 items-center">
        <button
          type="submit"
          onClick={() => setType("xlsx")}
          disabled={loading && type == "xlsx"}
          className="flex items-center gap-2 text-primary-blue bg-transparent border border-solid border-primary-blue hover:bg-primary-blue hover:text-white active:bg-primary-blue font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 relative overflow-hidden"
        >
          {loading && type == "xlsx" && (
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-95 bg-black/30 z-10">
              <MdiLoading className="w-6 h-6 animate-spin text-white" />
            </div>
          )}
          <MdiMicrosoftExcel className="w-6 h-6" />
          Export XL
        </button>
        <button
          type="submit"
          value={"pdf"}
          onClick={() => setType("pdf")}
          disabled={loading && type == "pdf"}
          className="flex items-center gap-2 text-primary bg-transparent border border-solid border-primary hover:bg-primary hover:text-white active:bg-primary font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 relative overflow-hidden"
        >
          {loading && type == "pdf" && (
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-95 bg-black/30 z-10">
              <MdiLoading className="w-6 h-6 animate-spin text-white" />
            </div>
          )}
          <MdiFilePdfBox className="w-6 h-6" />
          PDF
        </button>
      </form>
    </>
  );
};
function generatePDF(dataExport: any[] = []) {
  // Membuat instance jsPDF
  const doc = new jsPDF({
    unit: "mm",
    marginLeft: 10, // Margin kiri (dalam unit yang telah diatur)
    marginRight: 10, // Margin kanan (dalam unit yang telah diatur)
    marginTop: 20, // Margin atas (dalam unit yang telah diatur)
    marginBottom: 20, // Margin bawah (dalam unit yang telah diatur)
  });

  autoTable(doc, {
    theme: "grid",
    head: [dataExport[0]], // Bagian kepala tabel (judul kolom)
    body: dataExport.slice(1), // Bagian badan tabel (data)
  });

  doc.save("tabel.pdf");
}
