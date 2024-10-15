"use client";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import FormGroup from "@/components/form/form-group";
import { InputErrorMessage } from "@/components/form/input-error";
import { KecamatanSelect2024 } from "@/components/kecamatans/s";
import { KelurahanSelect2024 } from "@/components/kelurahan/select-kelurahan";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
import { TUser, TUserRelawan } from "@/utils/type/user";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";

type Props = {
  relawan: TUserRelawan;
};
export default function FormEdit({ relawan }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [kecamatan, setKecamatan] = useState<TKecamatan | null>({
    label: relawan.kecName,
    value: relawan.kecKode,
    wilId: relawan.kecKode,
  } as TKecamatan);
  const [kelurahan, setKelurahan] = useState<TKelurahan | null>({
    wilId: relawan.kelKode,
    value: relawan.kelKode,
    label: relawan.kelName,
  } as TKelurahan);
  const { kabKode } = useStoreDashboard();
  const [data, setData] = useState({
    ...relawan,
    nik: relawan.username,
    noTelp: relawan.kontak + "",
  });

  const validate = () => {
    const relawanValidate = z.object({
      username: z
        .string()
        .length(16, { message: "NIK harus terdiri dari 16 digit" })
        .regex(/^\d+$/, { message: "NIK hanya boleh berisi angka" }),
      name: z.string().min(1, { message: "Nama tidak boleh kosong" }),

      dusun: z.string().min(1, { message: "Dusun tidak boleh kosong" }),
      gender: z.enum(["male", "female"], {
        message: "Gender harus 'Laki-laki' atau 'Perempuan'",
      }),
      noTelp: z
        .string()
        .min(10, {
          message: "Nomor telepon minimal harus terdiri dari 10 digit",
        })
        .regex(/^\d+$/, {
          message: "Nomor telepon hanya boleh berisi angka",
        }),
      target: z
        .number()
        .min(10, { message: "Target minimal harus 10" })
        .max(10000, { message: "Target maksimal adalah 10000" }),
    });

    try {
      relawanValidate.parse(data);
      setErrors({});
      return true;
    } catch (e: any) {
      const formattedErrors = e.errors.reduce((acc: any, error: any) => {
        const [index, field] = error.path;
        const key = `${index}`;
        acc[key] = error.message;
        return acc;
      }, {});
      if (!kecamatan) formattedErrors.kecamatan = "Kecamatan harus dipilih";
      if (!kelurahan) formattedErrors.kelurahan = "Kelurahan harus dipilih";
      setErrors(formattedErrors);
      return false;
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!validate()) return setLoading(false);

    axios
      .put("/api/user/relawan/" + relawan.id, {
        ...data,
        kecKode: kecamatan?.wilId,
        kelKode: kelurahan?.wilId,
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data relawan berhasil di edit",
        }).then(() => {
          router.replace(document.referrer || "/");
        });
      })
      .finally(() => setLoading(false))
      .catch((e) => {
        if (e.response.data?.errors) return setErrors(e.response.data.errors);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return "";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 border rounded-md p-2 md:p-5 bg-gray-50"
    >
      <div className="flex gap-2">
        <FormGroup
          id="nik"
          classNameParent="w-full md:w-1/3"
          name={"nik"}
          label={"NIK"}
          error={errors?.nik}
          value={data.nik}
          onChange={(e) => setData({ ...data, nik: e.target.value })}
        />
        <FormGroup
          classNameParent="w-full md:w-2/3"
          name={"name"}
          id="name"
          label={"Nama Lengkap"}
          error={errors?.name}
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <div className="w-full md:w-1/3 space-y-2">
          <div>Pilih Kecamatan</div>
          <KecamatanSelect2024
            kabId={kabKode}
            onChange={(kec) => {
              setKecamatan(kec);
              setKelurahan(null);
            }}
            kecamatan={kecamatan}
          />
          <InputErrorMessage error={errors?.kecamatan} />
        </div>
        <div className="w-full md:w-1/3 space-y-2">
          <div>Pilih Kecamatan</div>
          <KelurahanSelect2024
            kabId={kabKode}
            onChange={(kel) => {
              setKelurahan(kel);
            }}
            kecId={kecamatan?.wilId}
            kelurahan={kelurahan}
          />
          <InputErrorMessage error={errors?.kelurahan} />
        </div>
        <div className="w-full md:w-1/3 space-y-2">
          <label className="form-control w-full md:-mt-2">
            <div className="label">
              <span className="label-text">Nama Dusun</span>
            </div>
            <input
              type="text"
              value={data.dusun}
              onChange={(e) => setData({ ...data, dusun: e.target.value })}
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <InputErrorMessage error={errors?.dusun} />
        </div>
      </div>
      <div className="flex gap-4">
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Jenis Kelamin</span>
            </div>
            <select
              value={data.gender}
              className="select select-bordered"
              onChange={(e) => setData({ ...data, gender: e.target.value })}
            >
              <option value={""}>Pilih Jenis Kelamin</option>
              <option value={"male"}>Laki laki</option>
              <option value={"female"}>Wanita</option>
            </select>
          </label>
          <InputErrorMessage error={errors?.gender} />
        </div>
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">No Telp</span>
            </div>
            <input
              type="text"
              value={data.noTelp}
              onChange={(e) => setData({ ...data, noTelp: e.target.value })}
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <InputErrorMessage error={errors?.noTelp} />
        </div>
      </div>
      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Target</span>
          </div>
          <input
            type="number"
            value={data.target}
            onChange={(e) => setData({ ...data, target: +e.target.value })}
            min={10}
            className={`input input-bordered w-full max-w-xs${
              errors?.target ? " input-error" : ""
            }`}
          />
        </label>
        <InputErrorMessage error={errors?.target} />
      </div>
      <button className="btn btn-primary w-full" disabled={loading}>
        Tambah
      </button>
    </form>
  );
}
