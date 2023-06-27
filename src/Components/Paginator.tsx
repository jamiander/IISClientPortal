import { Pagination } from "@mui/material";
import { PaginatorType } from "../Services/usePaginator";

interface PaginatorProps {
  paginator: PaginatorType
  disabled?: boolean
}

export function Paginator(props: PaginatorProps)
{

  return (
    <>
      <div className="flex p-2 items-center">
        <p>Rows per page</p>
        <select disabled={props.disabled} value={props.paginator.rowsPerPage} onChange={(e) => props.paginator.HandleRowsPerPageChange(e.target.value) }
          className='mx-2 rounded-md border border-gray-200 enabled:hover:bg-gray-100'>
          {props.paginator.rowsPerPageOptions.map((limit, index) => {
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
            count={props.paginator.count}
            page={props.paginator.page}
            variant="outlined"
            shape="rounded"
            onChange={props.paginator.HandlePaginationChange} 
            disabled={props.disabled}/>
        </div>
      </div>
    </>
  )
}
