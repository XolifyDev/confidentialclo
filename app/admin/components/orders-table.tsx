"use client";

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { deleteCategory, getOrdersWithUser, getSiteSettings } from '@/lib/actions/dbActions';
import { Categories, Orders, User } from '@prisma/client';
import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface OrderNewInterface extends Orders {
    user: User
}

const OrdersTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [data, setData] = React.useState<OrderNewInterface[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        fetch('/api/orders', {
            method: "GET"
        }).then(res => res.json()).then(e => {
            setData(e.orders);
        })
    }

    const columns = [
        {
            accessorKey: "ID",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >

                        #
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => <div className="ml-5">{row.original.id}</div>,
        },
        {
            accessorKey: "User",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        User
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => {
                return <div className="ml-2">
                    {!row.original.name ? `${row.original.user.firstName} ${row.original.user.lastName}` : row.orginal.name}
                </div>
            },
        },
        {
            accessorKey: "Url",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Url
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => {
                return <div className="ml-2">
                    <Link target='_blank' className='text-blue-500 hover:underline transition-all' href={`/orders/${row.original.id}`}>
                        View Order
                    </Link>
                </div>
            },
        },
        {
            accessorKey: "Status",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => {
                return <div className="ml-2">
                    {row.original.status}
                </div>
            },
        },
    ]

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                {/* <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div> */}
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OrdersTable