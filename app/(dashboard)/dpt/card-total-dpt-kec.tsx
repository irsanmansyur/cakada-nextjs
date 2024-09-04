import { MdiPeopleGroup } from "@/commons/icons/MdiPeopleGroup";
import CardItem from "@/components/cards/card-total";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

export default function CardDptTotalKec({
  kabId,
  kecId,
  kecNama = "-",
}: {
  kabId: number;
  kecId?: number | null;
  kecNama: string;
}) {
  const [total, setTotal] = useState(0);
  const [{ data, loading }] = useAxios(
    {
      url: `/api/dpt/total/` + kabId,
      params: { kecId },
    },
    { autoCancel: true }
  );
  useEffect(() => {
    if (data) setTotal(data["data"]);
    return () => {
      setTotal(0);
    };
  }, [data]);
  return (
    <>
      <CardItem
        loading={loading}
        className="card-primary-blue"
        total={total}
        icon={<MdiPeopleGroup className="w-8 h-8" />}
        text={`${kecNama}`}
      />
    </>
  );
}
