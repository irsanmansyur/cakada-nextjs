"use client";
import TbodySkeleton from "@/components/tbody-skeleton";
import { TApiPaginate, TMeta } from "@/utils";
import { TUser } from "@/utils/type/user";
import useAxios from "axios-hooks";
import React from "react";

export default function TableKelurahan() {
  const [{ data, loading }] = useAxios<TApiPaginate<TUser>>(
    "/api/user/relawan?role=relawan kecamatan"
  );
  return (
    <div className="bg-gray-50">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Target</th>
              <th>Kabupaten</th>
              <th>Kecamatan</th>
            </tr>
          </thead>
          <tbody>
            {loading || (!data && <TbodySkeleton row={20} col={8} />)}
            <Tbody users={data?.data} meta={data?.meta} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tbody({ users, meta }: { users?: TUser[]; meta?: TMeta }) {
  if (!users || !meta) return "";
  if (users.length === 0)
    return (
      <tr>
        <td colSpan={99999} className="text-center">
          Data Kosong
        </td>
      </tr>
    );

  return (
    <>
      {users.map((user, i) => (
        <tr key={user.id} className="hover">
          <th>{meta.page * meta.limit - meta.limit + i + 1}</th>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.gender}</td>
          <td>{user.relawan.target}</td>
          <td>{user.relawan.kabName}</td>
          <td>{user.relawan.kecName}</td>
        </tr>
      ))}
    </>
  );
}
