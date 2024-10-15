"use client";

import CardItem from "@/components/cards/card-total";
import { MdiPeopleGroup } from "@/components/icons/MdiPeopleGroup";
import { MdiRefresh } from "@/components/icons/MdiRefresh";
import { KecamatanSelect2024 } from "@/components/kecamatans/s";
import { KelurahanSelect2024 } from "@/components/kelurahan/select-kelurahan";
import LoadingButton from "@/components/LoadingButton";
import PaginationClient from "@/components/Pagination-client";
import TbodySkeleton from "@/components/tbody-skeleton";
import { TApi } from "@/utils";
import { TDpt } from "@/utils/type/dpt";
import { TKecamatan, TKelurahan, TTps } from "@/utils/type/kecamatan";
import useAxios from "axios-hooks";
import { useState } from "react";
import CardDptTotalKec from "./card-total-dpt-kec";
import CardDptTotalKel from "./card-total-dpt-kel";
import { TpsSelect2024 } from "@/components/tps/select-tps";
import { ExportXl2024Comp } from "@/components/excel/dpt-excel";
import { MdiDoorSliding } from "@/components/icons/MdiDoorSliding";
import { MdiCheckOutline } from "@/components/icons/MdiCheckOutline";
import ModalDtdoor from "./modal-dtdoor";
import { TKabupaten } from "@/utils/type/kabupaten";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import { ERole } from "@/utils/enum";
import { hasRole } from "@/utils/helpers";
import ModalFPH from "./modal-ph";
import { DptAddModal } from "./modal-add-dpt";
import { DptEditModal } from "./modal-edit-dpt";

