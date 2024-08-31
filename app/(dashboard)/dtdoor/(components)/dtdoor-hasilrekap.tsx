import { Tab, TabList, Tabs } from "react-aria-components";
import { useState } from "react";
import useAxios from "axios-hooks";
import RekapTable from "./rekap-table";

interface DtdoorHasilRekapProps {
  kabId?: string;
  kecamatan?: string;
  kelurahan?: string;
  tipePemilihId?: string;
  programBantuanId?: string;
  pilihanPilegId?: string;
  dateStart?: string;
  dateEnd?: string;
}

interface MyTabProps {
  id: string;
  children: React.ReactNode;
}

export function DtdoorHasilRekap({
  kabId,
  kecamatan,
  kelurahan,
  tipePemilihId,
  programBantuanId,
  pilihanPilegId,
  dateStart,
  dateEnd,
}: DtdoorHasilRekapProps) {
  const [selectedKey, setSelectedKey] = useState<string>("pilihanPilegId");

  const [{ data, loading }] = useAxios(
    {
      url: `/api/dtdoor/rekap-group/${selectedKey}`,
      baseURL: "",
      params: {
        ...(dateEnd && { dateEnd }),
        ...(dateStart && { dateStart }),
        ...(kabId && { kabId }),
        ...(kecamatan && { kecamatan }),
        ...(kelurahan && { kelurahan }),
        ...(tipePemilihId && { tipePemilihId }),
        ...(programBantuanId && { programBantuanId }),
        ...(pilihanPilegId && { pilihanPilegId }),
      },
    },
    {
      autoCancel: true,
      ssr: false,
    }
  );

  return (
    <div className="border border-slate-300 overflow-hidden bg-white rounded-lg my-10">
      <h2 className="text-center bg-slate-600 text-white font-bold text-2xl py-3 border-b">
        Rekapitulasi Door To Door
      </h2>
      <Tabs
        className="space-y-1 pt-1"
        selectedKey={selectedKey}
        onSelectionChange={(e) => {
          setSelectedKey(e as string);
        }}
      >
        <div className="flex px-2 py-1 overflow-x-auto">
          <TabList
            aria-label="Feeds"
            className="flex gap-2 sm:gap-3 text-slate-950 p-1"
          >
            <MyTab id="pilihanPilegId">Pilihan Pileg</MyTab>
            <MyTab id="tipePemilihId">Tipe Pemilih</MyTab>
            <MyTab id="programBantuanId">Program Bantuan</MyTab>
          </TabList>
        </div>
        <MyRekap loading={loading} data={data?.data} />
      </Tabs>
    </div>
  );
}

function MyRekap({ loading, data }: { loading: boolean; data?: [] }) {
  if (loading || !data) return <p>Loading...</p>;
  return <RekapTable data={data} />;
}

export function MyTab({ id, children }: MyTabProps) {
  return (
    <Tab
      id={id}
      className={({ isSelected }) => `
        px-2 sm:px-4 line-clamp-1 rounded-md py-1 sm:py-2 font-medium text-lg text-center cursor-pointer ring-black outline-none transition-colors focus-visible:ring-2 whitespace-nowrap
        ${isSelected ? "text-white bg-gray-600" : "bg-slate-400"}
      `}
    >
      {children}
    </Tab>
  );
}
