"use client";
import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import ReactPaginate from "react-paginate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SearchFilter from "@/components/ui/SearchFilter";
import { Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import { IoEllipsisVertical } from "react-icons/io5";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  onPageChange: (pageIndex: number, pageSize: number) => void;
  pageSize: number;
  totalItems: number;
  auxilliaryData?: any;
  type?: string;
  defaultColumns?: any;
}

export function DataTable<TData, TValue>({    
  columns,
  data,
  pageCount,
  onPageChange,
  pageSize: initialPageSize,
  totalItems,
  auxilliaryData = [],
  type = "",
  defaultColumns = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const containerRefSearchFilter = React.useRef<HTMLTableCellElement>(null);

  // const [columnVisibility, setColumnVisibility] =
  //   React.useState<VisibilityState>({});

  const [visibleColumns, setVisibleColumns] = React.useState(
    columns.map((col: any) => col.accessor)
  );

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const toggleColumn = (accessor: any) => {
    setVisibleColumns((prev) =>
      prev.includes(accessor)
        ? prev.filter((col) => col !== accessor)
        : [...prev, accessor]
    );
  };

  const [rows, setRows] = React.useState<any>(data);

  React.useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);


  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    manualPagination: true,
    onPaginationChange: (newPagination: any) => {
      // const { pageIndex, pageSize } = newPagination;

      setPagination(newPagination);
      onPageChange(newPagination.pageIndex, newPagination.pageSize); // Call onPageChange with updated values
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      pagination,
      // columnVisibility,
    },
  });

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 0, // Reset to first page when page size changes
    }));
    onPageChange(0, newPageSize); // Reset to the first page when page size changes
  };

  // console.log("totalItems>>>", totalItems);
  const [pageIndexStore, setPageIndexStore] = React.useState(totalItems);

  React.useEffect(() => {
    setPageIndexStore(totalItems);
  }, [totalItems]);

  const pageCountTotal = Math.ceil(pageIndexStore / pagination.pageSize);

  // console.log(
  //   "pageCountTotal>>",
  //   pageCountTotal,
  //   "pageIndexStore",
  //   pageIndexStore,
  //   "pagination.pageSize",
  //   pagination.pageSize
  // );

  const handlePageChange = (selectedItem: { selected: number }) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: selectedItem.selected,
    }));
    onPageChange(selectedItem.selected, pagination.pageSize);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLTableRowElement> | any,
    index: number
  ) => {
    e.dataTransfer.setData("rowIndex", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault(); // Allow drop by preventing the default behavior
  };

  const handleDrop = (
    e: React.DragEvent<HTMLTableRowElement>,
    targetIndex: number
  ) => {
    const draggedRowIndex = Number(e.dataTransfer.getData("rowIndex"));
    if (draggedRowIndex !== targetIndex) {
      const updatedRows = [...rows];
      const [draggedRow] = updatedRows.splice(draggedRowIndex, 1); // Remove dragged row
      updatedRows.splice(targetIndex, 0, draggedRow); // Insert at the new index
      setRows(updatedRows); // Update state with the new order
    }
  };

  const filteredColumnArray = table
    .getAllLeafColumns()
    .filter((columnData: any) => {
      return !defaultColumns.includes(columnData.columnDef.headerLabel);
      // console.log("columnData.columnDef.headerLabe>>",columnData.columnDef.headerLabe)
    });
  // console.log("filteredArray>>", filteredColumnArray);

  ///Table Columnn Menus
  const TableMenus = (
    <Menu isLazy closeOnSelect={false}>
      <MenuButton as={Button} variant="ghost" padding={2}>
        <IoEllipsisVertical />
      </MenuButton>
      <Portal>
        <MenuList zIndex={999}>
          {filteredColumnArray.map((column: any, index) => {
            return (
              <MenuItem key={index}>
                <div className="px-1">
                  <label>
                    <input
                      {...{
                        type: "checkbox",
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{" "}
                    {column.columnDef.headerLabel}
                  </label>
                </div>
              </MenuItem>
            );
          })}
        </MenuList>
      </Portal>
    </Menu>
  );

  return (
    <div
      className="rounded-md relative border w-full bg-background h-auto visible  "
      style={{ overflowX: "auto" }}
    >
      <Table className="w-full" style={{ tableLayout: "auto" }}>
        <TableHeader className="bg-accent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              style={{
                textAlign: "left",
                height: "auto",
                verticalAlign: "top",
              }}
            >
              {headerGroup.headers.map((header) => {
                const stickAction: any =
                  (header.id === "actions" && {
                    position: "sticky",
                    right: 0,
                    background: "#f5f5f4", // Ensures it looks consistent when scrolled
                    zIndex: 0, // Keeps it above other columns
                    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
                    paddingRight: "8px",
                    border: "0px",
                    
                  }) ||
                  (header.id === "selector" && {
                    position: "sticky",
                    right: 10,
                    background: "#f5f5f4", // Ensures it looks consistent when scrolled
                    zIndex: 0, // Keeps it above other columns
                    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
                    paddingRight: "8px",
                    border: "0px",
                  }) ||
                  {};

                return (
                  <TableHead
                    key={header.id}
                    style={{
                      textAlign: "left",
                      minWidth: header.getSize(),
                      ...stickAction,
                    }}
                    className="text-left !important"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {header.id === "actions" ? (
                          <div className="flex z-0 items-center justify-center">
                            {" "}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {TableMenus}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <TableRow></TableRow>
          {table.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row: any, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                draggable // Enable dragging
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                style={{ height: "auto" }}
                // style={{
                //   cursor: 'grab',
                //   background: 'white',
                //   border: '1px solid #eaeaea',
                // }}
              >
                {row.getVisibleCells().map((cell: any) => {
                  const stickAction: any =
                    // cell.column.id === "actions"
                    //   ? {
                    //       position: "sticky",
                    //       right: 0,
                    //       zIndex: 1, // Ensure it stays on top
                    //       boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
                    //       background: "#fff", // Ensures it looks consistent when scrolled
                    //       paddingRight: "8px",
                    //     }
                    //   : {};

                    (cell.column.id === "actions" && {
                      position: "sticky",
                      right: 0,
                      background: "#fff", // Ensures it looks consistent when scrolled
                      zIndex: 0, // Keeps it above other columns
                      boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.6)",
                      paddingRight: "8px",
                      border: "0px",
                    }) ||
                    {};

                  if (cell.column.id == "createdAT") {
                    return (
                      <TableCell
                        key={cell.id}
                        style={{ overflow: "visible", whiteSpace: "normal" }}
                        ref={containerRefSearchFilter}
                      >
                        {row.original.createdAt}
                      </TableCell>
                    );
                  }
                  if (cell.column.id == "technicianName") {
                    return (
                      <TableCell
                        key={cell.id}
                        style={{ overflow: "visible", whiteSpace: "normal" }}
                        ref={containerRefSearchFilter}
                      >
                        {row.original.status === "Pending" ? (
                          <SearchFilter
                            defaultValue={cell.getValue()}
                            validate={false}
                            categories={[...auxilliaryData]}
                            onApplyFilters={() => {}}
                            parentId={
                              (type == "task" && row.original?.taskNumber) ||
                              (type == "incident" &&
                                row.original?.incidentNumber) ||
                              (type == "survey" && row.original?.surveyNumber)
                            }
                            type={type}
                            containerRef={containerRefSearchFilter}
                          />
                        ) : (
                          <div>{cell.getValue()}</div>
                        )}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={cell.id} style={{ ...stickAction }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        id="bottom-banner"
        className="w-full sticky bottom-0 inset-s-0 z-0  flex justify-between items-center p-4 border-t border-gray-200 bg-transparent dark:bg-gray-700 dark:border-gray-600"
      >
        <div className="text-sm  ">
          <select
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            className="ml-4 border rounded p-2 "
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center px-4">
          <ReactPaginate className="pagination flex items-center justify-center gap-2"
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCountTotal}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="activeB"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
          />
        </div>
      </div>
    </div>
  );
}
