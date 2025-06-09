CREATE TABLE "bot_ticket_channels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bot_ticket_channels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"discord_channel_id" text NOT NULL,
	"discord_channel_message_id" text,
	"channel_message_heading" text NOT NULL,
	"channel_message_description" text NOT NULL,
	"modal_title" text NOT NULL,
	"ticket_name" text NOT NULL,
	"ticket_description" text NOT NULL,
	"ticket_mentions" text[] DEFAULT '{}' NOT NULL,
	"limit_per_user" integer DEFAULT 3 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bot_ticket_field_answers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bot_ticket_field_answers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"value" text NOT NULL,
	"ticket_id" integer NOT NULL,
	"field_id" integer
);
--> statement-breakpoint
CREATE TABLE "bot_ticket_fields" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bot_ticket_fields_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"custom_id" text NOT NULL,
	"type" text NOT NULL,
	"label" text NOT NULL,
	"placeholder" text,
	"required" boolean DEFAULT false NOT NULL,
	"text_min_length" integer,
	"text_max_length" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"channel_id" integer NOT NULL,
	CONSTRAINT "bot_ticket_fields_channel_id_custom_id_unique" UNIQUE("channel_id","custom_id")
);
--> statement-breakpoint
CREATE TABLE "bot_tickets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bot_tickets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"opened_by_discord_id" text NOT NULL,
	"opened_by_discord_username" text NOT NULL,
	"discord_thread_id" text,
	"closed_reason" text,
	"closed_by_discord_id" text,
	"closed_by_discord_username" text,
	"closed_discord_message_id" text,
	"closed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"channel_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bot_ticket_field_answers" ADD CONSTRAINT "bot_ticket_field_answers_ticket_id_bot_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."bot_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_ticket_field_answers" ADD CONSTRAINT "bot_ticket_field_answers_field_id_bot_ticket_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."bot_ticket_fields"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_ticket_fields" ADD CONSTRAINT "bot_ticket_fields_channel_id_bot_ticket_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."bot_ticket_channels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bot_tickets" ADD CONSTRAINT "bot_tickets_channel_id_bot_ticket_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."bot_ticket_channels"("id") ON DELETE cascade ON UPDATE no action;