/*
  Warnings:

  - You are about to drop the column `isEmailVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isEmailVerified";

-- CreateTable
CREATE TABLE "calendar_cache" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" "platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calendar_cache_user_id_platform_date_key" ON "calendar_cache"("user_id", "platform", "date");

-- AddForeignKey
ALTER TABLE "calendar_cache" ADD CONSTRAINT "calendar_cache_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
