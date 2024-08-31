export default function TbodySkeleton({ row = 3, col = 5 }) {
  const rows = Array.from({ length: row }, (_, index) => index + 1);
  const cols = Array.from({ length: col }, (_, index) => index + 1);

  return (
    <>
      {rows.map((row) => {
        return (
          <tr key={row} className="animate-pulse">
            {cols.map((col) => {
              return (
                <td key={col + row} className="p-2 md:p-5 mb-6 ">
                  <div className="rounded h-5 bg-gray-200 min-w-[20px]"></div>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
