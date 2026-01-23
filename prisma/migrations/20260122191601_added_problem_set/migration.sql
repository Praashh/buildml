-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "problemSetId" TEXT;

-- CreateTable
CREATE TABLE "ProblemSet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProblemSet_slug_key" ON "ProblemSet"("slug");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_problemSetId_fkey" FOREIGN KEY ("problemSetId") REFERENCES "ProblemSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
