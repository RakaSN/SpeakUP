/*
  Warnings:

  - The `type` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED');

-- CreateEnum
CREATE TYPE "SlaStatus" AS ENUM ('ON_TRACK', 'AT_RISK', 'OVERDUE', 'RESOLVED_ON_TIME', 'RESOLVED_LATE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR');

-- AlterTable
ALTER TABLE "master_ticket_priorities" ADD COLUMN     "sla_hours" INTEGER NOT NULL DEFAULT 24;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "sla_hours" INTEGER,
ADD COLUMN     "sla_status" "SlaStatus" NOT NULL DEFAULT 'ON_TRACK',
ADD COLUMN     "target_resolution_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entity_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "tickets_sla_status_idx" ON "tickets"("sla_status");

-- CreateIndex
CREATE INDEX "tickets_target_resolution_at_idx" ON "tickets"("target_resolution_at");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
