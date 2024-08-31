import { TApi } from "@/utils";
import { TKelurahan } from "@/utils/type/kecamatan";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import Select from "react-select";

export const KelurahanSelect2024 = ({
  kabId,
  kecId,
  kelurahan,
  onChange,
}: {
  kabId: number;
  kecId?: number;
  kelurahan: any;
  onChange?: (selectedOption: TKelurahan) => void;
}) => {
  const [{ data, loading }] = useAxios<TApi<TKelurahan[]>>({
    url: `/api/kelurahan`,
    params: {
      tahun: 2024,
      ...(kabId ? { kabId } : {}),
      ...(kecId ? { kecId } : {}),
    },
  });
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <></>;
  return (
    <Select
      placeholder="Select Kelurahan"
      className="basic-single !w-full whitespace-nowrap"
      classNamePrefix="select"
      isLoading={loading}
      isClearable={true}
      isSearchable={true}
      value={kelurahan}
      onChange={(value) => {
        if (typeof onChange !== "function") return;
        onChange(value);
      }}
      options={
        data
          ? data["data"].map((op) => ({
              ...op,
              value: op["wilId"],
              label: op["kelNama"],
            }))
          : []
      }
    />
  );
};
