import { useState } from "react";

export type PaginatorType = {
  page: number
  count: number
  rowsPerPage: number
  rowsPerPageOptions: number[]
  PaginateItems: <T>(items: T[]) => T[]
  HandleRowsPerPageChange: (value: string) => void
  HandlePaginationChange: (event: any, page: number) => void
}

export function usePaginator(): PaginatorType
{
  const firstPage = 1;
  const [page, setPage] = useState(firstPage);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5,10,25,50];
  const [count, setCount] = useState(0);

  function HandleRowsPerPageChange(value: string)
  {
    setRowsPerPage(parseInt(value,10)); setPage(1);
  }

  function HandlePaginationChange(event: any, page: number)
  {
    setPage(page);
  }

  function PaginateItems<T>(items: T[]): T[]
  {
    const endIndex = (page * rowsPerPage);
    const startIndex = endIndex - rowsPerPage;
    const newCount = Math.ceil(items.length/rowsPerPage);
    setCount(newCount);

    if(newCount < page && newCount > 0)
      setPage(newCount);

    return items.slice(startIndex,endIndex);
  }

  return {
    page,
    count,
    rowsPerPage,
    rowsPerPageOptions,
    PaginateItems,
    HandleRowsPerPageChange,
    HandlePaginationChange
  }
}
