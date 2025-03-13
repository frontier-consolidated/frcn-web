-- CreateIndex
CREATE INDEX "container_parent_id_idx" ON "cms"."container"("parent_id");

-- CreateIndex
CREATE INDEX "events_start_at_posted_idx" ON "events"."events"("start_at", "posted");

-- CreateIndex
CREATE INDEX "settings_unique_idx" ON "system"."settings"("unique");
