import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import ErrorInput from "@/components/form/error";
import FormGroup, { SelectFormGroup } from "@/components/form/form-group";
import KepalaKeluargaSelect from "@/components/kepala-keluarga-select";
import LoadingButton from "@/components/LoadingButton";
import { TApi } from "@/utils";
import { useCheckLocation } from "@/utils/helpers";
import { TDpt, TTipePemilih } from "@/utils/type/dpt";
import { TDtdoor, TKunjungan } from "@/utils/type/dtdoor";
import { TKabupaten } from "@/utils/type/kabupaten";
import axios from "axios";
import useAxios from "axios-hooks";
import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";
const baseImage =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

export const readFile = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};
export default function ModalDtdoor({
  kabupaten,
  dpt,
}: {
  dtdoor?: TDtdoor;
  dpt: TDpt;
  kabupaten: TKabupaten;
}) {
  const [{ data: dataDtdoor, loading: loadingDtdoor }] = useAxios(
    `/api/dtdoor/${dpt.idDpt}`,
    {
      useCache: false,
    }
  );
  if (loadingDtdoor) return <LoadingButton />;

  return (
    <ModalDtdoorLocal
      dtdoor={dataDtdoor.data}
      dpt={dpt}
      kabupaten={kabupaten}
    />
  );
}

