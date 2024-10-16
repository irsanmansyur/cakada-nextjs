import Breadcrumbs from "@/components/layouts/breadcrumbs";
import { axiosInstance } from "@/utils/lib";
import { TApi } from "@/utils";
import { TUser } from "@/utils/type/user";
import { PageClient } from "./page-client";

const getLokasi = async () => {
  const { data } = await axiosInstance().get<TApi<TUser>>(`/api/user/profile`);
  return data.data;
};
export default async function Home() {
  const profile = await getLokasi();
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { name: "PROFILE", url: "/setting/profile" },
          { name: "Change Password" },
        ]}
      />
      <div className="my-3 block space-y-3">
        <PageClient />
      </div>
    </>
  );
}
