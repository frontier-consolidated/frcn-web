/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventRsvpRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventsWithUserRoleForAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersInUserRoles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "EventRsvpRole" DROP CONSTRAINT "EventRsvpRole_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventSettings" DROP CONSTRAINT "EventSettings_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventUser" DROP CONSTRAINT "EventUser_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventUser" DROP CONSTRAINT "EventUser_rsvpId_fkey";

-- DropForeignKey
ALTER TABLE "EventUser" DROP CONSTRAINT "EventUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventsWithUserRoleForAccess" DROP CONSTRAINT "EventsWithUserRoleForAccess_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventsWithUserRoleForAccess" DROP CONSTRAINT "EventsWithUserRoleForAccess_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "SystemSettings" DROP CONSTRAINT "SystemSettings_defaultEventChannelId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_primaryRoleId_fkey";

-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStatus" DROP CONSTRAINT "UserStatus_userId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInUserRoles" DROP CONSTRAINT "UsersInUserRoles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInUserRoles" DROP CONSTRAINT "UsersInUserRoles_userId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventChannel";

-- DropTable
DROP TABLE "EventRsvpRole";

-- DropTable
DROP TABLE "EventSettings";

-- DropTable
DROP TABLE "EventUser";

-- DropTable
DROP TABLE "EventsWithUserRoleForAccess";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "SystemSettings";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserRole";

-- DropTable
DROP TABLE "UserSession";

-- DropTable
DROP TABLE "UserSettings";

-- DropTable
DROP TABLE "UserStatus";

-- DropTable
DROP TABLE "UsersInUserRoles";

-- CreateTable
CREATE TABLE "system_settings" (
    "id" SERIAL NOT NULL,
    "unique" BOOLEAN NOT NULL DEFAULT true,
    "discord_guild_id" TEXT NOT NULL,
    "default_event_channel_id" INTEGER,
    "role_order" TEXT[],
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "sid" TEXT NOT NULL,
    "data" VARCHAR(4096) NOT NULL,
    "device_id" TEXT NOT NULL,
    "user_id" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_statuses" (
    "id" SERIAL NOT NULL,
    "activity" TEXT,
    "ship" TEXT,
    "user_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discord_id" TEXT,
    "primary" BOOLEAN NOT NULL DEFAULT false,
    "permissions" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "discord_name" TEXT NOT NULL,
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
CREATE TABLE "users__user_roles" (
    "role_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users__user_roles_pkey" PRIMARY KEY ("role_id","user_id")
);

-- CreateTable
CREATE TABLE "event_rsvp_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "emoji_id" TEXT NOT NULL,
    "limit" INTEGER NOT NULL DEFAULT 0,
    "event_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_rsvp_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_users" (
    "id" TEXT NOT NULL,
    "pending" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    "rsvp_id" TEXT,
    "event_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_settings" (
    "id" SERIAL NOT NULL,
    "hide_location" BOOLEAN NOT NULL,
    "invite_only" BOOLEAN NOT NULL,
    "open_to_join_requests" BOOLEAN NOT NULL,
    "allow_team_switching" BOOLEAN NOT NULL,
    "allow_crew_switching" BOOLEAN NOT NULL,
    "event_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "discord_thread_id" TEXT,
    "discord_role_id" TEXT,
    "discord_event_message_id" TEXT,
    "discord_start_message_id" TEXT,
    "discordMentions" TEXT[],
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
CREATE TABLE "events__user_roles" (
    "role_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events__user_roles_pkey" PRIMARY KEY ("role_id","event_id")
);

-- CreateTable
CREATE TABLE "event_channels" (
    "id" SERIAL NOT NULL,
    "discord_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_description" VARCHAR(512) NOT NULL,
    "tags" TEXT[],
    "file_attached" BOOLEAN NOT NULL,
    "file_name" TEXT,
    "file_size_kb" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_unique_key" ON "system_settings"("unique");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_default_event_channel_id_key" ON "system_settings"("default_event_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_statuses_user_id_key" ON "user_statuses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_discord_id_key" ON "user_roles"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_id_key" ON "users"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_settings_event_id_key" ON "event_settings"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_channels_discord_id_key" ON "event_channels"("discord_id");

-- AddForeignKey
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_default_event_channel_id_fkey" FOREIGN KEY ("default_event_channel_id") REFERENCES "event_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statuses" ADD CONSTRAINT "user_statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_primary_role_id_fkey" FOREIGN KEY ("primary_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users__user_roles" ADD CONSTRAINT "users__user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users__user_roles" ADD CONSTRAINT "users__user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvp_roles" ADD CONSTRAINT "event_rsvp_roles_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_users" ADD CONSTRAINT "event_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_users" ADD CONSTRAINT "event_users_rsvp_id_fkey" FOREIGN KEY ("rsvp_id") REFERENCES "event_rsvp_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_users" ADD CONSTRAINT "event_users_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_settings" ADD CONSTRAINT "event_settings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "event_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events__user_roles" ADD CONSTRAINT "events__user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events__user_roles" ADD CONSTRAINT "events__user_roles_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
