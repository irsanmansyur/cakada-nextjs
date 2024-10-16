import Breadcrumbs from "@/components/layouts/breadcrumbs";
import { axiosInstance } from "@/utils/lib";
import { TApi } from "@/utils";
import { TUser } from "@/utils/type/user";
import { PageClient } from "./page-client";
import Link from "next/link";

const getLokasi = async () => {
  const { data } = await axiosInstance().get<TApi<TUser>>(`/api/user/profile`);
  return data.data;
};
export default async function Home() {
  const profile = await getLokasi();
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "Profile" }]} />
      <div className="my-3 block space-y-3">
        <Link
          href="/setting/profile/change-password"
          className="btn btn-primary"
        >
          Ganti Password
        </Link>
        <PageClient profile={profile} />
      </div>
    </>
  );
}
