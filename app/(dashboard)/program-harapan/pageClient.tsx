"use client";
import FormGroup, { SelectFormGroup } from "@/components/form/form-group";
import SearchInput from "@/components/form/search-input";
import { TKabupaten } from "@/utils/type/kabupaten";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
import useAxios from "axios-hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TbodySkeleton from "@/components/tbody-skeleton";
import { TApiPaginate } from "@/utils";
import Swal from "sweetalert2";
import { MdiDeleteEmpty } from "@/components/icons/MdiDeleteEmpty";
import { MdiCheckOutline } from "@/components/icons/MdiCheckOutline";
import axios from "axios";
import PaginationClient from "@/components/Pagination-client";
import { MdiPickaxe } from "@/components/icons/MdiPickaxe";
import { MdiLocationCheckOutline } from "@/components/icons/MdiLocationCheckOutline";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import { ERole } from "@/utils/enum";
import { hasRole } from "@/utils/helpers";
import { TUser } from "@/utils/type/user";
import { TProgramHarapan } from ".";
import { ProgramHarapanExcel } from "./(components)/excel";
import { HasilRekap } from "./(components)/hasilrekap";

type Props = {
  filters: {
    kabupatens: TKabupaten[];
    kecamatans: TKecamatan[];
    kelurahans: TKelurahan[];
    relawans: TUser[];
  };
};
export default function ProgramRelawanClient({ filters }: Props) {
  const { user } = useStoreDashboard();
  const [query, setQuery] = useState<Record<string, any>>({});
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [position, setPositionSelected] = useState<
    | {
        latitude: number;
        longitude: number;
      }
    | undefined
  >(undefined);

  const [{ data: dataProgramHarapan, loading: loadingDtdoor }] = useAxios<
    TApiPaginate<TProgramHarapan>
  >(
    {
      url: `/api/program-harapan`,
      params: {
        page,
        limit,
        ...(search && { search }),
        ...(startDate && { dateStart: startDate }),
        ...(endDate && { dateEnd: endDate }),
        ...(query?.kabName && { kabName: query.kabName }),
        ...(query?.kecName && { kecName: query.kecName }),
        ...(query?.kelName && { kelName: query.kelName }),
        ...(query?.relawanId && { relawanId: query.relawanId }),
      },
    },
    {
      autoCancel: true,
      ssr: false,
    },
  );
  if (!user?.role) return "";

  const FilterData = (
    <>
      <section className="p-4 shadow-sm bg-slate-50 rounded-md border mb-3">
        <h2 className="font-semibold mb-3 text-xl">Filter</h2>
        <div className="flex flex-wrap -mx-2">
          {![ERole.REL_KAB, ERole.REL_KEC, ERole.REL_KEL].includes(
            user.role.name,
          ) && (
            <SelectFormGroup
              id="kabupaten-id"
              classNameParent="w-1/2 sm:w-1/3 p-2"
              label={"Kabupaten"}
              name="kabupaten"
              options={[
                { value: "", label: "-- Kabupaten --" },
                ...filters.kabupatens.map((item) => ({
                  ...item,
                  value: item.kabName,
                  label: item.kabName,
                })),
              ]}
              onChange={(e) => {
                setQuery({ ...query, kabName: e.target.value });
              }}
            />
          )}
          {![ERole.REL_KEC, ERole.REL_KEL].includes(user.role.name) && (
            <SelectFormGroup
              classNameParent="w-1/2 sm:w-1/3 p-2"
              label={"Kecamatan"}
              id="kecamatan-id"
              name="Kecamatan"
              options={[
                { value: "", label: "--- Kecamatan ---" },
                ...filters.kecamatans.map((item) => ({
                  ...item,
                  value: item.kecName,
                  label: item.kecName,
                })),
              ]}
              onChange={(e) => {
                setQuery({ ...query, kecName: e.target.value });
              }}
            />
          )}
          {![ERole.REL_KEL].includes(user.role.name) && (
            <SelectFormGroup
              classNameParent="w-1/2 sm:w-1/3 p-2"
              label={"Kelurahan/Desa"}
              id="kelurahan-id"
              name="Kelurahan"
              options={[
                { value: "", label: "--- Kelurahan/Desa ---" },
                ...filters.kelurahans.map((item) => ({
                  ...item,
                  value: item.kelName,
                  label: item.kelName,
                })),
              ]}
              onChange={(e) => {
                setQuery({ ...query, kelName: e.target.value });
              }}
            />
          )}

          {!hasRole(ERole.REL_KEL) && (
            <SelectFormGroup
              classNameParent="w-1/2 sm:w-1/3 p-2"
              label={"Relawan"}
              id="relawan-id"
              options={[
                { value: "", label: "--- pilih relawan ---" },
                ...filters.relawans.map((item) => ({
                  ...item,
                  value: item.id,
                  label: `${item?.name} || ${item.role.name}`,
                })),
              ]}
              onChange={(e) => {
                setQuery({ ...query, relawanId: e.target.value });
              }}
            />
          )}
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
            <ProgramHarapanExcel
              kabName={query.kabName}
              kelName={query.kelName}
              kecName={query.kecName}
              status={query.status}
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
            <option value={10}>10</option>
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
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
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
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Nama
                </th>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  Wilayah
                </th>
                <th scope="col" className="py-3 px-6 border-r border-gray-500">
                  RT/RW
                </th>
                <th scope="col" className="py-3 px-2 border-r border-gray-500">
                  Jenis Kelamin
                </th>
                <th scope="col" className="py-3 px-2 border-r border-gray-500">
                  Jumlah Pemilih
                </th>
                <th
                  scope="col"
                  className="py-3 px-6  text-center font-extrabold border-b border-r border-gray-500"
                >
                  Relawan
                </th>
                <th
                  scope="col"
                  className="py-3 px-6  text-center font-extrabold border-b border-r border-gray-500"
                >
                  Kunjungan
                </th>
                <th
                  scope="col"
                  className="py-3 px-6  text-center font-extrabold border-r border-b border-gray-500"
                >
                  Tipe Pemilih
                </th>
                <th
                  scope="col"
                  className="py-3 px-6  text-center font-extrabold border-r border-b border-gray-500"
                >
                  Harapan
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 border-r text-center font-extrabold border-b border-gray-500"
                >
                  Dukungan Pemilih
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 border-r text-center font-extrabold border-b border-gray-500"
                >
                  Tindakan Sosialisasi
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 border-r text-center font-extrabold border-b border-gray-500"
                >
                  Lokasi Input
                </th>
                <th scope="col" className="py-3 px-6 border-l border-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <DataTable
                loadingDtdoor={loadingDtdoor}
                dataProgramHarapan={dataProgramHarapan?.data || []}
                setPositionSelected={setPositionSelected}
              />
            </tbody>
          </table>
        </div>
      </div>
      <ModalLocation
        position={position}
        setPositionSelected={setPositionSelected}
      />

      <PaginationClient
        currentPage={page}
        totalPages={dataProgramHarapan?.["meta"]["totalPages"] || 0}
        onChangePage={(pg) => {
          setPage(pg);
        }}
      />
      <HasilRekap />
    </>
  );
}

