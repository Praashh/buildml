"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LogOut, Menu, Trophy, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import * as React from "react";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

const navItems = [
	{ name: "Practice", href: "/practice" },
	{ name: "About", href: "/about" },
	{ name: "Sponsor", href: "/sponsor" },
	{ name: "Leaderboard", href: "/leaderboard" },
];

// User Avatar component
function UserAvatar({
	src,
	name,
}: {
	src?: string | null;
	name?: string | null;
}) {
	const initials = name
		? name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
		: "U";

	if (src) {
		return (
			<div className="group relative">
				<Image
					alt={name ?? "User avatar"}
					className="rounded-full border-2 border-yellow-500/50 transition-all duration-300 group-hover:border-yellow-400 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]"
					height={36}
					src={src}
					width={36}
				/>
			</div>
		);
	}

	return (
		<div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-500/50 bg-yellow-500/10 font-semibold text-yellow-400 text-sm transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-500/20">
			{initials}
		</div>
	);
}

// User Profile Dropdown
function UserProfileDropdown() {
	const { data: session } = useSession();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="flex items-center gap-2 rounded-full outline-none ring-offset-black transition-all focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
					<UserAvatar name={session?.user?.name} src={session?.user?.image} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-56 border-white/10 bg-gray-950/95 p-1 shadow-2xl backdrop-blur-xl"
			>
				<DropdownMenuLabel className="px-2 py-3 font-normal">
					<div className="flex flex-col space-y-1">
						<p className="truncate font-medium text-sm text-white">
							{session?.user?.name ?? "User"}
						</p>
						<p className="truncate text-gray-500 text-xs">
							{session?.user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-white/10" />
				<DropdownMenuItem asChild>
					<Link
						className="flex cursor-pointer items-center rounded-md px-2 py-2 text-gray-300 text-sm transition-colors hover:bg-white/5 hover:text-yellow-400 focus:bg-white/5 focus:text-yellow-400"
						href="/profile"
					>
						<User className="mr-2 h-4 w-4" />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						className="flex cursor-pointer items-center rounded-md px-2 py-2 text-gray-300 text-sm transition-colors hover:bg-white/5 hover:text-yellow-400 focus:bg-white/5 focus:text-yellow-400"
						href="/leaderboard"
					>
						<Trophy className="mr-2 h-4 w-4" />
						Leaderboard
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-white/10" />
				<DropdownMenuItem
					className="cursor-pointer rounded-md px-2 py-2 text-red-400 text-sm transition-colors hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
					onClick={() => signOut()}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function Navbar() {
	const { data: session, status } = useSession();
	const [isOpen, setIsOpen] = React.useState(false);
	const pathname = usePathname();
	const [hoveredPath, setHoveredPath] = React.useState<string | null>(null);

	return (
		<nav className="fixed top-0 right-0 left-0 z-50 border-white/5 border-b bg-black/60 backdrop-blur-xl">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link className="group flex items-center space-x-3" href="/">
						<div className="flex h-8 w-8 rotate-3 items-center justify-center rounded-lg bg-linear-to-br from-yellow-400 to-amber-600 transition-transform duration-300 group-hover:rotate-0">
							<span className="font-bold text-black text-lg">ML</span>
						</div>
						<span className="font-bold text-white text-xl tracking-tight">
							buildml
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden items-center rounded-full border border-white/5 bg-white/5 px-1.5 py-1 shadow-inner md:flex">
						<div className="relative flex items-center space-x-1">
							{navItems.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										className={cn(
											"relative whitespace-nowrap px-4 py-1.5 font-medium text-sm transition-colors duration-300",
											isActive
												? "text-yellow-400"
												: "text-gray-400 hover:text-white",
										)}
										href={item.href}
										key={item.href}
										onMouseEnter={() => setHoveredPath(item.href)}
										onMouseLeave={() => setHoveredPath(null)}
									>
										<span className="relative z-10">{item.name}</span>
										{hoveredPath === item.href && (
											<motion.span
												animate={{ opacity: 1 }}
												className="absolute inset-0 z-0 rounded-full bg-white/10"
												exit={{ opacity: 0 }}
												initial={{ opacity: 0 }}
												layoutId="nav-hover-bg"
												transition={{
													type: "spring",
													bounce: 0.25,
													duration: 0.5,
												}}
											/>
										)}
										{isActive && (
											<motion.div
												className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"
												layoutId="nav-active-dot"
												transition={{
													type: "spring",
													bounce: 0.2,
													duration: 0.6,
												}}
											/>
										)}
									</Link>
								);
							})}
						</div>
					</div>

					{/* Auth Section - Desktop */}
					<div className="hidden items-center md:flex">
						<AnimatePresence mode="wait">
							{status === "authenticated" ? (
								<motion.div
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									initial={{ opacity: 0, scale: 0.95 }}
									key="profile"
								>
									<UserProfileDropdown />
								</motion.div>
							) : (
								<motion.div
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									initial={{ opacity: 0, x: 20 }}
									key="login"
								>
									<Button
										asChild
										className="group relative overflow-hidden rounded-full bg-yellow-500 px-6 py-2 font-bold text-black shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-300 hover:bg-yellow-400 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
									>
										<Link href="/signin">
											<span className="relative z-10">Login</span>
											<div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-1000 group-hover:translate-x-full" />
										</Link>
									</Button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Mobile Menu */}
					<div className="flex items-center gap-3 md:hidden">
						{status === "authenticated" && <UserProfileDropdown />}

						<Sheet onOpenChange={setIsOpen} open={isOpen}>
							<SheetTrigger asChild>
								<Button
									className="rounded-full text-white/80 hover:bg-white/10 hover:text-white"
									size="icon"
									variant="ghost"
								>
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent
								className="w-[300px] border-white/10 bg-black/95 p-0 backdrop-blur-2xl"
								side="right"
							>
								<SheetHeader className="border-white/5 border-b p-6">
									<SheetTitle className="text-left">
										<span className="bg-linear-to-r from-yellow-400 to-amber-500 bg-clip-text font-bold text-transparent text-xl">
											buildml
										</span>
									</SheetTitle>
								</SheetHeader>
								<div className="flex flex-col p-4">
									<div className="space-y-1">
										{navItems.map((item) => {
											const isActive = pathname === item.href;
											return (
												<Link
													className={cn(
														"group flex items-center justify-between rounded-xl px-4 py-4 transition-all duration-200",
														isActive
															? "bg-yellow-500/10 text-yellow-400"
															: "text-gray-400 hover:bg-white/5 hover:text-white",
													)}
													href={item.href}
													key={item.href}
													onClick={() => setIsOpen(false)}
												>
													<span className="font-medium text-base">
														{item.name}
													</span>
													<ChevronRight
														className={cn(
															"h-4 w-4 transition-transform duration-200 group-hover:translate-x-1",
															isActive ? "text-yellow-400" : "text-gray-600",
														)}
													/>
												</Link>
											);
										})}
									</div>

									<div className="mt-8 mb-4 border-white/5 border-t px-4 pt-8">
										{status === "authenticated" ? (
											<div className="space-y-4">
												<div className="mb-6 flex items-center gap-3 rounded-lg bg-white/5 p-2">
													<UserAvatar
														name={session?.user?.name}
														src={session?.user?.image}
													/>
													<div className="flex flex-col">
														<span className="font-medium text-sm text-white">
															{session?.user?.name}
														</span>
														<span className="text-gray-500 text-xs">
															{session?.user?.email}
														</span>
													</div>
												</div>
												<Button
													className="w-full rounded-xl border-red-500/20 py-6 text-red-400 hover:bg-red-500/10 hover:text-red-300"
													onClick={() => signOut()}
													variant="outline"
												>
													<LogOut className="mr-2 h-4 w-4" />
													Sign Out
												</Button>
											</div>
										) : (
											<Button
												asChild
												className="w-full rounded-xl bg-linear-to-r from-yellow-400 to-amber-500 py-6 font-bold text-black transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
											>
												<Link href="/signin">Login to Get Started</Link>
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
	);
}
