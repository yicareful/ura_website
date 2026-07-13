-- AlterTable
ALTER TABLE "Runner" ADD COLUMN "uraId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Runner_uraId_key" ON "Runner"("uraId");
