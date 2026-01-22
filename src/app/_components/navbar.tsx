"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, User, LogOut, Trophy } from "lucide-react"

import { Button } from "~/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "~/components/ui/sheet"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

const navItems = [
    { name: "Practice", href: "/practice" },
    { name: "About", href: "/about" },
    { name: "Sponsor", href: "/sponsor" },
    { name: "Leaderboard", href: "/leaderboard" },
]

// User Avatar component
function UserAvatar({ src, name }: { src?: string | null; name?: string | null }) {
    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U"

    if (src) {
        return (
            <Image
                src={src}
                alt={name ?? "User avatar"}
                width={36}
                height={36}
                className="rounded-full border-2 border-green-500/50 transition-all hover:border-green-400"
            />
        )
    }

    return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-green-500/50 bg-green-500/20 text-sm font-semibold text-green-400 transition-all hover:border-green-400 hover:bg-green-500/30">
            {initials}
        </div>
    )
}

// User Profile Dropdown
function UserProfileDropdown() {
    const { data: session } = useSession()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none ring-offset-black transition-all focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    <UserAvatar src={session?.user?.image} name={session?.user?.name} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 border-white/10 bg-gray-950/95 backdrop-blur-xl"
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-white">
                            {session?.user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-gray-400">
                            {session?.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                    <Link
                        href="/profile"
                        className="flex cursor-pointer items-center text-white/80 hover:text-green-400 focus:text-green-400"
                    >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        href="/leaderboard"
                        className="flex cursor-pointer items-center text-white/80 hover:text-green-400 focus:text-green-400"
                    >
                        <Trophy className="mr-2 h-4 w-4" />
                        Leaderboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function Navbar() {
    const { status } = useSession()
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            100xPractice
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <Link href={item.href} legacyBehavior passHref>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                <span className="text-white/90 hover:text-green-400 transition-colors">
                                                    {item.name}
                                                </span>
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Auth Section - Desktop */}
                    <div className="hidden md:flex items-center">
                        {status === "authenticated" ? (
                            <UserProfileDropdown />
                        ) : (
                            <Button
                                onClick={() => signIn("google")}
                                className="bg-linear-to-r from-green-400 to-emerald-500 text-black font-semibold hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20"
                            >
                                Login
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center gap-3">
                        {/* Mobile User Avatar */}
                        {status === "authenticated" && <UserProfileDropdown />}

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white/90 hover:text-green-400 hover:bg-white/10"
                                >
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="bg-black/95 border-white/10 backdrop-blur-xl"
                            >
                                <div className="flex flex-col space-y-4 mt-8">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg text-white/90 hover:text-green-400 transition-colors py-2"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <div className="pt-4 border-t border-white/10 space-y-3">
                                        {status === "authenticated" ? (
                                            <>
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 text-white/90 hover:text-green-400 transition-colors py-2"
                                                >
                                                    <User className="h-4 w-4" />
                                                    Profile
                                                </Link>
                                                <Link
                                                    href="/leaderboard"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-2 text-white/90 hover:text-green-400 transition-colors py-2"
                                                >
                                                    <Trophy className="h-4 w-4" />
                                                    Leaderboard
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => signOut()}
                                                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-white/10 p-0 h-auto py-2"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Sign Out
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={() => signIn("google")}
                                                className="w-full bg-linear-to-r from-green-400 to-emerald-500 text-black font-semibold hover:from-green-500 hover:to-emerald-600 transition-all"
                                            >
                                                Login
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

