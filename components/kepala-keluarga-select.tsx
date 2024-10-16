import axios from "axios";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { MdiPeopleGroup } from "./icons/MdiPeopleGroup";

type OptionType = {
  value: string;
  label: React.ReactNode;
  [key: string]: any;
};

type KepalaKeluargaSelectProps = {
  kabId: number;
  kelId?: number;
  kecId?: number;
  limit?: number;
  onChange?: (value: OptionType | null) => void;
  value?: OptionType | null;
};

export default function KepalaKeluargaSelect({
  kabId,
  kelId,
  kecId,
  limit = 20,
  onChange = (v) => v,
  value: initialValue,
}: KepalaKeluargaSelectProps) {
  const id = Date.now().toString();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [value, setValue] = useState<OptionType | null>(initialValue || null);
  const [inputValue, setInputValue] = useState<string>("");
  const [{ loading }] = useAxios(
    { url: process.env.NEXT_PUBLIC_DOMAIN + `/dpt/${kabId}` },
    { manual: true },
  );

  const loadOptions = async (input: any, prevOptions: any, { page }: any) => {
    const params: Record<string, any> = {
      page,
      limit,
    };
    if (kecId) params.kecId = kecId;
    if (kelId) params.kelId = kelId;
    if (input) params.nama = input;

    const { data } = await axios.get(`/api/dpt/${kabId}`, { params });

    return {
      options: data.data.map(({ isKk, ...option }: any) => ({
        ...option,
        label: (
          <div className="flex flex-col bg-gray-50 text-gray-800 p-3 hover:bg-sky-500 hover:text-white relative">
            <div className="flex gap-2 items-center">
              <span>{option.nama}</span>
              {isKk !== false && <MdiPeopleGroup className="w-5 h-5" />}
            </div>
            <small>Umur: {option.usia}</small>
            <small>Kel: {option.namaKel}</small>
            <small>RT/RW: {`${option.rt}/${option.rw}`}</small>
          </div>
        ),
      })),
      hasMore: data.data.length >= limit,
    };
  };

  const onChangeDefault = (v: OptionType | null) => {
    if (v) {
      setValue({ ...v, label: v.nama });
      onChange(v);
    } else {
      setValue(null);
      onChange(null);
    }
  };

  useEffect(() => {
    if (!initialValue) return;
    axios.get(`/api/dpt/details/${kabId}/${initialValue}`).then(({ data }) => {
      if (data) {
        setValue({
          ...data.data.nama,
          label: data.data.nama,
        });
      }
    });
  }, [initialValue, kabId]);

  // Handler for input change with delay
  let idTimeout: ReturnType<typeof setTimeout>;
  const onInputChange = (inputValueNew: string) => {
    if (idTimeout) clearTimeout(idTimeout);
    idTimeout = setTimeout(() => {
      setInputValue(inputValueNew + " ");
    }, 2000);
    setInputValue(inputValueNew);
  };
  if (!isMounted) return <></>;
  return (
    <AsyncPaginate
      key={`${kabId || "_"}-${kecId || "_"}-${kelId || "_"}`}
      value={value}
      isClearable={true}
      placeholder="Select Kepala Keluarga"
      onChange={onChangeDefault}
      className={"basic-single !w-full whitespace-nowrap"}
      loadOptions={loadOptions}
      isLoading={loading}
      getOptionLabel={(v: OptionType) => v.label as string}
      additional={{
        page: 1,
      }}
      onInputChange={onInputChange}
    />
  );
}
