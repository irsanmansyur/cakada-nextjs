import { getSession } from "@/utils/lib";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = await getSession();
  if (accessToken) redirect("/");

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      {children}
    </section>
  );
}
