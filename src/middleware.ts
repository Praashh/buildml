import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "./env";

export async function middleware(req: NextRequest) {
	const token = await getToken({
		req,
		secret: env.NEXTAUTH_SECRET as string,
		salt: process.env.NEXTAUTH_SALT as string,
		secureCookie: req.nextUrl.protocol === "https:",
	});
	// console.log('request', req);
	// console.log('All cookies:', req.cookies.getAll());

	// console.log('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET);
	// console.log('NEXTAUTH_SALT', process.env.NEXTAUTH_SALT);
	// console.log('token', token);
	if (!token) {
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	const now = Date.now() / 1000;
	if (token.exp && now > token.exp) {
		// console.log('TOKEN EXPIRED');
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/practice/:path*", "/leaderboard", "/profile/:path*"],
};
