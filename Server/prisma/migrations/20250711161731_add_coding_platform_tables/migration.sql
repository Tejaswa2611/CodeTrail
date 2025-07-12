-- CreateEnum
CREATE TYPE "platform" AS ENUM ('leetcode', 'codeforces');

-- CreateTable
CREATE TABLE "platform_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" "platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "current_rating" INTEGER,
    "max_rating" INTEGER,
    "rank" TEXT,
    "synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problems" (
    "id" TEXT NOT NULL,
    "platform" "platform" NOT NULL,
    "external_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" TEXT,
    "rating" INTEGER,
    "tags" TEXT[],
    "url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" "platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "language" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contests" (
    "id" TEXT NOT NULL,
    "platform" "platform" NOT NULL,
    "contest_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_participation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform" "platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "rank" INTEGER,
    "old_rating" INTEGER,
    "new_rating" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contest_participation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_profiles_user_id_platform_key" ON "platform_profiles"("user_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "problems_platform_external_id_key" ON "problems"("platform", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "contests_platform_contest_id_key" ON "contests"("platform", "contest_id");

-- CreateIndex
CREATE UNIQUE INDEX "contest_participation_user_id_platform_contest_id_key" ON "contest_participation"("user_id", "platform", "contest_id");

-- AddForeignKey
ALTER TABLE "platform_profiles" ADD CONSTRAINT "platform_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_participation" ADD CONSTRAINT "contest_participation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