function ModalDtdoorLocal({
  dtdoor,
  kabupaten,
  dpt,
}: {
  dtdoor?: TDtdoor;
  dpt: TDpt;
  kabupaten: TKabupaten;
}) {
  const { position } = useStoreDashboard();
  const [data, setData] = useState({
    id: dtdoor?.id || null,
    idDpt: dpt.idDpt,
    kepalaKeluarga: dtdoor?.kepalaKeluarga || "",
    kepalaKeluargaId: dtdoor?.kepalaKeluargaId || "",
    kelId: dtdoor?.kelId || dpt.idKel,
    kabId: kabupaten.wilId,
    nik: dtdoor?.nik || dpt.nik || "",
    namaLengkap: dtdoor?.namaLengkap || dpt.nama,
    jenisKelamin: dtdoor?.jenisKelamin || dpt.jenisKelamin,
    kabupaten: kabupaten.kabNama || "",
    kecamatan: dtdoor?.kecamatan || dpt.namaKec,
    desa: dtdoor?.desa || dpt.namaKel,
    tps: dtdoor?.tps || dpt.namaTps,
    rt: dtdoor?.rt || dpt["rt"],
    rw: dtdoor?.rw || dpt["rw"],
    statusDtdoor: dtdoor?.statusDtdoor || "",
    jumlahWajibPilih: dtdoor?.jumlahWajibPilih || 2,
    noTelpon: dtdoor?.noTelpon || "-",
    kunjungans: [
      ...(dtdoor?.kunjungans || []).map((kj) => {
        let img = kj.image;
        if (!img) img = baseImage;
        else img = "/api/dtdoor/image/" + kj.id;
        return { ...kj, image: img };
      }),
      addKunjungan(),
    ].reverse(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [{ data: dataTipePemilih, loading: loadingTipePemilih }] = useAxios<
    TApi<TTipePemilih[]>
  >({
    url: `/api/dtdoor/tipe-pemilih`,
  });
  const [{ data: dataPilihanPileg, loading: loadingPilihanPileg }] = useAxios<
    TApi<any[]>
  >({
    url: `/api/dtdoor/pilihan-pileg`,
  });
  const [{ data: dataProgramBantuan, loading: loadingProgramBantuan }] =
    useAxios<TApi<any[]>>({ url: `/api/dtdoor/program-bantuans` });

  function addKunjungan() {
    return {
      image: baseImage,
      tipePemilihId: "",
      pilihanPilegId: "",
      programBantuanId: "",
      merchendise: "",
      namaRelawan: "",
      kontakRelawan: "",
      position,
    };
  }

  const validate = () => {
    const kunjunganSchema = z.array(
      z.object({
        tipePemilihId: z
          .number({ message: "tipePemilihId harus berupa angka" })
          .min(1, { message: "tipePemilihId harus diisi" }),
        pilihanPilegId: z
          .number({ message: "pilihanPilegId harus dalam format angka" })
          .min(1, { message: "pilihanPilegId harus diisi" }),
        programBantuanId: z
          .number({ message: "programBantuanId harus dalam format angka" })
          .min(1, { message: "programBantuanId harus diisi" }),
        merchendise: z
          .string()
          .nonempty({ message: "marchendise harus diisi" }),
        namaRelawan: z
          .string()
          .nonempty({ message: "namaRelawan harus diisi" }),
        kontakRelawan: z.string().regex(/^\+?\d+$/, {
          message: "kontakRelawan harus dalam format telepon",
        }),
      })
    );
    try {
      kunjunganSchema.parse(data.kunjungans);
      setErrors({});
    } catch (e: any) {
      const formattedErrors = e.errors.reduce((acc: any, error: any) => {
        const [index, field] = error.path;
        const key = `${field}_${index}`;
        acc[key] = error.message;
        return acc;
      }, {});
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validate();

    if (isValid === false) return;

    const kunjungans = data.kunjungans.map((kunjungan) => {
      let bb: any = { ...kunjungan };
      if (bb?.image === baseImage || bb.image === "") {
        delete bb["image"];
      }
      return bb;
    });

    axios
      .post(`/api/dtdoor`, { ...data, kunjungans })
      .catch((err) => console.log(err))
      .then((res) => {
        console.log("success");
      });
  };

  const onChangeKunjungan = (
    key: keyof TKunjungan,
    index: number,
    value: any
  ) => {
    const newPilihans = [...data.kunjungans];
    newPilihans[index][key] = value;
    setData({ ...data, kunjungans: newPilihans });
  };

  if (loadingTipePemilih || loadingPilihanPileg || loadingProgramBantuan)
    return <div>Loading</div>;

  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex justify-between items-center mb-7">
          <h3 className="font-bold text-lg">Input Door To Door</h3>
          <div className="modal-action" style={{ marginTop: 0 }}>
            <form method="dialog">
              <button className="rounded border px-2">X</button>
            </form>
          </div>
        </div>
        <div>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="w-full">
              <label className="pb-1 block">Kepala Keluarga</label>
              <KepalaKeluargaSelect
                kabId={data.kabId}
                kelId={data?.kelId}
                value={data.kepalaKeluargaId as any}
                onChange={(v) => {
                  setData((e) => ({
                    ...e,
                    kepalaKeluarga: v?.nama || "",
                    kepalaKeluargaId: v?.idDpt || "",
                  }));
                }}
              />
            </div>
            <div className="flex gap-2">
              <FormGroup
                id="nik"
                classNameParent="w-full md:w-1/3"
                name={"nik"}
                label={"NIK"}
                value={data.nik}
                onChange={(e) => setData({ ...data, nik: e.target.value })}
              />
              <FormGroup
                classNameParent="w-full md:w-2/3"
                name={"nik"}
                label={"Nama Lengkap"}
                value={data.namaLengkap}
                onChange={(e) =>
                  setData({ ...data, namaLengkap: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <FormGroup
                id="kabupaten"
                classNameParent="w-full w-1/3"
                name={"kabupaten"}
                label={"Kabupaten"}
                value={data.kabupaten}
                onChange={(e) =>
                  setData({ ...data, kabupaten: e.target.value })
                }
              />
              <FormGroup
                classNameParent="w-full w-1/3"
                name={"kecamatan"}
                label={"Kecamatan"}
                value={data.kecamatan}
                onChange={(e) =>
                  setData({ ...data, kecamatan: e.target.value })
                }
              />
              <FormGroup
                id="desa"
                classNameParent="w-full w-1/3"
                name={"desa"}
                label={"Desa"}
                value={data.desa}
                onChange={(e) => setData({ ...data, desa: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <FormGroup
                classNameParent="w-full w-1/3"
                name={"tps"}
                label={"TPS"}
                value={data.tps}
                onChange={(e) => setData({ ...data, tps: e.target.value })}
              />
              <FormGroup
                classNameParent="w-full w-1/3"
                name={"rw"}
                label={"RW"}
                value={data.rw}
                onChange={(e) => setData({ ...data, rw: e.target.value })}
              />
              <FormGroup
                classNameParent="w-full w-1/3"
                name={"rt"}
                label={"RT"}
                value={data.rt}
                onChange={(e) => setData({ ...data, rt: e.target.value })}
              />
            </div>
            <SelectFormGroup
              id="jenisKelamin"
              classNameParent="w-full"
              name="jenisKelamin"
              label="Jenis Kelamin"
              value={data.jenisKelamin}
              onChange={(e) =>
                setData({ ...data, jenisKelamin: e.target.value })
              }
              options={[
                { value: "L", label: "Laki Laki" },
                { value: "P", label: "Perempuan" },
              ]}
            />
            <FormGroup
              type="number"
              id="noTelpon"
              classNameParent="w-full"
              name={"noTelpon"}
              label={"No. Telp"}
              value={data.noTelpon}
              onChange={(e) => setData({ ...data, noTelpon: e.target.value })}
            />
            {/* Jumlah wajib pilih */}
            <FormGroup
              id="jmlWajibPilih"
              classNameParent="w-full"
              type="number"
              min={"2"}
              name={"jmlWajibPilih"}
              label={"Jumlah Wajib Pilih"}
              value={data.jumlahWajibPilih}
              onChange={(e) =>
                setData({ ...data, jumlahWajibPilih: +e.target.value })
              }
            />
            <h2 className="font-extrabold pb-3 flex justify-between items-center text-2xl mt-10">
              Kunjungans
            </h2>
            {data.kunjungans.map((kunjungan, index) => {
              return (
                <div
                  className="border px-2 pt-6 pb-2 rounded mb-3 relative space-y-3"
                  key={index}
                >
                  <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 rounded-full flex justify-center items-center bg-gray-800 text-white font-extrabold text-lg w-8 h-8">
                    <span>{data.kunjungans.length - index}</span>
                  </div>
                  {data.kunjungans.length !== 1 &&
                  data.kunjungans.length === index + 1 ? (
                    <center>
                      <Image
                        alt="avatar thumbnail"
                        width={300}
                        height={400}
                        src={kunjungan.image}
                      />
                    </center>
                  ) : (
                    <div className="flex items-center flex-col">
                      <h3 className="font-bold text-xl">Foto Kunjungan</h3>
                      <label className="avatar cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (!e.target.files) return;
                            const img = await readFile(e.target.files[0]);
                            onChangeKunjungan("image", index, img);
                          }}
                        />
                        <div className="w-32 rounded">
                          <Image
                            alt="avatar thumbnail"
                            width={35}
                            height={35}
                            src={kunjungan.image || baseImage}
                          />
                        </div>
                      </label>
                      <ErrorInput message={errors?.image} />
                    </div>
                  )}
                  <div className="flex gap-3">
                    <SelectFormGroup
                      id={"tipePemilihId" + `_${index}`}
                      name={"tipePemilihId" + `_${index}`}
                      label="Tipe Pemilih"
                      disabled={
                        data.kunjungans.length !== 1 &&
                        data.kunjungans.length === index + 1
                      }
                      classNameParent="w-full"
                      value={kunjungan.tipePemilihId}
                      onChange={(e) => {
                        onChangeKunjungan(
                          "tipePemilihId",
                          index,
                          +e.target.value
                        );
                      }}
                      options={[
                        { value: "", label: "Pilih" },
                        ...(dataTipePemilih?.data || []).map((tipePemilih) => ({
                          value: tipePemilih.id,
                          label: tipePemilih.nama,
                        })),
                      ]}
                      error={errors[`tipePemilihId_${index}`]}
                    />
                    <SelectFormGroup
                      id="pilihanPilegId"
                      name="pilihanPilegId"
                      label="Pilihan Pileg"
                      disabled={
                        data.kunjungans.length !== 1 &&
                        data.kunjungans.length === index + 1
                      }
                      classNameParent="w-full"
                      value={kunjungan.pilihanPilegId}
                      onChange={(e) => {
                        onChangeKunjungan(
                          "pilihanPilegId",
                          index,
                          +e.target.value
                        );
                      }}
                      options={[
                        { value: "", label: "Pilihan.." },
                        ...(dataPilihanPileg?.data || []).map(
                          (pilihanPileg) => ({
                            value: pilihanPileg.id,
                            label: pilihanPileg.nameKategori,
                          })
                        ),
                      ]}
                      error={errors[`pilihanPilegId_${index}`]}
                    />
                  </div>
                  <div className="flex gap-3">
                    <SelectFormGroup
                      id={"programBantuanId" + `_${index}`}
                      name={"programBantuanId" + `_${index}`}
                      disabled={
                        data.kunjungans.length !== 1 &&
                        data.kunjungans.length === index + 1
                      }
                      label="Program Bantuan"
                      classNameParent="w-2/3"
                      value={kunjungan.programBantuanId}
                      onChange={(e) => {
                        onChangeKunjungan(
                          "programBantuanId",
                          index,
                          +e.target.value
                        );
                      }}
                      options={[
                        { value: "", label: "Pilihan.." },
                        ...(dataProgramBantuan?.data || []).map((programB) => ({
                          value: programB.id,
                          label: programB.nama,
                        })),
                      ]}
                      error={errors[`programBantuanId_${index}`]}
                    />
                    <FormGroup
                      id={`merchendise_${index}`}
                      name={`merchendise_${index}`}
                      label={`Merchendise`}
                      disabled={
                        data.kunjungans.length !== 1 &&
                        data.kunjungans.length === index + 1
                      }
                      classNameParent="w-1/3"
                      value={kunjungan.merchendise}
                      onChange={(e) =>
                        onChangeKunjungan("merchendise", index, e.target.value)
                      }
                      error={errors[`merchendise_${index}`]}
                    />
                  </div>
                  <div className="flex gap-4">
                    <FormGroup
                      id={`namaRelawan_${index}`}
                      name={`namaRelawan_${index}`}
                      label={`Nama Relawan`}
                      disabled={
                        data.kunjungans.length !== 1 &&
                        data.kunjungans.length === index + 1
                      }
                      value={kunjungan.namaRelawan}
                      onChange={(e) =>
                        onChangeKunjungan("namaRelawan", index, e.target.value)
                      }
                      classNameParent="w-full"
                      error={errors[`namaRelawan_${index}`]}
                    />
                    <FormGroup
                      classNameParent="w-full"
                      id={`kontakRelawan_${index}`}
                      name={`kontakRelawan_${index}`}
                      label={`Kontak Relawan`}
                      disabled={
                        data.kunjungans.length !== 1 &&
                        data.kunjungans.length === index + 1
                      }
                      type="number"
                      value={kunjungan.kontakRelawan}
                      onChange={(e) =>
                        onChangeKunjungan(
                          "kontakRelawan",
                          index,
                          e.target.value
                        )
                      }
                      error={errors[`kontakRelawan_${index}`]}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex justify-center">
              <button
                type="submit"
                className="btn bg-gray-800 hover:bg-gray-700 text-white"
              >
                Tambah
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
