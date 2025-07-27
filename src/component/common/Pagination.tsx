import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  loading?: boolean;
  className?: string;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems, 
  loading = false, 
  className = "",
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 25, 50, 100]
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return (
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-4 sm:px-6 bg-white border-t border-gray-200 ${className}`}>
        <div className="flex flex-col sm:flex-row items-center gap-4 order-2 sm:order-1">
          <div className="text-sm text-gray-700">
            Menampilkan <span className="font-medium text-[#1B3A6D]">{startItem}</span> - <span className="font-medium text-[#1B3A6D]">{endItem}</span> dari <span className="font-medium text-[#1B3A6D]">{totalItems}</span> data
          </div>
          
          {onItemsPerPageChange && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                disabled={loading}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent disabled:opacity-50"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span>per halaman</span>
            </div>
          )}
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
          <button
            disabled={true}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
          >
            <FiChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            disabled={true}
            className="px-2 sm:px-3 py-2 text-sm font-medium rounded-lg bg-[#1B3A6D] text-white shadow-sm cursor-default"
          >
            1
          </button>

          <button
            disabled={true}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight size={16} />
          </button>
        </nav>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-4 sm:px-6 bg-white border-t border-gray-200 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4 order-2 sm:order-1">
        <div className="text-sm text-gray-700">
          Menampilkan <span className="font-medium text-[#1B3A6D]">{startItem}</span> - <span className="font-medium text-[#1B3A6D]">{endItem}</span> dari <span className="font-medium text-[#1B3A6D]">{totalItems}</span> data
        </div>
        
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              disabled={loading}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A6D] focus:border-transparent disabled:opacity-50"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>per halaman</span>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-[#1B3A6D] hover:border-[#1B3A6D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 sm:px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`px-2 sm:px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page ? "bg-[#1B3A6D] text-white shadow-sm" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-[#1B3A6D] hover:border-[#1B3A6D]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="flex items-center gap-1 px-2 sm:px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-[#1B3A6D] hover:border-[#1B3A6D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;

