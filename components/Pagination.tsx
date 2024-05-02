import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: Function;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    // If total pages are less than or equal to 5, display all pages
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // If current page is less than or equal to 3, display first 5 pages
      if (currentPage <= 3) {
        for (let i = 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        // Add '...' and last page button
        pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      }
      // If current page is greater than or equal to total pages - 2, display last 5 pages
      else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        // Add '...' and last 5 pages
        pageNumbers.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
      // Otherwise, display current page and 2 pages before and after it
      else {
        pageNumbers.push(1);
        pageNumbers.push(-1);
        // Add '...' and 2 pages before and after current page
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const renderPagination = () => {
    const pageNumbers = getPageNumbers();

    return (
      <div className="join">
        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            className={`join-item btn btn-sm ${
              pageNumber > 0 ? "" : "btn-disabled"
            } ${pageNumber === currentPage ? "btn-active" : ""}`}
            onClick={() => {
              if (pageNumber > 0) onPageChange(pageNumber);
            }}
          >
            {pageNumber > 0 ? pageNumber : "..."}
          </button>
        ))}
      </div>
    );
  };

  return renderPagination();
};

export default Pagination;
