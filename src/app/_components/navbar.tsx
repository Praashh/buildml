"use client";

import {
	ChevronRight,
	LogOut,
	Menu,
	Moon,
	Sun,
	Trophy,
	User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import * as React from "react";
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
	{ name: "Leaderboard", href: "/leaderboard" },
	{ name: "About", href: "/about" },
	{ name: "Sponsor", href: "/sponsor" },
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
					className="rounded-full border-2 border-primary/50 transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(224,104,48,0.3)]"
					height={32}
					src={src}
					width={32}
				/>
			</div>
		);
	}

	return (
		<div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10 font-bold font-display text-primary text-sm transition-all duration-300 hover:border-primary hover:bg-primary/20">
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
				<button
					className="flex items-center gap-2 rounded-full outline-none ring-offset-[var(--background)] transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2"
					type="button"
				>
					<UserAvatar name={session?.user?.name} src={session?.user?.image} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-56 border-[var(--line)] bg-[var(--panel)] p-1 shadow-2xl backdrop-blur-xl"
			>
				<DropdownMenuLabel className="px-2 py-3 font-normal">
					<div className="flex flex-col space-y-1">
						<p className="truncate font-medium text-[var(--ink)] text-sm">
							{session?.user?.name ?? "User"}
						</p>
						<p className="truncate text-[var(--dim)] text-xs">
							{session?.user?.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-[var(--line)]" />
				<DropdownMenuItem asChild>
					<Link
						className="flex cursor-pointer items-center rounded-[2px] px-2 py-2 text-[var(--sub)] text-sm transition-colors hover:bg-[var(--raised)] hover:text-primary focus:bg-[var(--raised)] focus:text-primary"
						href="/profile"
					>
						<User className="mr-2 h-4 w-4" />
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						className="flex cursor-pointer items-center rounded-[2px] px-2 py-2 text-[var(--sub)] text-sm transition-colors hover:bg-[var(--raised)] hover:text-primary focus:bg-[var(--raised)] focus:text-primary"
						href="/leaderboard"
					>
						<Trophy className="mr-2 h-4 w-4" />
						Leaderboard
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-[var(--line)]" />
				<DropdownMenuItem
					className="cursor-pointer rounded-[2px] px-2 py-2 text-[#E04848] text-sm transition-colors hover:bg-[#E04848]/10 hover:text-[#E04848] focus:bg-[#E04848]/10 focus:text-[#E04848]"
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
	const { theme, setTheme } = useTheme();

	return (
		<nav className="fixed top-0 right-0 left-0 z-50 flex h-[58px] items-center justify-between border-[var(--line)] border-b bg-[var(--background)] px-4 transition-theme md:px-8">
			{/* Logo */}
			<Link
				className="flex items-center gap-[9px] font-display font-extrabold text-[var(--ink)] text-base tracking-[-0.02em]"
				href="/"
			>
				buildml
			</Link>

			{/* Desktop Navigation */}
			<div className="hidden items-center gap-0 md:flex">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							className={cn(
								"relative px-4 py-2 font-sans text-[11px] uppercase tracking-[0.07em] transition-colors duration-[0.18s]",
								isActive
									? "text-[var(--ink)]"
									: "text-[var(--sub)] hover:text-[var(--ink)]",
							)}
							href={item.href}
							key={item.href}
						>
							{item.name}
							{/* Underline */}
							<span
								className={cn(
									"absolute right-4 bottom-0 left-4 h-px bg-primary transition-transform duration-[0.18s]",
									isActive
										? "scale-x-100"
										: "scale-x-0 group-hover:scale-x-100",
								)}
							/>
						</Link>
					);
				})}
			</div>

			{/* Right section */}
			<div className="flex items-center gap-2">
				{/* Theme Toggle */}
				<button
					className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-[var(--dim)] text-sm transition-all duration-[0.18s] hover:border-[var(--sub)] hover:bg-[var(--raised)] hover:text-[var(--ink)]"
					onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					title="Toggle theme"
					type="button"
				>
					{theme === "light" ? (
						<Moon className="h-3.5 w-3.5" />
					) : (
						<Sun className="h-3.5 w-3.5" />
					)}
				</button>

				{/* Auth section - Desktop */}
				<div className="hidden md:block">
					{status === "authenticated" ? (
						<UserProfileDropdown />
					) : (
						<Link
							className="inline-block rounded-[2px] bg-primary px-[18px] py-2 font-sans text-[11px] text-white uppercase tracking-[0.07em] transition-all duration-[0.18s] hover:translate-y-[-1px] hover:opacity-85"
							href="/signin"
						>
							Login →
						</Link>
					)}
				</div>

				{/* Mobile Menu */}
				<div className="flex items-center gap-2 md:hidden">
					{status === "authenticated" && <UserProfileDropdown />}

					<Sheet onOpenChange={setIsOpen} open={isOpen}>
						<SheetTrigger asChild>
							<button
								className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-[var(--dim)] transition-all duration-[0.18s] hover:border-[var(--sub)] hover:text-[var(--ink)]"
								type="button"
							>
								<Menu className="h-4 w-4" />
								<span className="sr-only">Toggle menu</span>
							</button>
						</SheetTrigger>
						<SheetContent
							className="w-[300px] border-[var(--line)] bg-[var(--background)] p-0 backdrop-blur-2xl"
							side="right"
						>
							<SheetHeader className="border-[var(--line)] border-b p-6">
								<SheetTitle className="text-left">
									<span className="font-display font-extrabold text-primary text-xl">
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
													"group flex items-center justify-between rounded-[2px] px-4 py-4 transition-all duration-200",
													isActive
														? "bg-primary/10 text-primary"
														: "text-[var(--sub)] hover:bg-[var(--raised)] hover:text-[var(--ink)]",
												)}
												href={item.href}
												key={item.href}
												onClick={() => setIsOpen(false)}
											>
												<span className="font-sans text-[11px] uppercase tracking-[0.07em]">
													{item.name}
												</span>
												<ChevronRight
													className={cn(
														"h-4 w-4 transition-transform duration-200 group-hover:translate-x-1",
														isActive ? "text-primary" : "text-[var(--dim)]",
													)}
												/>
											</Link>
										);
									})}
								</div>

								<div className="mt-8 mb-4 border-[var(--line)] border-t px-4 pt-8">
									{status === "authenticated" ? (
										<div className="space-y-4">
											<div className="mb-6 flex items-center gap-3 rounded-[2px] bg-[var(--panel)] p-2">
												<UserAvatar
													name={session?.user?.name}
													src={session?.user?.image}
												/>
												<div className="flex flex-col">
													<span className="font-medium text-[var(--ink)] text-sm">
														{session?.user?.name}
													</span>
													<span className="text-[var(--dim)] text-xs">
														{session?.user?.email}
													</span>
												</div>
											</div>
											<button
												className="w-full rounded-[2px] border border-[#E04848]/20 bg-transparent px-4 py-3 font-sans text-[#E04848] text-[11px] uppercase tracking-[0.07em] transition-colors hover:bg-[#E04848]/10 hover:text-[#E04848]"
												onClick={() => signOut()}
												type="button"
											>
												<LogOut className="mr-2 inline-block h-4 w-4" />
												Sign Out
											</button>
										</div>
									) : (
										<Link
											className="block w-full rounded-[2px] bg-primary px-4 py-3 text-center font-bold font-sans text-[11px] text-white uppercase tracking-[0.07em] transition-all hover:opacity-85"
											href="/signin"
											onClick={() => setIsOpen(false)}
										>
											Login to Get Started
										</Link>
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}
