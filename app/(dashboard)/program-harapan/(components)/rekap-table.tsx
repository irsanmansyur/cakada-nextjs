export type TRekapTableProps = {
	id: number;
	jumlahDtdoor: number;
	jumlahWajibPilih: number;
	key: "A";
};
export default function RekapTable({ data }: { data: [] }) {
	let totalJumlahDtdoor = 0;
	let totalJumlahWajibPilih = 0;
	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead>
					<tr className="text-center bg-gray-600 font-bold text-slate-100 text-lg">
						<th>Jenis</th>
						<th>Kunjungan</th>
						<th>Potensi</th>
					</tr>
				</thead>
				<tbody>
					{data.map((d: TRekapTableProps, i) => {
						if (i == 0) {
							totalJumlahDtdoor = 0;
							totalJumlahWajibPilih = 0;
						}
						totalJumlahDtdoor += d.jumlahDtdoor;
						totalJumlahWajibPilih += d.jumlahWajibPilih;
						return (
							<tr key={d.id} className="text-center">
								<td>{d.key}</td>
								<td>{d.jumlahDtdoor}</td>
								<td>{d.jumlahWajibPilih}</td>
							</tr>
						);
					})}
					<tr className="text-center bg-slate-800 text-white font-bold">
						<td>Total</td>
						<td>{totalJumlahDtdoor}</td>
						<td>{totalJumlahWajibPilih}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
