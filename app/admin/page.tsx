"use client";

import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "./components/date-range-picker"
import { MainNav } from "./components/main-nav"
import { Overview } from "./components/overview-"
import { RecentSales } from "./components/recent-sales"
import { Search } from "./components/search"
import TeamSwitcher from "./components/team-switcher"
import { UserNav } from "./components/user-nav"
import { config } from "@/config"
import { ProductsTable } from "./components/products-table"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormEvent, useState } from "react"
import { Icons } from "@/components/icons";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const metadata: Metadata = {
    title: `Admin Dashboard - ${config.siteInfo.name}`,
    description: `Admin Dashboard for ${config.siteInfo.name}`,
}

export default async function DashboardPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    // const { user } = useSession();

    // console.log(user);

    const onSubmit = async (e: FormEvent) => {
        
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <div className="md:hidden">
                    <Image
                        src="/examples/dashboard-light.png"
                        width={1280}
                        height={866}
                        alt="Dashboard"
                        className="block dark:hidden"
                    />
                    <Image
                        src="/examples/dashboard-dark.png"
                        width={1280}
                        height={866}
                        alt="Dashboard"
                        className="hidden dark:block"
                    />
                </div>
                <div className="hidden flex-col md:flex">
                    {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
            </div>
          </div>
        </div> */}
                    <div className="flex-1 space-y-4 p-8 pt-6">
                        <div className="flex items-center justify-between space-y-2">
                            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        </div>
                        <Tabs defaultValue="overview" className="space-y-4">
                            <div className="flex w-full flex-row justify-between">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="analytics">
                                        Analytics
                                    </TabsTrigger>
                                    <TabsTrigger value="orders">
                                        Orders
                                    </TabsTrigger>
                                    <TabsTrigger value="products">
                                        Products
                                    </TabsTrigger>
                                    <TabsTrigger value="users">
                                        Users
                                    </TabsTrigger>
                                </TabsList>
                                <Button value="sitesettings" onClick={() => setShowDialog(true)} className="flex flex-row items-center gap-2">
                                    Site Settings
                                    <Pencil2Icon fontSize={25} fontWeight={600} />
                                </Button>
                            </div>
                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Revenue
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">$45,231.89</div>
                                            <p className="text-xs text-muted-foreground">
                                                +20.1% from last month
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Subscriptions
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">+2350</div>
                                            <p className="text-xs text-muted-foreground">
                                                +180.1% from last month
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                                <path d="M2 10h20" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">+12,234</div>
                                            <p className="text-xs text-muted-foreground">
                                                +19% from last month
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Active Now
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="h-4 w-4 text-muted-foreground"
                                            >
                                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">+573</div>
                                            <p className="text-xs text-muted-foreground">
                                                +201 since last hour
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <Card className="col-span-4">
                                        <CardHeader>
                                            <CardTitle>Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pl-2">
                                            <Overview />
                                        </CardContent>
                                    </Card>
                                    <Card className="col-span-3">
                                        <CardHeader>
                                            <CardTitle>Recent Sales</CardTitle>
                                            <CardDescription>
                                                You made 265 sales this month.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <RecentSales />
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            <TabsContent value="products" className="space-y-4">
                                <ProductsTable />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Site Settings</DialogTitle>
                        {/* <DialogDescription>
                            Add a new product to your store!
                        </DialogDescription> */}
                    </DialogHeader>
                    <form encType="multipart/form-data" onSubmit={onSubmit}>
                        <div>
                            <div className="space-y-4 py-2">
                                <h1 className="border-b">
                                    Navbar
                                </h1>
                                <div className="space-y-2">
                                    <Label htmlFor="mid-image">Middle Image</Label>
                                    <Input
                                        disabled={loading}
                                        required
                                        id="mid-image" placeholder="Image LINK" />
                                </div>
                                <h1 className="border-b">
                                    Home Page
                                </h1>
                                <div className="space-y-2">
                                    <Label htmlFor="main-image">Main Image</Label>
                                    <Input
                                        disabled={loading}
                                        required
                                        id="main-image" placeholder="Image LINK" />
                                </div>
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
        </>
    )
}