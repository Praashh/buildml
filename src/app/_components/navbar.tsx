"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

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

const navItems = [
    { name: "Practice", href: "/practice" },
    { name: "About", href: "/about" },
    { name: "Sponsor", href: "/sponsor" },
    { name: "Feedback", href: "/feedback" },
]

export function Navbar() {
    const { data: session, status } = useSession()
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

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        {status === "authenticated" ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-white/70 text-sm">{session.user?.name}</span>
                                <Button
                                    variant="ghost"
                                    onClick={() => signOut()}
                                    className="text-white/90 hover:text-red-400 hover:bg-white/10"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => signIn("google")}
                                    className="text-white/90 hover:text-green-400 hover:bg-white/10"
                                >
                                    Sign In
                                </Button>
                                <Button
                                    onClick={() => signIn("google")}
                                    className="bg-linear-to-r from-green-400 to-emerald-500 text-black font-semibold hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20"
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
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
                                            <Button
                                                variant="ghost"
                                                onClick={() => signOut()}
                                                className="w-full text-white/90 hover:text-red-400 hover:bg-white/10"
                                            >
                                                Sign Out
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => signIn("google")}
                                                    className="w-full text-white/90 hover:text-green-400 hover:bg-white/10"
                                                >
                                                    Sign In
                                                </Button>
                                                <Button
                                                    onClick={() => signIn("google")}
                                                    className="w-full bg-linear-to-r from-green-400 to-emerald-500 text-black font-semibold hover:from-green-500 hover:to-emerald-600 transition-all"
                                                >
                                                    Sign Up
                                                </Button>
                                            </>
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
