/*
  Warnings:

  - You are about to drop the column `is_read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `ticket_activities` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `action_code` to the `ticket_activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action_label` to the `ticket_activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_activities" DROP CONSTRAINT "ticket_activities_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "ticket_assignments" DROP CONSTRAINT "ticket_assignments_ticket_id_fkey";

-- AlterTable
ALTER TABLE "master_ticket_categories" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "master_ticket_priorities" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "master_ticket_statuses" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "master_ticket_types" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "is_read",
ADD COLUMN     "read_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ticket_activities" DROP COLUMN "action",
ADD COLUMN     "action_code" TEXT NOT NULL,
ADD COLUMN     "action_label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "ticket_attachments" (
    "id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_key" ON "permissions"("action");

-- CreateIndex
CREATE INDEX "role_permissions_role_id_idx" ON "role_permissions"("role_id");

-- CreateIndex
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE INDEX "ticket_attachments_ticket_id_idx" ON "ticket_attachments"("ticket_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "ticket_activities_ticket_id_idx" ON "ticket_activities"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_activities_actor_id_idx" ON "ticket_activities"("actor_id");

-- CreateIndex
CREATE INDEX "ticket_assignments_ticket_id_idx" ON "ticket_assignments"("ticket_id");

-- CreateIndex
CREATE INDEX "ticket_assignments_assignee_id_idx" ON "ticket_assignments"("assignee_id");

-- CreateIndex
CREATE INDEX "ticket_assignments_assigned_by_id_idx" ON "ticket_assignments"("assigned_by_id");

-- CreateIndex
CREATE INDEX "tickets_ticket_number_idx" ON "tickets"("ticket_number");

-- CreateIndex
CREATE INDEX "tickets_reporter_id_idx" ON "tickets"("reporter_id");

-- CreateIndex
CREATE INDEX "tickets_type_id_idx" ON "tickets"("type_id");

-- CreateIndex
CREATE INDEX "tickets_category_id_idx" ON "tickets"("category_id");

-- CreateIndex
CREATE INDEX "tickets_status_id_idx" ON "tickets"("status_id");

-- CreateIndex
CREATE INDEX "tickets_priority_id_idx" ON "tickets"("priority_id");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_attachments" ADD CONSTRAINT "ticket_attachments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_assignments" ADD CONSTRAINT "ticket_assignments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
