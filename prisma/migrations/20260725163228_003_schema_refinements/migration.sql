/*
  Warnings:

  - You are about to drop the column `action` on the `permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploaded_by_id` to the `ticket_attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "permissions_action_key";

-- DropIndex
DROP INDEX "tickets_ticket_number_idx";

-- AlterTable
ALTER TABLE "master_ticket_categories" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "master_ticket_priorities" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "master_ticket_statuses" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "master_ticket_types" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "action",
ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ticket_activities" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "ticket_assignments" ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "ticket_attachments" ADD COLUMN     "uploaded_by_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "resolved_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE INDEX "ticket_attachments_uploaded_by_id_idx" ON "ticket_attachments"("uploaded_by_id");

-- AddForeignKey
ALTER TABLE "ticket_attachments" ADD CONSTRAINT "ticket_attachments_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
