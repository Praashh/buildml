import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma/client";

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set. Please add it to your .env file.");
}

const adapter = new PrismaPg({
	connectionString: databaseUrl,
});

export const prisma = new PrismaClient({ adapter });
