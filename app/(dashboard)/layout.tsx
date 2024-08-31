import { getSession } from "@/utils/lib";
import Footer from "../../components/layouts/footer";
import Navbar from "../../components/layouts/navbar";
import Sidebar from "../../components/layouts/sidebar";
import { redirect } from "next/navigation";
import axios from "axios";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = await getSession();
  if (!accessToken) redirect("/login");

  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar accessToken={accessToken} />
      <div className="flex flex-col justify-between w-full overflow-auto">
        <div className="w-full">
          <Navbar />
          <main className="p-2 sm:p-4 bg-slate-100">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
