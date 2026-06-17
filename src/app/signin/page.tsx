import { createMetadata } from "~/lib/seo";
import { SignInClient } from "./_components/signin-client";

export const metadata = createMetadata({
	title: "Login",
	description:
		"Sign in to buildml to start building AI/ML models from scratch.",
	pathname: "/signin",
});

export default function SignInPage() {
	return <SignInClient />;
}
