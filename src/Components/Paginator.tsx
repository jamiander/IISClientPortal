import { Pagination } from "@mui/material";
import { useState } from "react";

interface PaginatorProps {
  count: number
}

export function Paginator(props: PaginatorProps)
{
  const firstPage = 0;
  const [page, setPage] = useState(firstPage);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5,10,25,50];

  function HandleRowsPerPageChange(value: string)
  {
    setRowsPerPage(parseInt(value,10)); setPage(0);
  }

  function HandlePaginationChange(event: any, page: number)
  {
    setPage(page);
  }

  return (
    <>
      <div className="flex p-2 items-center">
        <p>Rows per page</p>
        <select value={rowsPerPage} onChange={(e) => HandleRowsPerPageChange(e.target.value) }
          className='mx-2 rounded-md border border-gray-200 hover:bg-gray-100'>
          {rowsPerPageOptions.map((limit, index) => {
            return (
              <option key={index} value={limit}>
                {limit}
              </option>
            );
          })}
        </select>
        <div className="flex pl-2">
          <Pagination
            className="my-3"
            count={props.count}
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={HandlePaginationChange} />
        </div>
      </div>
    </>
  )
}
