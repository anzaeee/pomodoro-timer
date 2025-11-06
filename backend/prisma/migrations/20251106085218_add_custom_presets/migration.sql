-- AlterTable
ALTER TABLE "preferences" ALTER COLUMN "autoStartBreaks" SET DEFAULT true;

-- CreateTable
CREATE TABLE "custom_presets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workDuration" INTEGER NOT NULL,
    "shortBreak" INTEGER NOT NULL,
    "longBreak" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_presets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_presets_userId_name_key" ON "custom_presets"("userId", "name");

-- AddForeignKey
ALTER TABLE "custom_presets" ADD CONSTRAINT "custom_presets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
