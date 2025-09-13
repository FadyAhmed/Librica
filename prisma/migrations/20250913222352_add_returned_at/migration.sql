/*
  Warnings:

  - Added the required column `returnedAt` to the `borrowers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."books" ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."borrowers" ADD COLUMN     "returnedAt" TIMESTAMP(3) NOT NULL;
