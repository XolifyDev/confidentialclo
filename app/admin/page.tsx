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
import { FormEvent, useEffect, useState } from "react"
import { Icons } from "@/components/icons";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { createCategory, getSiteSettings, updateSiteSettings } from "@/lib/actions/dbActions";
import { MenuIcon, Plus, Settings, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import CategoriesTable from "./components/categories-table";

export const metadata: Metadata = {
    title: `Admin Dashboard - ${config.siteInfo.name}`,
    description: `Admin Dashboard for ${config.siteInfo.name}`,
}

export default function DashboardPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [showCateogryDialog, setShowCatDialog] = useState<boolean>(false);
    const [navbarMiddleImage, setNavbarMiddleImage] = useState<string>("");
    const [mainImageHome, setMainImageHome] = useState<string>("");
    const [mainImageDropLink, setMainImageDropLink] = useState<string>("");
    const [totalRevenue, setTotoalRevenue] = useState<string>("0");
    const [totalOrders, setTotalOrders] = useState<string>("0");
    const [siteSettings, setSiteSettings] = useState<any>({});
    const [categoryValues, setCategoryValues] = useState<{ name: string, description: string, url: string }>({
        name: "",
        description: "",
        url: ""
    });
    const session = useSession();
    const { toast } = useToast();

    useEffect(() => {
        getSiteSettings().then((e) => {
            setSiteSettings(e);
            setNavbarMiddleImage(e?.middleImage!);
            setMainImageDropLink(e.mainDropLink!);
            setMainImageHome(e?.mainHomeImage!);
            setTotoalRevenue(e?.totalRevenue!);
            setTotalOrders(e?.totalOrders!);
        })
    }, [])

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)
        if (session.status === "unauthenticated") {
            setLoading(false)
            return toast({
                description: "Please login to use this action",
                variant: "destructive"
            });
        }

        updateSiteSettings({ middleImage: navbarMiddleImage, mainHomeImage: mainImageHome, mainDropLink: mainImageDropLink }).catch((e) => {
            setLoading(false)
            return toast({
                description: e,
                variant: "destructive"
            })
        }).then(() => {
            setLoading(false)
            setShowDialog(false)
            return toast({
                description: "Site Settings Updated",
                variant: "default"
            })
        })
    }

    const catOnSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)
        if (session.status === "unauthenticated") {
            setLoading(false)
            return toast({
                description: "Please login to use this action",
                variant: "destructive"
            });
        }

        createCategory({ description: categoryValues.description, name: categoryValues.name, url: categoryValues.url }).catch((e) => {
            setLoading(false)
            return toast({
                description: e,
                variant: "destructive"
            })
        }).then((res) => {
            if(!res) return;
            if (res.error) {
                setLoading(false)
                return toast({
                    description: res.error.message,
                    variant: "destructive"
                })
            }
            setLoading(false)
            setShowCatDialog(false)
            siteSettings.categories + 1;
            return toast({
                description: `Category ${res.name} has been created!`,
                variant: "default"
            })
        })
    }

    return (
        <>
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
                                <TabsTrigger value="orders">
                                    Orders
                                </TabsTrigger>
                                <TabsTrigger value="products">
                                    Products
                                </TabsTrigger>
                                <TabsTrigger value="users">
                                    Users
                                </TabsTrigger>
                                <TabsTrigger value="store">
                                    Store
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
                                        <div className="text-2xl font-bold">${totalRevenue}</div>

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
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
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
                                        <div className="text-2xl font-bold">{totalOrders}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Made By
                                        </CardTitle>
                                        <Settings fontSize={2} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-row w-full items-center mt-1 justify-between">
                                            <div className="text-2xl font-bold">Xolify</div>
                                            <Image
                                                src={'https://cdn.xolify.store/u/xolifycdn/Qw2twXczYX.png'}
                                                alt="Xolify Logo"
                                                width={45}
                                                height={45}
                                            />
                                        </div>
                                        <Link href={'https://xolify.store'} target="_blank" className="text-xs transition delay-75 hover:underline text-blue-600">
                                            My Store
                                        </Link>
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
                        <TabsContent value="store" className="space-y-4">
                            <div className="flex flex-row justify-between">
                                <Card className="w-96">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Products Count
                                        </CardTitle>
                                        <ShoppingBasket fontSize={2} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{siteSettings.products ? siteSettings.products.length : "0"}</div>
                                    </CardContent>
                                </Card>
                                <Card className="w-96">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Cateogry Count
                                        </CardTitle>
                                        <MenuIcon fontSize={2} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-row justify-between items-center w-full">
                                            <div className="text-2xl font-bold">{siteSettings.categories ? siteSettings.categories.length : "0"}</div>
                                            <Button value="sitesettings" onClick={() => setShowCatDialog(true)} className="flex flex-row items-center gap-2">
                                                Create a category
                                                <Plus fontSize={25} fontWeight={600} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <h1 className="border-b-black border-b-2 text-xl">Categories</h1>
                            <CategoriesTable /> 
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
                                        value={navbarMiddleImage}
                                        onChange={(e) => setNavbarMiddleImage(e.target.value)}
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
                                        value={mainImageHome}
                                        onChange={(e) => setMainImageHome(e.target.value)}
                                        id="main-image" placeholder="Image LINK" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="main-image-link">Main Image Drop Link (/store/CATEGORY)</Label>
                                    <Input
                                        disabled={loading}
                                        required
                                        value={mainImageDropLink}
                                        onChange={(e) => setMainImageDropLink(e.target.value)}
                                        id="main-image-link" placeholder="Category Link" />
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
                                Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={showCateogryDialog} onOpenChange={setShowCatDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a category</DialogTitle>
                        {/* <DialogDescription>
                            Add a new product to your store!
                        </DialogDescription> */}
                    </DialogHeader>
                    <form encType="multipart/form-data" onSubmit={catOnSubmit}>
                        <div>
                            <div className="space-y-4 py-2">
                                <div className="flex flex-row space-x-2 justify-between">
                                    <div className="space-y-2">
                                        <Label htmlFor="mid-image">Category Name</Label>
                                        <Input
                                            disabled={loading}
                                            required
                                            value={categoryValues.name}
                                            onChange={(e) => setCategoryValues({
                                                ...categoryValues,
                                                name: e.target.value
                                            })}
                                            id="mid-image" placeholder="T-Shirts" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="">Category Description</Label>
                                        <Input
                                            disabled={loading}
                                            required
                                            value={categoryValues.description}
                                            onChange={(e) => setCategoryValues({
                                                ...categoryValues,
                                                description: e.target.value
                                            })}
                                            id="cat-desc" placeholder="Find t-shirts of your liking!" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="main-image">Category Link Url</Label>
                                    <Input
                                        disabled={loading}
                                        required
                                        value={categoryValues.url}
                                        maxLength={10}
                                        onChange={(e) => setCategoryValues({
                                            ...categoryValues,
                                            url: e.target.value
                                        })}
                                        id="main-image" placeholder="tshirts" />
                                    <p className="text-sm text-muted-foreground">
                                        This will show as (https://YOUR_DOMAIN.com/store/{categoryValues.url.length === 0 ? "tshirts" : categoryValues.url}) NO SPACES ALLOWED
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                disabled={loading}
                                type="button"
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