type PropsDtdoor = {
  loadingDtdoor: boolean;
  dataProgramHarapan?: TProgramHarapan[];
  setPositionSelected: Dispatch<
    SetStateAction<
      | {
          latitude: number;
          longitude: number;
        }
      | undefined
    >
  >;
};
function DataTable({
  loadingDtdoor,
  dataProgramHarapan,
  setPositionSelected,
}: PropsDtdoor) {
  if (loadingDtdoor || !dataProgramHarapan)
    return <TbodySkeleton col={13} row={3} />;
  if (dataProgramHarapan.length == 0)
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
  return dataProgramHarapan.map((ph, i) => {
    const position = (
      <button onClick={() => setPositionSelected(ph.position)}>
        <MdiLocationCheckOutline className="h-8 w-8 text-red-500" />
      </button>
    );
    return (
      <tr className="bg-slate-200" key={`${i}-${ph.id}`}>
        <td className="border-b py-2 px-6 align-top border-r border-gray-100">
          <div className="flex flex-col gap-1 whitespace-nowrap relative">
            <div className="absolute top-1 right-0 -mx-3">
              {ph.status !== "active" ? (
                <PilihSebagaiActive programHarapan={ph} />
              ) : (
                <MdiCheckOutline className="h-5 w-5 text-green-500" />
              )}
            </div>
            <span>Nama : {ph.namaLengkap}</span>
            <b className="whitespace-nowrap">
              Kepala Keluarga: {ph.kepalaKeluarga}
            </b>
            <span>No. Telp : {ph.noTelpon}</span>
          </div>
        </td>
        <td className="border-b py-2 px-6 align-top border-r border-gray-100">
          <div className="flex flex-col space-y-1 whitespace-nowrap">
            <span>Kabupaten : {ph.kabName}</span>
            <span>Kecamatan : {ph.kecName}</span>
            <span>Desa/Lurah : {ph.kelName}</span>
          </div>
        </td>
        <td className="border-b py-2 px-2 align-top text-left whitespace-nowrap border-r border-gray-100">
          <div className="flex space-y-1 flex-col">
            <span>RT/RW : {`${ph.rt}/${ph.rw}`}</span>
            <span>TPS : {`${ph.tps}`}</span>
          </div>
        </td>
        <td className="border-b py-2 px-2 align-top text-center border-r border-gray-100">
          {ph.jenisKelamin}
        </td>
        <td className="border-b py-2 px-2 align-top text-center border-r border-gray-100">
          {ph.jumlahWajibPilih}
        </td>
        <td className="py-2 px-2 align-top text-left whitespace-nowrap border-r border-gray-100 border-b">
          Nama : {ph.namaRelawan} <br />
          No. Telp : {ph.kontakRelawan} <br />
          {ph.dptCreatedBy && (
            <div className="badge badge-primary badge-outline">
              DPT Tambahan
            </div>
          )}
        </td>
        <td className="py-2 px-2 align-top text-center border-r border-gray-100 border-b">
          {ph.jumlahKunjungan}
        </td>
        <td className="py-2 px-2 align-top text-left border-r border-gray-100 border-b">
          {ph.tipePemilih}
        </td>
        <td className="py-2 px-2 align-top text-left border-r border-gray-100 border-b">
          {ph.harapan}
        </td>
        <td className="py-2 px-2 align-top text-left border-r border-gray-100 border-b">
          {ph.mendukung}
        </td>
        <td className="py-2 px-2 align-top text-left border-r border-gray-100 border-b">
          {ph.mensosialisasikan}
        </td>

        <td className="py-2 px-2 align-middle text-center border-r border-gray-100 border-b">
          {position}
        </td>
        <td className="border-b py-2 px-2 text-center border-gray-100 ">
          <DeleteKunjungan idKunjungan={ph.id as number} />
        </td>
      </tr>
    );
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
        .delete(`/api/program-harapan/kunjungan/${idKunjungan}`)
        .then((res) => {
          if (res.status > 300) Swal.fire("Gagal Hapus", "", "error");
          Swal.fire("Kunjungan Program Harapan di hapus", "").then(() => {
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

function PilihSebagaiActive({
  programHarapan,
}: {
  programHarapan: TProgramHarapan;
}) {
  const [loading, setLoading] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    return Swal.fire({
      html: `Apakah kamu yakin ingin <b>${programHarapan.namaLengkap}</b> menjadi active?`,
      showCancelButton: true,
      confirmButtonText: "Ya",
    }).then((result: any) => {
      if (!result.isConfirmed) return setLoading(true);
      axios
        .put(`/api/program-harapan/active/${programHarapan.id}`)
        .then((res) => {
          if (res.status > 300) Swal.fire("Gagal Active", "", "error");
          Swal.fire("Program Harapan di Di Active kan", "").finally(() => {
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

function ModalLocation({
  position,
  setPositionSelected,
}: {
  position?: { latitude: number; longitude: number };
  setPositionSelected: Dispatch<
    SetStateAction<{ latitude: number; longitude: number } | undefined>
  >;
}) {
  useEffect(() => {
    const modalImage = document.getElementById(
      "my_modal_position",
    ) as HTMLDialogElement;

    const closeModal = () => {
      setPositionSelected(undefined);
      modalImage.close();
    };

    if (!position) closeModal();
    else modalImage.showModal();

    document.addEventListener("click", (e) => {
      if (e.target === modalImage) closeModal();
    });
    return () => {
      document.removeEventListener("click", (e) => {
        if (e.target === modalImage) closeModal();
      });
    };
  }, [position, setPositionSelected]);

  return (
    <dialog id="my_modal_position" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <p className="text-lg font-bold mb-4">Lokasi Pengimputan</p>
        {position && (
          <iframe
            className="w-full"
            height="450"
            style={{ border: "0" }}
            loading="lazy"
            src={`https://www.google.com/maps?q=${position.latitude},${position.longitude}&hl=es;z=14&output=embed`}
          ></iframe>
        )}
      </div>
    </dialog>
  );
}
