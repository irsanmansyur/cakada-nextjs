"use client";
import FormGroup, { SelectFormGroup } from "@/components/form/form-group";
import SearchInput from "@/components/form/search-input";
import { TTipePemilih } from "@/utils/type/dpt";
import {
  TKabupaten,
  TPilihanPileg,
  TProgramBantuan,
} from "@/utils/type/kabupaten";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
import useAxios from "axios-hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DtDoorExcel } from "./(components)/excel-dtdoor";
import TbodySkeleton from "@/components/tbody-skeleton";
import { TApiPaginate } from "@/utils";
import { TDtdoor } from "@/utils/type/dtdoor";
import Swal from "sweetalert2";
import { MdiDeleteEmpty } from "@/components/icons/MdiDeleteEmpty";
import { MdiCheckOutline } from "@/components/icons/MdiCheckOutline";
import axios from "axios";
import PaginationClient from "@/components/Pagination-client";
import { DtdoorHasilRekap } from "./(components)/dtdoor-hasilrekap";
import { MdiPickaxe } from "@/components/icons/MdiPickaxe";
import Image from "next/image";

type Props = {
  filters: {
    kabupatens: TKabupaten[];
    kecamatans: TKecamatan[];
    kelurahans: TKelurahan[];
    pilihanPileg: TPilihanPileg[];
    programBantuans: TProgramBantuan[];
    tipePemilihs: TTipePemilih[];
  };
};
export default function DtdoorClient({ filters }: Props) {
  const [query, setQuery] = useState<Record<string, any>>({});
  const [limit, setLimit] = useState(100);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageSelected, setImageSelected] = useState<string | undefined>(
    undefined
  );

  const [{ data: dataDtdoor, loading: loadingDtdoor }] = useAxios<
    TApiPaginate<TDtdoor>
  >(
    {
      url: `/api/dtdoor`,
      params: {
        page,
        limit,
        ...(search && { search }),
        ...(startDate && { dateStart: startDate }),
        ...(endDate && { dateEnd: endDate }),
        ...(query?.kabupaten && { kabId: query.kabupaten }),
        ...(query?.kecamatan && { kecamatan: query.kecamatan }),
        ...(query?.kelurahan && { kelurahan: query.kelurahan }),
        ...(query?.tipePemilihId && { tipePemilihId: query.tipePemilihId }),
        ...(query?.programBantuanId && {
          programBantuanId: query.pilihanPilegId,
        }),
        ...(query?.pilihanPilegId && { pilihanPilegId: query.pilihanPilegId }),
      },
    },
    {
      autoCancel: true,
      ssr: false,
    }
  );
  const FilterData = (
    <>
      <section className="p-4 shadow-sm bg-slate-50 rounded-md border mb-3">
        <h2 className="font-semibold mb-3 text-xl">Filter</h2>
        <div className="flex flex-wrap -mx-2">
          <SelectFormGroup
            id="kabupaten-id"
            classNameParent="w-1/2 sm:w-1/3 p-2"
            label={"Kabupaten"}
            name="kabupaten"
            options={[
              { value: "", label: "-- Kabupaten --" },
              ...filters.kabupatens.map((item) => ({
                ...item,
                value: item.kabId,
                label: item.kabupaten,
              })),
            ]}
            onChange={(e) => {
              setQuery({ ...query, kabupaten: e.target.value });
            }}
          />
          <SelectFormGroup
            classNameParent="w-1/2 sm:w-1/3 p-2"
            label={"Kecamatan"}
            id="kecamatan-id"
            name="Kecamatan"
            options={[
              { value: "", label: "--- Kecamatan ---" },
              ...filters.kecamatans.map((item) => ({
                ...item,
                value: item.kecamatan,
                label: item.kecamatan,
              })),
            ]}
            onChange={(e) => {
              setQuery({ ...query, kecamatan: e.target.value });
            }}
          />

          <SelectFormGroup
            classNameParent="w-1/2 sm:w-1/3 p-2"
            label={"Kelurahan/Desa"}
            id="kelurahan-id"
            name="Kelurahan"
            options={[
              { value: "", label: "--- Kelurahan/Desa ---" },
              ...filters.kelurahans.map((item) => ({
                ...item,
                value: item.desa,
                label: item.desa,
              })),
            ]}
            onChange={(e) => {
              setQuery({ ...query, kelurahan: e.target.value });
            }}
          />
          <SelectFormGroup
            classNameParent="w-1/2 sm:w-1/3 p-2"
            label={"Pilihan Pileg"}
            id="pilihanPileg-id"
            name="PilihanPileg"
            options={[
              { value: "", label: "--- Pilihan Pileg ---" },
              ...filters.pilihanPileg.map((item) => ({
                ...item,
                value: item.id,
                label: item.nameKategori,
              })),
            ]}
            onChange={(e) => {
              setQuery({ ...query, pilihanPilegId: e.target.value });
            }}
          />
          <SelectFormGroup
            id="tipePemilih-id"
            classNameParent="w-1/2 sm:w-1/3 p-2"
            label={"Tipe Pemilih"}
            options={[
              { value: "", label: "--- Tipe Pemilih ---" },
              ...filters.tipePemilihs.map((item) => ({
                ...item,
                value: item.id,
                label: item?.nama || "",
              })),
            ]}
            onChange={(e) => {
              setQuery({ ...query, tipePemilihId: e.target.value });
            }}
          />
          <SelectFormGroup
            classNameParent="w-1/2 sm:w-1/3 p-2"
            label={"Programs Bantuan"}
            id="programBantuan-id"
            options={[
              { value: "", label: "--- Programs Bantuan ---" },
              ...filters.programBantuans.map((item) => ({
                ...item,
                value: item.id,
                label: item?.nama || "",
              })),
            ]}
            onChange={(e) => {
              setQuery({ ...query, programBantuanId: e.target.value });
            }}
          />
        </div>
      </section>
      <div className="flex justify-between items-end py-3 flex-col sm:flex-row">
        <div className="flex gap-2 w-full items-end flex-col sm:flex-row">
          <div className="flex gap-2 w-full md:w-auto">
            <FormGroup
              type="date"
              id="dateStart"
              label="Mulai Dari"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              classNameParent="w-1/2 md:w-[200px]"
            />
            <FormGroup
              id="dateEnd"
              type="date"
              label="Sampai"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              classNameParent="w-1/2 md:w-[200px]"
            />
          </div>
          <div className="flex pb-1">
            <DtDoorExcel
              kabupaten={query.kabupaten}
              kelurahan={query.kelurahan}
              kecamatan={query.kecamatan}
              status={query.status}
              kategori={query.kategori}
              dateStart={startDate}
              dateEnd={endDate}
            />
          </div>
        </div>
        <div className="flex w-full md:w-auto justify-end py-1">
          <select
            className=" h-full rounded-l border block appearance-none bg-white border-gray-400 text-gray-700 py-[9px] px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 -mr-1 z-10"
            defaultValue={limit}
            onChange={(e) => {
              setLimit(+e.target.value);
              setPage(1);
            }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={300}>300</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
          </select>
          <div className="w-[200px] relative">
            <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current text-gray-500"
              >
                <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
              </svg>
            </span>
            <SearchInput
              onChange={(value) => {
                if (value.length > 1 && value.length < 3) return;
                setPage(1);
                setSearch(value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {FilterData}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg pb-2 min-w-full">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs uppercase bg-gray-600  text-white">
              <tr>
                <th
                  rowSpan={2}
                  scope="col"
                  className="py-3 px-6 border-r border-gray-500"
                >
                  Nama
                </th>
                <th
                  rowSpan={2}
                  scope="col"
                  className="py-3 px-6 border-r border-gray-500"
                >
                  Wilayah
                </th>
                <th
                  rowSpan={2}
                  scope="col"
                  className="py-3 px-6 border-r border-gray-500"
                >
                  RT/RW
                </th>
                <th
                  rowSpan={2}
                  scope="col"
                  className="py-3 px-2 border-r border-gray-500"
                >
                  Jenis Kelamin
                </th>
                <th
                  rowSpan={2}
                  scope="col"
                  className="py-3 px-2 border-r border-gray-500"
                >
                  No Telpon
                </th>
                <th
                  rowSpan={2}
                  scope="col"
                  className="py-3 px-2 border-r border-gray-500"
                >
                  Jumlah Pemilih
                </th>
                <th
                  colSpan={5}
                  scope="col"
                  className="py-3 px-6  text-center font-extrabold border-b border-gray-500"
                >
                  Kunjungan
                </th>
                <th
                  rowSpan={2}
                  scope="col"
                  className="py-3 px-6 border-l border-gray-500"
                >
                  Action
                </th>
              </tr>
              <tr>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Relawan
                </th>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Tipe Pemilih
                </th>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Pilihan
                </th>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Merchendise
                </th>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Program Bantuan
                </th>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Gambar
                </th>
              </tr>
            </thead>
            <tbody>
              <DataTable
                loadingDtdoor={loadingDtdoor}
                dataDtdoor={dataDtdoor?.data || []}
                setImageSelected={setImageSelected}
              />
            </tbody>
          </table>
        </div>
      </div>
      <ModalImage image={imageSelected} setImageSelected={setImageSelected} />
      <PaginationClient
        currentPage={page}
        totalPages={dataDtdoor?.["meta"]["totalPages"] || 0}
        onChangePage={(pg) => {
          setPage(pg);
        }}
      />
      <DtdoorHasilRekap
        kabId={query?.kabupaten}
        kecamatan={query?.kecamatan}
        kelurahan={query?.kelurahan}
        tipePemilihId={query?.tipePemilihId}
        programBantuanId={query?.programBantuanId}
        pilihanPilegId={query?.pilihanPilegId}
        dateStart={startDate}
        dateEnd={endDate}
      />
    </>
  );
}

type PropsDtdoor = {
  loadingDtdoor: boolean;
  dataDtdoor?: TDtdoor[];
  setImageSelected: Dispatch<SetStateAction<string | undefined>>;
};
function DataTable({
  loadingDtdoor,
  dataDtdoor,
  setImageSelected,
}: PropsDtdoor) {
  if (loadingDtdoor || !dataDtdoor) return <TbodySkeleton col={13} row={3} />;
  if (dataDtdoor.length == 0)
    return (
      <tr>
        <td
          colSpan={13}
          className="py-2 px-2 text-center bg-white font-bold text-2xl text-black p-10"
        >
          Tidak ada data
        </td>
      </tr>
    );
  return dataDtdoor.map((dtdoor, i) => {
    const { kunjungans } = dtdoor;
    return kunjungans.map((kunjungan, j) => {
      const image = kunjungan?.image
        ? process.env.NEXT_PUBLIC_DOMAIN + "/api/dtdoor/image/" + kunjungan.id
        : null;
      if (j == 0)
        return (
          <tr className="bg-slate-200" key={`${i}-${j}`}>
            <td
              rowSpan={kunjungans.length}
              className="border-b py-2 px-6 align-top border-r border-gray-100"
            >
              <div className="flex flex-col gap-1 whitespace-nowrap relative">
                <div className="absolute top-1 right-0 -mx-3">
                  {dtdoor.statusDtdoor !== "active" ? (
                    <PilihSebagaiActive dtdoor={dtdoor} />
                  ) : (
                    <MdiCheckOutline className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <span>Nama : {dtdoor.namaLengkap}</span>
                <b className="whitespace-nowrap">
                  Kepala Keluarga: {dtdoor.kepalaKeluarga}
                </b>
                <span>No. Telp : {dtdoor.noTelpon}</span>
              </div>
            </td>
            <td
              rowSpan={kunjungans.length}
              className="border-b py-2 px-6 align-top border-r border-gray-100"
            >
              <div className="flex flex-col space-y-1 whitespace-nowrap">
                <span>Kabupaten : {dtdoor.kabupaten}</span>
                <span>Kecamatan : {dtdoor.kecamatan}</span>
                <span>Desa/Lurah : {dtdoor.desa}</span>
              </div>
            </td>
            <td
              rowSpan={kunjungans.length}
              className="border-b py-2 px-2 align-top text-left whitespace-nowrap border-r border-gray-100"
            >
              <div className="flex space-y-1 flex-col">
                <span>RT/RW : {`${dtdoor.rt}/${dtdoor.rw}`}</span>
                <span>TPS : {`${dtdoor.tps}`}</span>
              </div>
            </td>
            <td
              rowSpan={kunjungans.length}
              className="border-b py-2 px-2 align-top text-center border-r border-gray-100"
            >
              {dtdoor.jenisKelamin}
            </td>
            <td
              rowSpan={kunjungans.length}
              className="border-b py-2 px-2 align-top text-center border-r border-gray-100"
            >
              {dtdoor.noTelpon}
            </td>
            <td
              rowSpan={kunjungans.length}
              className="border-b py-2 px-2 align-top text-center border-r border-gray-100"
            >
              {dtdoor.jumlahWajibPilih}
            </td>
            <td className="py-2 px-2 align-top text-left border-r border-gray-100 border-b">
              Nama : {kunjungan.namaRelawan}
              <br />
              No. Telp : {kunjungan.noTelponRelawan}
            </td>
            <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
              {kunjungan.tipePemilih?.nama || ""}
            </td>
            <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
              {kunjungan.pilihanPileg.nameKategori}
            </td>
            <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
              {kunjungan.merchendise}
            </td>
            <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
              {kunjungan.programBantuan?.nama || ""}
            </td>
            <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
              {image && (
                <Image
                  src={image}
                  alt="image"
                  width={100}
                  height={100}
                  onClick={() => setImageSelected(image)}
                />
              )}
            </td>
            <td className="border-b py-2 px-2 text-center border-gray-100 ">
              <DeleteKunjungan idKunjungan={kunjungan.id} />
            </td>
          </tr>
        );
      return (
        <tr className="bg-slate-200" key={`${i}-${j}`}>
          <td className="py-2 px-2 align-top text-left whitespace-nowrap border-r border-gray-100 border-b">
            Nama : {kunjungan.namaRelawan}
            <br />
            No. Telp : {kunjungan.kontakRelawan}
          </td>
          <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
            {kunjungan.tipePemilih?.nama || ""}
          </td>
          <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
            {kunjungan.pilihanPileg.nameKategori}
          </td>
          <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
            {kunjungan.merchendise}
          </td>
          <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
            {kunjungan.programBantuan?.nama || ""}
          </td>
          <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
            {image && (
              <Image
                src={image}
                alt="image"
                width={100}
                height={100}
                onClick={() => setImageSelected(image)}
              />
            )}
          </td>
          <td className="border-b py-2 px-2 text-center border-gray-100 ">
            <DeleteKunjungan idKunjungan={kunjungan.id} />
          </td>
        </tr>
      );
    });
  });
}

function DeleteKunjungan({ idKunjungan }: { idKunjungan: number }) {
  const [loading, setLoading] = useState(false);
  const warningDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    return Swal.fire({
      title: "Apakah kamu yakin ingin hapus?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result: any) => {
      if (!result.isConfirmed) return setLoading(true);
      axios
        .delete(`/api/dtdoor/kunjungan/${idKunjungan}`)
        .then((res) => {
          if (res.status > 300) Swal.fire("Gagal Hapus", "", "error");
          Swal.fire("Kunjungan Dtdoor di hapus", "").then(() => {
            window.location.reload();
          });
        })
        .catch(() => {
          Swal.fire("Gagal Hapus", "", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };
  return (
    <form
      className="flex gap-2 hover:text-red-500 hover:scale-110 cursor-pointer"
      onSubmit={warningDelete}
    >
      <button className="transform mt-1  flex w-full items-center gap-1">
        <MdiDeleteEmpty className="w-6 h-6" />
        <span>Delete</span>
      </button>
    </form>
  );
}

function PilihSebagaiActive({ dtdoor }: { dtdoor: TDtdoor }) {
  const [loading, setLoading] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    return Swal.fire({
      html: `Apakah kamu yakin ingin <b>${dtdoor.namaLengkap}</b> menjadi active?`,
      showCancelButton: true,
      confirmButtonText: "Ya",
    }).then((result: any) => {
      if (!result.isConfirmed) return setLoading(true);
      axios
        .put(`/api/dtdoor/active/${dtdoor.id}`)
        .then((res) => {
          if (res.status > 300) Swal.fire("Gagal Active", "", "error");
          Swal.fire("Dtdoor di Di Active kan", "").finally(() => {
            window.location.reload();
          });
        })
        .catch(() => {
          Swal.fire("Gagal Hapus", "", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };
  return (
    <form className="" onSubmit={onSubmit}>
      <button className="outline-none bg-transparent">
        <MdiPickaxe className="h-5 w-5 text-red-500" />
      </button>
    </form>
  );
}

function ModalImage({
  image,
  setImageSelected,
}: {
  image?: string;
  setImageSelected: Dispatch<SetStateAction<string | undefined>>;
}) {
  useEffect(() => {
    const modalImage = document.getElementById(
      "my_modal_image"
    ) as HTMLDialogElement;

    const closeModal = () => {
      setImageSelected(undefined);
      modalImage.close();
    };

    if (!image) closeModal();
    else modalImage.showModal();

    document.addEventListener("click", (e) => {
      if (e.target === modalImage) closeModal();
    });
    return () => {
      document.removeEventListener("click", (e) => {
        if (e.target === modalImage) closeModal();
      });
    };
  }, [image, setImageSelected]);

  return (
    <dialog id="my_modal_image" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        {image && <Image src={image} alt="image" width={1000} height={1000} />}
      </div>
    </dialog>
  );
}
