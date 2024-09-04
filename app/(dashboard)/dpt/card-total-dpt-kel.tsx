import CardItem from "@/components/cards/card-total";
import { MdiPeopleGroup } from "@/components/icons/MdiPeopleGroup";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";

export default function CardDptTotalKel({
  kabId,
  kelId,
  kelNama = "-",
}: {
  kabId: number;
  kelId: number;
  kelNama: string;
}) {
  const [total, setTotal] = useState(0);
  const [{ data, loading }] = useAxios(
    {
      url: `/api/dpt/total/` + kabId,
      params: { kelId },
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
        className="card-primary-success"
        total={total}
        icon={<MdiPeopleGroup className="w-8 h-8" />}
        text={`${kelNama}`}
      />
    </>
  );
}
