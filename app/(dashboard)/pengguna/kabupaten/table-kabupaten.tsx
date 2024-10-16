"use client";
import TbodySkeleton from "@/components/tbody-skeleton";
import { TApiPaginate, TMeta } from "@/utils";
import { TUser } from "@/utils/type/user";
import useAxios from "axios-hooks";
import Link from "next/link";
import DeleteRelawan from "../(components)/delete";

export default function TableKabupaten() {
  const [{ data, loading }] = useAxios<TApiPaginate<TUser>>(
    process.env.NEXT_PUBLIC_DOMAIN + "/api/user/relawan?role=relawan kabupaten",
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading || (!data && <TbodySkeleton row={20} col={6} />)}
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
          <td className="flex justify-center gap-2">
            <Link
              href={"/pengguna/edit/" + user.id}
              className="btn btn-outline btn-primary"
            >
              Edit
            </Link>
            <DeleteRelawan userId={user.id} />
          </td>
        </tr>
      ))}
    </>
  );
}
