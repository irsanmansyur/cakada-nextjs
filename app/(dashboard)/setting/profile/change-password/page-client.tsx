"use client";
import { useState } from "react";
import { InputErrorMessage } from "@/components/form/input-error";
import { z } from "zod";
import axios from "axios";
import Swal from "sweetalert2";
import { ValidationError } from "@/utils/zod";
import { useRouter } from "next/navigation";

export function PageClient() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    passwordOld: "",
    password: "",
    passwordConfirmation: "",
  });

  const validate = () => {
    const passSchema = z.object({
      passwordOld: z.string().min(6, {
        message: "Password minimal harus terdiri dari 6 karakter",
      }),
      password: z.string().min(6, {
        message: "Password minimal harus terdiri dari 6 karakter",
      }),
      passwordConfirmation: z
        .string()
        .min(6, {
          message: "Password minimal harus terdiri dari 6 karakter",
        })
        .refine((d) => d === data["password"], {
          message: "Password konfirmasi tidak sama",
        }),
    });

    const { error } = passSchema.safeParse(data);
    if (error) {
      setErrors(
        error.errors.reduce((acc, cur) => {
          acc[cur.path[0]] = cur.message;
          return acc;
        }, {} as ValidationError),
      );
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!validate()) return setLoading(false);

    axios
      .put("/api/user/change-password", data)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Password Berhasil di update",
        });
        router.replace("/setting/profile");
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
    <>
      <form
        className="space-y-3 mx-auto max-w-xl border bg-white rounded p-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2 mt-6">
          <label htmlFor="password">Password</label>
          <label
            className={`input input-bordered flex items-center gap-2 ${
              errors?.passwordOld ? " input-error" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70 cursor-pointer"
              onClick={() => setShowPasswordOld(!showPasswordOld)}
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type={showPasswordOld ? "text" : "password"}
              id="passwordOld"
              className="grow"
              value={data.passwordOld}
              onChange={(e) =>
                setData({ ...data, passwordOld: e.target.value })
              }
            />
          </label>
          <InputErrorMessage error={errors?.passwordOld} />
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
        <div className="space-y-2 mt-6">
          <label htmlFor="password">Password</label>
          <label
            className={`input input-bordered flex items-center gap-2 ${
              errors?.passwordConfirmation ? " input-error" : ""
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
              id="passwordConfirmation"
              className="grow"
              value={data.passwordConfirmation}
              onChange={(e) =>
                setData({ ...data, passwordConfirmation: e.target.value })
              }
            />
          </label>
          <InputErrorMessage error={errors?.passwordConfirmation} />
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>
          Tambah
        </button>
      </form>
    </>
  );
}
