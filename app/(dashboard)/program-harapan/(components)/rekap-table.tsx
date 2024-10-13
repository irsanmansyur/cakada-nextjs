export type TRekapTableProps = {
  id: number;
  jumlahDtdoor: number;
  jumlahWajibPilih: number;
  key: "A";
};
export default function RekapTable({ data }: { data: [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="text-center">
            <th>Jenis</th>
            <th>Jumlah Kunjungan</th>
            <th>Potensi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d: TRekapTableProps) => (
            <tr key={d.id} className="text-center">
              <td>{d.key}</td>
              <td>{d.jumlahDtdoor}</td>
              <td>{d.jumlahWajibPilih}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
