-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cms";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "events";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "system";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateTable
CREATE TABLE "system"."settings" (
    "id" SERIAL NOT NULL,
    "unique" BOOLEAN NOT NULL DEFAULT true,
    "discord_guild_id" TEXT NOT NULL,
    "default_event_channel_id" INTEGER,
    "role_order" TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."sessions" (
    "sid" TEXT NOT NULL,
    "data" VARCHAR(4096) NOT NULL,
    "device_id" TEXT NOT NULL,
    "user_id" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "user"."settings" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."statuses" (
    "id" SERIAL NOT NULL,
    "activity" TEXT,
    "ship" TEXT,
    "user_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discord_id" TEXT,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "permissions" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."users" (
    "id" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "discord_name" TEXT NOT NULL,
    "discord_username" TEXT NOT NULL,
    "sc_name" TEXT,
    "sc_verified" BOOLEAN NOT NULL,
    "sc_verify_code" TEXT,
    "avatar_url" TEXT NOT NULL,
    "primary_role_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."users__roles" (
    "role_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users__roles_pkey" PRIMARY KEY ("role_id","user_id")
);

-- CreateTable
CREATE TABLE "events"."rsvp_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "emoji_id" TEXT NOT NULL,
    "limit" INTEGER NOT NULL DEFAULT 0,
    "event_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvp_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events"."users" (
    "id" TEXT NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    "rsvp_id" TEXT,
    "event_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events"."settings" (
    "id" SERIAL NOT NULL,
    "hide_location" BOOLEAN NOT NULL,
    "invite_only" BOOLEAN NOT NULL,
    "open_to_join_requests" BOOLEAN NOT NULL,
    "allow_team_switching" BOOLEAN NOT NULL,
    "event_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events"."events" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT,
    "channel_id" INTEGER,
    "discord_thread_id" TEXT,
    "discord_role_id" TEXT,
    "discord_event_message_id" TEXT,
    "discord_start_message_id" TEXT,
    "discord_mentions" TEXT[],
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" VARCHAR(2048) NOT NULL,
    "image_url" VARCHAR(2084),
    "event_type" TEXT,
    "location" TEXT[],
    "access_type" TEXT NOT NULL,
    "start_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "duration" INTEGER,
    "posted" BOOLEAN NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events"."events__user_roles" (
    "role_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events__user_roles_pkey" PRIMARY KEY ("role_id","event_id")
);

-- CreateTable
CREATE TABLE "events"."channels" (
    "id" SERIAL NOT NULL,
    "discord_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms"."file_uploads" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "owner_id" TEXT,
    "file_name" TEXT NOT NULL,
    "file_size_kb" INTEGER NOT NULL,
    "content_type" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms"."resources" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT,
    "name" TEXT NOT NULL,
    "short_description" VARCHAR(512) NOT NULL,
    "tags" TEXT[],
    "can_preview" BOOLEAN NOT NULL DEFAULT false,
    "file_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms"."container" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "children_order" TEXT[],
    "parent_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms"."container__file_uploads" (
    "id" SERIAL NOT NULL,
    "container_id" INTEGER NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "container__file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_unique_key" ON "system"."settings"("unique");

-- CreateIndex
CREATE UNIQUE INDEX "settings_default_event_channel_id_key" ON "system"."settings"("default_event_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_key" ON "user"."settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "statuses_user_id_key" ON "user"."statuses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_discord_id_key" ON "user"."roles"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "user"."users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_event_id_key" ON "events"."settings"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_discord_id_key" ON "events"."channels"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "container_identifier_key" ON "cms"."container"("identifier");

-- AddForeignKey
ALTER TABLE "system"."settings" ADD CONSTRAINT "settings_default_event_channel_id_fkey" FOREIGN KEY ("default_event_channel_id") REFERENCES "events"."channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."statuses" ADD CONSTRAINT "statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."users" ADD CONSTRAINT "users_primary_role_id_fkey" FOREIGN KEY ("primary_role_id") REFERENCES "user"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."users__roles" ADD CONSTRAINT "users__roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."users__roles" ADD CONSTRAINT "users__roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."rsvp_roles" ADD CONSTRAINT "rsvp_roles_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."users" ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."users" ADD CONSTRAINT "users_rsvp_id_fkey" FOREIGN KEY ("rsvp_id") REFERENCES "events"."rsvp_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."users" ADD CONSTRAINT "users_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."settings" ADD CONSTRAINT "settings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."events" ADD CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."events" ADD CONSTRAINT "events_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "events"."channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."events__user_roles" ADD CONSTRAINT "events__user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."events__user_roles" ADD CONSTRAINT "events__user_roles_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."file_uploads" ADD CONSTRAINT "file_uploads_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."resources" ADD CONSTRAINT "resources_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."resources" ADD CONSTRAINT "resources_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "cms"."file_uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."container" ADD CONSTRAINT "container_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "cms"."container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."container__file_uploads" ADD CONSTRAINT "container__file_uploads_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "cms"."container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."container__file_uploads" ADD CONSTRAINT "container__file_uploads_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "cms"."file_uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
