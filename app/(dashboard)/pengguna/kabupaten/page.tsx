import Breadcrumbs from "@/components/layouts/breadcrumbs";
import TableKabupaten from "./table-kabupaten";
export default async function Home() {
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "List  Relawan Kabupaten" }]} />
      <div className="my-3">
        <TableKabupaten />
      </div>
    </>
  );
}
