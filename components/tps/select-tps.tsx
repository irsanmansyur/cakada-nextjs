import { TApi } from "@/utils";
import { TTps } from "@/utils/type/kecamatan";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

export const TpsSelect2024 = ({
  kabId,
  kecId: kecId = null,
  kelId = null,
  tps,
  onChange = () => {},
}: {
  kabId: number;
  kecId?: number | null;
  kelId?: number | null;
  tps: any;
  onChange?: (selectedOption: TTps) => void;
}) => {
  const [{ data, loading }] = useAxios<TApi<TTps[]>>({
    url: `/api/dpt/2024/${kabId}`,
    params: { type: "tps", kecId, kelId },
  });
  const id = Date.now().toString();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <></>;

  return (
    <ReactSelect
      id={id}
      className="basic-single !w-full whitespace-nowrap"
      classNamePrefix="select"
      isLoading={loading}
      isClearable={true}
      isSearchable={true}
      value={tps}
      placeholder="Select Tps"
      onChange={(value) => {
        onChange(value);
      }}
      options={
        data
          ? data["data"].map((op) => ({
              ...op,
              value: op["noTps"],
              label: op["namaTps"],
            }))
          : []
      }
    />
  );
};
