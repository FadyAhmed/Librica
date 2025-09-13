-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';
