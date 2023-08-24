"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircleIcon, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { deleteProduct, getProducts, getSiteSettings } from "@/lib/actions/dbActions"
import { Categories, Products } from "@prisma/client"
import { useRouter } from "next/navigation"
import { isMobile } from "react-device-detect";
import * as rdd from 'react-device-detect';

rdd.isMobile = true;

export function ProductsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [data, setData] = React.useState<Products[]>([]);
    const [showDialog, setShowDialog] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imgsSrc, setImgsSrc] = React.useState<any>("");
    const [name, setProductName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [price, setPrice] = React.useState<string>("");
    const [url, setUrl] = React.useState<string>("");
    const [sizes, setSizes] = React.useState<string>("");
    const [mainImage, setProductMainImage] = React.useState<string>("");
    const [images, setImages] = React.useState<string>("");
    const { toast } = useToast();
    const [siteSettings, setSiteSettings] = React.useState<any>({});
    const [selectedCat, setSelectedCat] = React.useState<any>({});
    const router = useRouter();

    React.useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        setData(await getProducts());
        setSiteSettings(await getSiteSettings());
    };

    const columns = [
        {
            accessorKey: "Name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="ml-2">{row.original.name}</div>,
        },
        {
            accessorKey: "Description",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Description
                    </Button>
                )
            },
            cell: ({ row }) => <div className="">{row.original.description}</div>,
        },
        {
            accessorKey: "Price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                    </Button>
                )
            },
            cell: ({ row }) => { return <div className="lowercase ml-5">${row.original.price}</div> },
        },
        {
            accessorKey: "actionButtons",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                    // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <MoreHorizontal />
                    </Button>
                )
            },
            cell: ({ row }) => {
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
                        <DropdownMenuContent side="right">
                            <DropdownMenuItem onClick={async () => {
                                const product = await deleteProduct(row.original.id);
                                console.log(product);
                                // @ts-ignore
                                if (product.error) {
                                    return toast({
                                        // @ts-ignore
                                        description: product.error.message,
                                        variant: "destructive"
                                    })
                                }

                                toast({
                                    description: `Deleted product ${row.original.name}`,
                                    variant: "default"
                                });
                                await getData();
                            }} className="cursor-pointer">
                                Delete
                                <DropdownMenuShortcut>
                                    <Trash height={20} color="red" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            },
        },
        //   {
        //     id: "actions",
        //     enableHiding: false,
        //     cell: ({ row }) => {
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

    const fileOnChange = (changeEvent: any) => {
        for (let file of changeEvent.target.files) {
            setImgsSrc(file)
            console.log(file);
        }
    }

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        fetch('/api/products/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, description, url, sizes, mainImage: imgsSrc, images, price, selectedCat })
        }).then(async oldRes => await oldRes.json()).then(async res => {
            if (res.error) {
                setLoading(false);
                return toast({
                    description: res.error.message,
                    variant: "destructive"
                })
            } else {
                toast({
                    description: `Product ${res.product.name} was created!`,
                    variant: "default"
                });

                setShowDialog(false);
                setLoading(false);
                await getData();
            }
        })
    }

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <div className="w-full">
                <div className={`flex ${isMobile ? "flex-col gap-2" : "justify-between"} w-full py-4`}>
                    <div className={`${isMobile ? "flex flex-col gap-2" : null}`}>
                        <Button variant="outline" onClick={() => setShowDialog(true)}>
                            Add a product <PlusCircleIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="">
                                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Input
                        placeholder="Filter products..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a product</DialogTitle>
                    <DialogDescription>
                        Add a new product to your store!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} encType="multipart/form-data">
                    <div>
                        <div className="space-y-4 py-2 pb-4">
                            <div className="flex flex-row space-x-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product name</Label>
                                    <Input
                                        disabled={loading}
                                        required
                                        id="name" value={name} onChange={(e) => setProductName(e.target.value)} placeholder="Baggy T-Shirt" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Product price</Label>
                                    <Input
                                        disabled={loading}
                                        required
                                        id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="100" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Product Description</Label>
                                <Textarea
                                    disabled={loading}
                                    required
                                    id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A Baggy T-Shirt for your everyday needs." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url">Product Site URL (/store/baggy-tshirt)</Label>
                                <Input id="url"
                                    disabled={loading}
                                    required
                                    value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Acme Inc." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Product sizes (Seperate with commas. ",")</Label>
                                <Input id="name"
                                    disabled={loading}
                                    required
                                    value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="xl, lg, sm" />
                            </div>
                            {/* <div className="space-y-2">
                                <Label htmlFor="image">Main Product Image</Label>
                                <Input id="image"
                                    disabled={loading}
                                    required
                                    onChange={fileOnChange} type="file" />
                            </div> */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Main Product Image</Label>
                                <Input id="name"
                                    disabled={loading}
                                    required
                                    value={imgsSrc} onChange={(e) => setImgsSrc(e.target.value)} placeholder="xl, lg, sm" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="images">Product Images (Seperate with commas)</Label>
                                <Textarea id="images"
                                    disabled={loading}
                                    required
                                    value={images} onChange={(e) => setImages(e.target.value)} placeholder="https://cdn.xolify.store/u/xolifycdn/Qw2twXczYX.png,
                            https://cdn.xolify.store/u/xolifycdn/Qw2twXczYX.png,
                            https://cdn.xolify.store/u/xolifycdn/Qw2twXczYX.png" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan">Categories</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">Select Categories{Object.values(selectedCat).filter((e) => e.checked === true).length !== 0 && " | "}{Object.values(selectedCat).filter((e) => e.checked === true).map((e) => { return `${e.name}`; }).join(", ")}</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>Categories</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {siteSettings.categories && siteSettings.categories.map((cat: Categories) => (
                                            <DropdownMenuCheckboxItem
                                                checked={selectedCat[cat.id]?.checked || false}
                                                onCheckedChange={(e) => {
                                                    setSelectedCat({
                                                        ...selectedCat,
                                                        [cat.id]: {
                                                            ...cat,
                                                            checked: e
                                                        }
                                                    })
                                                }}
                                            >
                                                {cat.name}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {/* <div className="space-y-2">
                            <Label htmlFor="plan">Subscription plan</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">
                                        <span className="font-medium">Free</span> -{" "}
                                        <span className="text-muted-foreground">
                                            Trial for two weeks
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="pro">
                                        <span className="font-medium">Pro</span> -{" "}
                                        <span className="text-muted-foreground">
                                            $9/month per user
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            disabled={loading}
                            variant="outline" onClick={() => setShowDialog(false)}>
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            type="submit">
                            {loading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
