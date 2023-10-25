/* eslint-disable react/no-unstable-nested-components */
'use client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {getData, type Person} from '@/data';
import {TableVirtuoso} from 'react-virtuoso';
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

const data = getData(5000);

export default function Home() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const {rows} = table.getRowModel();

  return (
    <div>
      <TableVirtuoso
        style={{height: '200px'}}
        totalCount={rows.length}
        components={{
          Table: ({style, ...props}) => (
            <table style={{...style, width: '100%', tableLayout: 'fixed'}} {...props} />
          ),
          TableRow: (props) => {
            const index = props['data-index'];
            const row = rows[index];

            return (
              <tr {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{padding: '6px'}}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          },
        }}
        fixedHeaderContent={() => {
          return table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className={css({bg: 'gray.200', p: 4})}
                      style={{width: header.getSize()}}
                    >
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          });
        }}
      />
    </div>
  );
}
