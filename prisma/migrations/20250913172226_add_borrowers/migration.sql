-- CreateTable
CREATE TABLE "public"."borrowers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "borrowers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."borrowers" ADD CONSTRAINT "borrowers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."borrowers" ADD CONSTRAINT "borrowers_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
