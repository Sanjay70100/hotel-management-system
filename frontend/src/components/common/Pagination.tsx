import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) => {
  if (itemsPerPage <= 0 || totalItems <= 0) {
    return null;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    totalPages
  );

  const visiblePages = Math.max(
    1,
    Math.floor(maxVisiblePages)
  );

  const halfRange = Math.floor(visiblePages / 2);

  let startPage = Math.max(
    1,
    safeCurrentPage - halfRange
  );

  let endPage = Math.min(
    totalPages,
    startPage + visiblePages - 1
  );

  startPage = Math.max(
    1,
    endPage - visiblePages + 1
  );

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const startItem =
    (safeCurrentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(
    safeCurrentPage * itemsPerPage,
    totalItems
  );

  return (
    <nav
      className="pagination"
      aria-label="Table pagination"
    >
      <p className="pagination-info" aria-live="polite">
        Showing <strong>{startItem}</strong>–
        <strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong> records
      </p>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-button pagination-previous"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Go to previous page"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              type="button"
              className="pagination-button"
              onClick={() => onPageChange(1)}
              aria-label="Go to page 1"
            >
              1
            </button>

            {startPage > 2 && (
              <span
                className="pagination-ellipsis"
                aria-hidden="true"
              >
                …
              </span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={[
              "pagination-button",
              page === safeCurrentPage
                ? "pagination-button-active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={
              page === safeCurrentPage
                ? "page"
                : undefined
            }
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span
                className="pagination-ellipsis"
                aria-hidden="true"
              >
                …
              </span>
            )}

            <button
              type="button"
              className="pagination-button"
              onClick={() => onPageChange(totalPages)}
              aria-label={`Go to page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="pagination-button pagination-next"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          aria-label="Go to next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;