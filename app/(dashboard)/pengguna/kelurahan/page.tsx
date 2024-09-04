import Breadcrumbs from "@/components/layouts/breadcrumbs";
import TableKelurahan from "./table-kabupaten";
export default async function Home() {
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "List  Relawan Kabupaten" }]} />
      <div className="my-3">
        <TableKelurahan />
      </div>
    </>
  );
}
