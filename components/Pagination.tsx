import Link from "next/link";
import { SolarAltArrowRightBroken } from "./icons/arrow-right";
import { SolarAltArrowLeftBroken } from "./icons/arrow-left";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
}) => {
  const generatePaginate = () => {
    const pageRange = 3; // Distance of pages shown before and after the current page
    const ellipsis = "...";
    const pagesToShow = [];
    for (let i = 1; i <= totalPages; i++) {
      const isFirstPage = i === 1;
      const isLastPage = i === totalPages;
      const isWithinRange =
        i >= currentPage - pageRange && i <= currentPage + pageRange;

      if (isFirstPage || isLastPage || isWithinRange) {
        pagesToShow.push(i);
      }
    }

    const paginatedPages = [];
    let prevPage = null;

    for (const page of pagesToShow) {
      const isPageJump = prevPage !== null && page - prevPage !== 1;

      if (isPageJump) {
        paginatedPages.push(ellipsis);
      }
      paginatedPages.push(page);
      prevPage = page;
    }
    return paginatedPages;
  };
  const pages = generatePaginate();

  return (
    <nav className="flex justify-center mt-4">
      <div className="inline-flex items-center gap-2 overflow-x-auto pb-2">
        {currentPage > 1 && (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            title="halaman sebelumnya"
            className={
              "px-3 py-2 ml-0 leading-tight rounded-l-lg  flex items-center gap-1"
            }
          >
            <SolarAltArrowLeftBroken className="w-5 h-5" />
            <span className="hidden sm:flex">Previous</span>
          </Link>
        )}
        {pages.map((number, i) => {
          if (!Number(number))
            return (
              <span key={`${number} - ${i}`} className="">
                ...
              </span>
            );
          return (
            <Link
              key={number}
              href={`${basePath}?page=${number}`}
              title={`page ${number}`}
              className={`px-3 py-2 leading-tight rounded-lg ${
                currentPage === number
                  ? "bg-theme text-white"
                  : "text-theme hover:bg-theme/75 hover:text-white"
              }`}
            >
              {number}
            </Link>
          );
        })}
        {currentPage < totalPages && (
          <Link
            href={`${basePath}?page=${currentPage}`}
            title="halaman Selanjutnya"
            className="px-3 py-2 ml-0 leading-tight rounded-l-lg  flex items-center gap-1"
          >
            <span className="hidden sm:flex">Next</span>
            <SolarAltArrowRightBroken className="w-5 h-5" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
