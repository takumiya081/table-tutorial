'use client';
import type {PaginationState, Updater} from '@tanstack/react-table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  isFunction,
  useReactTable,
} from '@tanstack/react-table';
import type {Person} from '@/data';
import {useCallback, useMemo, useState} from 'react';
import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {fetcher} from './fetcher';
import {css} from '@/styled-system/css';

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <p>{info.getValue()}</p>,
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
];

interface PageInfo {
  index: number;
  size: number;
}

export default function Home() {
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    index: 0,
    size: 40,
  });

  const result = useQuery({
    queryKey: ['data', pageInfo],
    queryFn: () => fetcher(pageInfo),
    placeholderData: keepPreviousData,
  });

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: pageInfo.index,
      pageSize: pageInfo.size,
    }),
    [pageInfo.index, pageInfo.size],
  );

  const handleChangePage = useCallback(
    (updater: Updater<PaginationState>) => {
      const nextState = isFunction(updater) ? updater(pagination) : updater;
      setPageInfo({
        index: nextState.pageIndex,
        size: nextState.pageSize,
      });
    },
    [pagination],
  );

  const table = useReactTable({
    data: result.data?.nodes ?? [],
    columns,
    state: {
      pagination,
    },
    // NOTE: react dispatch functionに型を合わされているので、独自で関数を作ると逆にややこしくなる。
    // https://github.com/TanStack/table/discussions/3899
    onPaginationChange: handleChangePage,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
      {result.isLoading ? <p>loading</p> : null}
      <div>
        <button type="button" className={css({cursor: 'pointer'})} onClick={table.previousPage}>
          {'<'}
        </button>
        <button type="button" className={css({cursor: 'pointer'})} onClick={table.nextPage}>
          {'>'}
        </button>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div>
        <button type="button" className={css({cursor: 'pointer'})} onClick={table.previousPage}>
          {'<'}
        </button>
        <button type="button" className={css({cursor: 'pointer'})} onClick={table.nextPage}>
          {'>'}
        </button>
      </div>
    </>
  );
}
