import NotFoundComponent from "~/components/not-found";
import "~/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "404 | Page Not Found",
	description: "The page you are looking for does not exist.",
};

export default function NotFound() {
	return (
		<html lang="en">
			<body>
				<NotFoundComponent />
			</body>
		</html>
	);
}
