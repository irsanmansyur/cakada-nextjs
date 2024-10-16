"use client";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import FormGroup from "@/components/form/form-group";
import { InputErrorMessage } from "@/components/form/input-error";
import { KecamatanSelect2024 } from "@/components/kecamatans/s";
import { KelurahanSelect2024 } from "@/components/kelurahan/select-kelurahan";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";

export default function FormAdd() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [kecamatan, setKecamatan] = useState<TKecamatan | null>(null);
  const [kelurahan, setKelurahan] = useState<TKelurahan | null>(null);
  const { kabKode } = useStoreDashboard();
  const [data, setData] = useState({
    nik: "",
    name: "",
    password: "changeme",
    role: "",
    dusun: "",
    gender: "",
    noTelp: "",
    target: 10,
  });

  const validate = () => {
    const relawanValidate = z.object({
      nik: z
        .string()
        .length(16, { message: "NIK harus terdiri dari 16 digit" })
        .regex(/^\d+$/, { message: "NIK hanya boleh berisi angka" }),
      name: z.string().min(1, { message: "Nama tidak boleh kosong" }),
      password: z.string().min(6, {
        message: "Password minimal harus terdiri dari 6 karakter",
      }),
      role: z.enum(
        ["relawan kabupaten", "relawan kecamatan", "relawan kelurahan"],
        {
          message: "Role tidak valid",
        },
      ),
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
      .post("/api/user/relawan", {
        ...data,
        kecKode: kecamatan?.wilId,
        kelKode: kelurahan?.wilId,
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data relawan berhasil ditambahkan",
        });
        setKecamatan(null);
        setKelurahan(null);
        setData({
          nik: "",
          name: "",
          password: "changeme",
          role: "",
          dusun: "",
          gender: "",
          noTelp: "",
          target: 10,
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

      <div className="space-y-2 mt-6">
        <label htmlFor="password">Password</label>
        <label
          className={`input input-bordered flex items-center gap-2 ${
            errors?.password ? " input-error" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="grow"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </label>
        <InputErrorMessage error={errors?.password} />
      </div>

      <div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Pilih Jenis Relawan</span>
          </div>
          <select
            value={data.role}
            className="select select-bordered"
            onChange={(e) => setData({ ...data, role: e.target.value })}
          >
            <option value={""}>Pilih Posisi Relawan</option>
            <option value={"relawan kabupaten"}>Relawan Kabupaten</option>
            <option value={"relawan kecamatan"}>Relawan Kecamatan</option>
            <option value={"relawan kelurahan"}>Relawan Kelurahan</option>
          </select>
        </label>
        <InputErrorMessage error={errors?.role} />
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
