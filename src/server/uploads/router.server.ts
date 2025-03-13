import type { RequestEvent } from "@sveltejs/kit";
import type { UploadBuilder, MiddlewareFnArgs } from "uploadthing/internal/types";
import { UploadThingError, createUploadthing } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
import { z } from "zod";

import { uploadapi } from "./client.server";
import { logger } from "../utils/logger";

import { config } from "$lib/config";
import { has_perm, Permission } from "$lib/permissions";
import { get_article, set_article_image } from "$server/articles.server";
import { get_session_and_user } from "$server/sessions";
import { get_shop, set_shop_thumbnail } from "$server/shops.server";
import { get_user, set_user_member_card_image } from "$server/users.server";

const uploadthing = createUploadthing();

type SvelteUploaderBuilder<T extends UploadBuilder<any>> =
	T extends UploadBuilder<infer P>
		? UploadBuilder<
				Omit<P, "_middlewareArgs"> & {
					_middlewareArgs: MiddlewareFnArgs<RequestEvent, any, any>;
				}
			>
		: never;

function cast<T extends UploadBuilder<any>>(builder: T) {
	return builder as unknown as SvelteUploaderBuilder<T>;
}

export const uploads_router = {
	shop_thumbnail: cast(
		uploadthing(
			{
				image: {
					maxFileSize: "512KB",
					maxFileCount: 1,
					acl: "public-read",
					additionalProperties: {
						width: 480,
						height: 480,
						recommendedWidth: 320,
						recommendedHeight: 320
					}
				}
			},
			{ awaitServerData: true }
		)
	)
		.input(z.object({ shop_id: z.number().positive("Required") }))
		.middleware(async ({ req, input }) => {
			try {
				const { user } = await get_session_and_user(req);
				if (!user) {
					throw new UploadThingError("You must be authenticated to upload a shop thumbnail");
				}

				const shop = await get_shop(input.shop_id);
				if (!shop)
					throw new UploadThingError({
						code: "BAD_REQUEST",
						message: "Shop does not exist"
					});

				if (shop.owner?.id !== user.id)
					throw new UploadThingError({
						code: "FORBIDDEN",
						message: "You do not have permission to upload a thumbnail for that shop"
					});

				return {
					user_id: user.id,
					shop_id: shop.id,
					previous_thumbnail: shop.thumbnail_file_key
				};
			} catch (err) {
				logger.error("Error in upload middleware", err);
				throw err;
			}
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				if (metadata.previous_thumbnail) {
					await uploadapi.deleteFiles(metadata.previous_thumbnail);
				}

				await set_shop_thumbnail({ id: metadata.shop_id }, file.key);
			} catch (err) {
				if (!(err instanceof UploadThingError)) {
					logger.error("Error in upload middleware", err);
				}
				await uploadapi.deleteFiles(file.key);
			}
		}),
	article_image: cast(
		uploadthing({
			image: {
				maxFileSize: "1MB",
				maxFileCount: 1,
				acl: "public-read",
				additionalProperties: {
					width: 720,
					height: 405,
					recommendedWidth: 648,
					recommendedHeight: 365
				}
			}
		})
	)
		.input(z.object({ article_id: z.number().positive("Required") }))
		.middleware(async ({ req, input }) => {
			try {
				const { user } = await get_session_and_user(req);
				if (!user) {
					throw new UploadThingError("You must be authenticated to upload an article image");
				}

				const article = await get_article(input.article_id);
				if (!article)
					throw new UploadThingError({
						code: "BAD_REQUEST",
						message: "Article does not exist"
					});

				if (article.author?.id !== user.id)
					throw new UploadThingError({
						code: "FORBIDDEN",
						message: "You do not have permission to upload an image for that article"
					});

				return {
					user_id: user.id,
					article_id: article.id,
					previous_image: article.image_file_key
				};
			} catch (err) {
				if (!(err instanceof UploadThingError)) {
					logger.error("Error in upload middleware", err);
				}
				throw err;
			}
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				if (metadata.previous_image) {
					await uploadapi.deleteFiles(metadata.previous_image);
				}

				await set_article_image({ id: metadata.article_id }, file.key);
			} catch (err) {
				logger.error("Upload error", err);
				await uploadapi.deleteFiles(file.key);
			}
		}),
	member_card_image: cast(
		uploadthing({
			image: {
				maxFileSize: "2MB",
				maxFileCount: 1,
				acl: "public-read",
				additionalProperties: {
					width: 800,
					height: 600
				}
			}
		})
	)
		.input(z.object({ user_id: z.number().positive("Required") }))
		.middleware(async ({ req, input }) => {
			try {
				const { user } = await get_session_and_user(req);
				if (!user) {
					throw new UploadThingError("You must be authenticated to upload a member card image");
				}

				if (!has_perm(user.permissions, Permission.UploadMemberCards)) {
					throw new UploadThingError({
						code: "FORBIDDEN",
						message: "You do not have permission to upload a user's member card"
					});
				}

				const target_user = await get_user(input.user_id);
				if (!target_user)
					throw new UploadThingError({
						code: "BAD_REQUEST",
						message: "User does not exist"
					});

				return { user_id: user.id, target_user_id: target_user.id };
			} catch (err) {
				if (!(err instanceof UploadThingError)) {
					logger.error("Error in upload middleware", err);
				}
				throw err;
			}
		})
		.onUploadComplete(async ({ metadata, file }) => {
			try {
				await set_user_member_card_image({ id: metadata.target_user_id }, config.season, file.key);
			} catch (err) {
				logger.error("Upload error", err);
				await uploadapi.deleteFiles(file.key);
			}
		})
} satisfies FileRouter;

export type UploadsRouter = typeof uploads_router;
