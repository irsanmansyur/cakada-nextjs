"use client";

import ErrorInput from "@/components/form/error";
import { MdiEyeOffOutline } from "@/components/icons/MdiEyeOffOutline";
import { MdiEyeOutline } from "@/components/icons/MdiEyeOutline";
import { parseErrors, ValidationError } from "@/utils/zod";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";
import { setCookiesLogin } from "@/utils/helpers";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";

export default function FormLogin() {
  const { position } = useStoreDashboard();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationError>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loginSchema = z.object({
      username: z.string().min(3),
      password: z.string().min(3),
    });
    setErrors({});
    const response = loginSchema.safeParse(data);
    if (!response.success) {
      setErrors(parseErrors(response));
      return;
    }

    setLoading(true);
    axios
      .post("/api/auth/login", {
        ...data,
        position: {
          lat: position.latitude,
          lng: position.longitude,
        },
      })
      .then(({ data }) => {
        setCookiesLogin(
          data["data"]["accessToken"],
          data["data"]["refreshToken"],
        );
        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
        }).then(() => {
          window.location.href = "/";
        });
      })
      .catch((err) => {
        if (err.response?.status < 500) {
          setErrors(err.response.data.errors);
          if (err.response.data.errors?.position) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err.response.data.errors?.position,
            });
          }
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Gagal menghubungi server",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="flex flex-col gap-4 py-10" onSubmit={onSubmit}>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Username</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          className={
            "input input-bordered input-md w-full" +
            (errors?.["username"] ? " input-error" : "")
          }
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <ErrorInput message={errors?.["username"]} />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <div className="input input-bordered  flex items-center gap-2">
          <input
            {...(!showPassword && { type: "password" })}
            placeholder=""
            className="grow"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <MdiEyeOffOutline className="h-4 w-4 cursor-pointer" />
            ) : (
              <MdiEyeOutline className="h-4 w-4 cursor-pointer" />
            )}
          </span>
        </div>
        <ErrorInput message={errors?.["password"]} />
      </label>
      <button disabled={loading} type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
}
