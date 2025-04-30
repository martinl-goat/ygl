import { useCallback } from "react";
import classes from "./Paginator.module.css";

interface PaginatorProps {
  pageSize: number;
  messagesCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

/**
 * A classic paginator with first, previous, next, and last buttons, showing
 * the current page, the page count, and the total messages count.
 * @param currentPage - The current page index (starts at zero).
 * @param setCurrentPage - A React `useState` setter for the current page index.
 * @param pageSize - The page size, e.g. 20.
 * @param messagesCount - The total number of messages.
 */
function Paginator({
  currentPage,
  setCurrentPage,
  pageSize,
  messagesCount,
}: PaginatorProps) {
  const pages = Math.ceil(messagesCount / pageSize);

  const paginateFirst = useCallback(() => {
    setCurrentPage(0);
  }, [setCurrentPage]);
  const paginatePrevious = useCallback(() => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  }, [setCurrentPage, currentPage]);
  const paginateNext = useCallback(() => {
    setCurrentPage(Math.min(currentPage + 1, pages - 1));
  }, [setCurrentPage, currentPage, pages]);
  const paginateLast = useCallback(() => {
    setCurrentPage(pages - 1);
  }, [setCurrentPage, pages]);

  console.log("Paginator: rendering, message count", messagesCount);

  return (
    <div className={classes.paginator}>
      <button
        type="button"
        onClick={paginateFirst}
        disabled={currentPage === 0}
        data-testid="first"
      >
        &larr;&larr;
      </button>
      <button
        type="button"
        onClick={paginatePrevious}
        disabled={currentPage === 0}
        data-testid="previous"
      >
        &larr;
      </button>
      <span data-testid="position">
        {currentPage + 1} / {pages}
      </span>
      <button
        type="button"
        onClick={paginateNext}
        disabled={currentPage === pages - 1}
        data-testid="next"
      >
        &rarr;
      </button>
      <button
        type="button"
        onClick={paginateLast}
        disabled={currentPage === pages - 1}
        data-testid="last"
      >
        &rarr;&rarr;
      </button>
      <span data-testid="total">Total messages: {messagesCount}</span>
    </div>
  );
}

export { Paginator };
