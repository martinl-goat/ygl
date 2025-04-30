import { useCallback } from "react";
import classes from "./Paginator.module.css";

interface PaginatorProps {
  pageSize: number;
  messagesCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

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
      >
        &larr;&larr;
      </button>
      <button
        type="button"
        onClick={paginatePrevious}
        disabled={currentPage === 0}
      >
        &larr;
      </button>
      {currentPage + 1} / {pages}
      <button
        type="button"
        onClick={paginateNext}
        disabled={currentPage === pages - 1}
      >
        &rarr;
      </button>
      <button
        type="button"
        onClick={paginateLast}
        disabled={currentPage === pages - 1}
      >
        &rarr;&rarr;
      </button>
      Total messages: {messagesCount}
    </div>
  );
}

export { Paginator };
