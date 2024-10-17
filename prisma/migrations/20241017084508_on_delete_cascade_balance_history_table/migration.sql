-- DropForeignKey
ALTER TABLE "balance_history" DROP CONSTRAINT "balance_history_userId_fkey";

-- AddForeignKey
ALTER TABLE "balance_history" ADD CONSTRAINT "balance_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