type Props = {
  totalDpt: number;
};
export default function DptClient({ totalDpt }: Props) {
  const { user, kabKode } = useStoreDashboard();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [kecamatan, setKecamatan] = useState<TKecamatan | null>(null);
  const [kelurahan, setKelurahan] = useState<TKelurahan | null>(null);
  const [tps, setTps] = useState<TTps | null>(null);

  const [dptSelected, setDptSelected] = useState<{
    data: TDpt | null;
    type: "edit" | "view" | "program-harapan" | null;
  }>({ data: null, type: null });

  const [{ data, loading }, muatUlang] = useAxios<
    TApi<TDpt[], { kab: TKabupaten }>
  >(
    {
      url: `api/dpt/${kabKode}`,
      params: {
        page,
        limit,
        ...(search.length > 0 ? { nama: search } : {}),
        ...(kecamatan ? { kecId: kecamatan.wilId } : {}),
        ...(kelurahan && { kelId: kelurahan.wilId }),
        ...(tps && { tps: tps.noTps }),
      },
    },
    { autoCancel: true, ssr: false },
  );
  const [{ data: dataTotal, loading: loadingTotal }, muatTotal] = useAxios<
    TApi<number>
  >(
    {
      url: `/api/dpt/total/${kabKode}`,
      params: {
        ...(search.length > 0 ? { nama: search } : {}),
        ...(kecamatan ? { kecId: kecamatan.wilId } : {}),
        ...(kelurahan && { kelId: kelurahan.wilId }),
        ...(tps && { tps: tps.noTps }),
      },
    },
    { autoCancel: true, ssr: false },
  );

  if (!user || !kabKode) return "";
  console.log(user);

  return (
    <>
      <div className="space-y-3">
        <div className="dashboard flex gap-5 flex-col sm:flex-row">
          <CardItem
            total={totalDpt}
            text="Total DPT"
            icon={<MdiPeopleGroup className="w-8 h-8" />}
          />
          {kecamatan && (
            <CardDptTotalKec
              kabId={kabKode}
              kecId={kecamatan.wilId}
              kecNama={kecamatan.kecNama}
            />
          )}
          {kelurahan && (
            <CardDptTotalKel
              kabId={kabKode}
              kelId={kelurahan.wilId}
              kelNama={kelurahan.kelNama}
            />
          )}
        </div>
        <div className="header flex sm:justify-between flex-col sm:flex-row">
          <div className="my-2 gap-5 flex sm:justify-center sm:items-center flex-col sm:flex-row items-start min-w-[50%]">
            {!hasRole(ERole.REL_KEC, ERole.REL_KEL) && (
              <KecamatanSelect2024
                kabId={kabKode}
                onChange={(kec) => {
                  setKecamatan(kec);
                  setKelurahan(null);
                  setPage(1);
                  setTps(null);
                }}
                kecamatan={kecamatan}
              />
            )}
            {!hasRole(ERole.REL_KEL) && (
              <KelurahanSelect2024
                kecId={kecamatan?.wilId}
                kelurahan={kelurahan}
                kabId={kabKode}
                onChange={(kel) => {
                  setKelurahan(kel);
                  setPage(1);
                  setTps(null);
                }}
              />
            )}

            <TpsSelect2024
              kabId={kabKode}
              tps={tps}
              kecId={kecamatan?.wilId || null}
              kelId={kelurahan?.wilId || null}
              onChange={(v) => {
                setTps(v);
                setPage(1);
              }}
            />
          </div>
          <div className="my-2 flex items-center gap-1">
            <select
              className="select select-bordered w-full max-w-xs"
              defaultValue={limit}
              onChange={(e) => {
                setLimit(+e.target.value);
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={300}>300</option>
            </select>
            <div className="w-full relative">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 1 && value.length < 3) return;
                    setPage(1);
                    setSearch(value);
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
            <div className="pl-2">
              <DptAddModal
                kabKode={kabKode}
                onSucces={(s) => {
                  muatUlang();
                }}
              />
            </div>
          </div>
        </div>
        {hasRole(ERole.ADMIN) && (
          <div className="export flex justify-end">
            <ExportXl2024Comp
              kabupaten={data ? data["kab"] : {}}
              kecamatan={kecamatan}
              tps={tps}
              kelurahan={kelurahan}
              kabId={kabKode}
            />
          </div>
        )}
        <div className="relative">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md min-h-60">
            <MdiRefresh
              className="absolute top-[-5px] left-[-5px] w-5 h-5 cursor-pointer"
              onClick={() => muatUlang()}
            />
            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
              <thead className="bg-gray-50 font-bold">
                <tr>
                  <th
                    scope="col"
                    className="px-2 py-4 font-medium text-black text-center"
                  >
                    Program
                  </th>
                  <th scope="col" className="px-2 py-4 font-medium text-black">
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-6  py-4 font-medium text-gray-900"
                  >
                    Nama
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    Jenis Kelamin
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    Kecamatan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    Kelurahan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    TPS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900 text-center"
                  >
                    Alamat
                  </th>
                  {hasRole(ERole.ADMIN) && (
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 text-center"
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100 relative">
                {loading && data && (
                  <tr>
                    <td colSpan={99999}>
                      <div className="absolute inset-0 bg-black/10">
                        <LoadingButton />
                      </div>
                    </td>
                  </tr>
                )}
                {data ? (
                  data["data"].map((dpt, i) => {
                    return (
                      <tr
                        key={i}
                        className={`hover:bg-gray-50${dpt.createdBy ? " bg-gray-200" : ""}`}
                      >
                        <td className="px-2 py-4 font-medium text-black">
                          <div className="flex gap-2 justify-center items-center">
                            <div className="relative">
                              <div
                                className="tooltip tooltip-right"
                                data-tip="Program Harapan"
                              >
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    setDptSelected({
                                      data: dpt,
                                      type: "program-harapan",
                                    });
                                    const modal =
                                      document.getElementById("my_modal_4");
                                    if (modal instanceof HTMLDialogElement) {
                                      modal.showModal();
                                    }
                                  }}
                                >
                                  <MdiDoorSliding className="h-7 w-7" />
                                </button>
                              </div>
                              {dpt.programHarapan && (
                                <div className="absolute right-[-4px]  text-primary top-[-3px] rounded-full border-primary bg-white">
                                  <MdiCheckOutline className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 font-medium text-black">
                          {page * limit - limit + (i + 1)}
                        </td>
                        <th className="gap-3 px-2 md:px-6 py-4 font-normal text-gray-900 flex justify-between group">
                          <div>
                            <div className="font-medium text-gray-700">
                              {dpt.nama}
                            </div>
                            <span>Usia : {dpt.usia}</span>
                          </div>
                        </th>
                        <td className="px-6 py-4 text-center">
                          {dpt.jenisKelamin}
                        </td>
                        <td className="px-6 py-4 text-center">{dpt.namaKec}</td>
                        <td className="px-6 py-4 text-center">{dpt.namaKel}</td>
                        <td className="px-6 py-4 text-center">{dpt.namaTps}</td>
                        <td className="px-6 py-4 text-left">
                          <div className="whitespace-nowrap">{dpt.alamat}</div>
                          <div className="flex gap-2">
                            <span>RT/RW</span> :
                            <span>
                              {dpt.rt}/{dpt.rw}
                            </span>
                          </div>
                        </td>
                        {hasRole(ERole.ADMIN) && (
                          <td className="px-6 py-4 text-center justify-center flex">
                            <DptEditModal
                              kabKode={kabKode}
                              dpt={dpt}
                              onSucces={() => muatUlang()}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <TbodySkeleton col={7} row={limit} />
                )}
              </tbody>
            </table>
          </div>
        </div>
        <PaginationClient
          onChangePage={(page) => setPage(page)}
          currentPage={page}
          totalPages={Math.ceil((dataTotal?.data || 10) / limit)}
        />
      </div>
      {data &&
        dptSelected &&
        dptSelected.data &&
        dptSelected.type === "program-harapan" && (
          <ModalFPH
            dpt={dptSelected.data}
            kabupaten={data?.kab}
            onAdded={() => {
              muatUlang();
            }}
          />
        )}
    </>
  );
}
