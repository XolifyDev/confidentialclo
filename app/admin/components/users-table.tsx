"use client";

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { deleteCategory, getSiteSettings, getUsers } from '@/lib/actions/dbActions';
import { Categories, User } from '@prisma/client';
import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, Check, Ghost, MoreHorizontal, Shield, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const UsersTable = () => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [data, setData] = React.useState<User[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        getUsers().then((e: any) => {
            setData(e)
            // console.log(e: any)
        })
    }

    const columns = [
        {
            accessorKey: "Id",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                    >
                        Id
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => <div className="ml-5">{row.original.id}</div>,
        },
        {
            accessorKey: "Name",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
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
            accessorKey: "Email",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => {
                return <div className="lowercase ml-2">
                    {row.original.email}
                </div>
            },
        },
        {
            accessorKey: "ViewMore",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        View Account
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => {
                return <div className="ml-6">
                    Click&nbsp;
                    <Link target='_blank' className='text-blue-500 hover:underline transition-all' href={`/users/${row.original.id}`}>
                        here
                    </Link>
                </div>
            },
        },
        {
            accessorKey: "Admin",
            header: ({ column }: { column: any }) => {
                return (
                    <Button
                        variant="ghost"
                        className='flex flex-row items-center gap-2'
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <MoreHorizontal />
                    </Button>
                )
            },
            cell: ({ row }: { row: any }) => {
                return <div className="lowercase">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="ghost"
                            // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side='right'>
                            {row.original.isAdmin ? (

                                <DropdownMenuItem onClick={() => { }} className="cursor-pointer flex flex-row items-center gap-2">
                                    Remove Admin
                                    <Trash height={20} color="red" />
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => { }} className="cursor-pointer flex flex-row items-center gap-2">
                                    Make Admin
                                    <Shield />
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            },
        },
        //   {
        //     id: "actions",
        //     enableHiding: false,
        //     cell: ({ row} : { row: any }) => {
        //       const payment = row.original

        //       return (
        //         <DropdownMenu>
        //           <DropdownMenuTrigger asChild>
        //             <Button variant="ghost" className="h-8 w-8 p-0">
        //               <span className="sr-only">Open menu</span>
        //               <MoreHorizontal className="h-4 w-4" />
        //             </Button>
        //           </DropdownMenuTrigger>
        //           <DropdownMenuContent align="end">
        //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //             <DropdownMenuItem
        //               onClick={() => navigator.clipboard.writeText(payment.id)}
        //             >
        //               Copy payment ID
        //             </DropdownMenuItem>
        //             <DropdownMenuSeparator />
        //             <DropdownMenuItem>View customer</DropdownMenuItem>
        //             <DropdownMenuItem>View payment details</DropdownMenuItem>
        //           </DropdownMenuContent>
        //         </DropdownMenu>
        //       )
        //     },
        //   },
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

export default UsersTable