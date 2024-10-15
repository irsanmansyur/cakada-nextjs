import Breadcrumbs from "@/components/layouts/breadcrumbs";
import { PropsPage, TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";
import { TTipePemilih } from "@/utils/type/dpt";
import {
  TKabupaten,
  TPilihanPileg,
  TProgramBantuan,
} from "@/utils/type/kabupaten";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
import FormEdit from "./form-edit";
import { TUser, TUserRelawan } from "@/utils/type/user";

const getRelawan = async (userId: number) => {
  const {
    data: { data },
  } = await axiosInstance().get<TApi<TUserRelawan>>(
    `/api/user/relawan/${userId}`,
  );
  return data;
};

export default async function Home({
  params: { id },
}: PropsPage<{ id: string }>) {
  const relawan = await getRelawan(+id);
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "Edit Relawan" }]} />
      <div className="my-3">
        <FormEdit relawan={relawan} />
      </div>
    </>
  );
}
