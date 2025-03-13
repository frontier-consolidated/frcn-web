/* eslint-disable @typescript-eslint/no-unused-expressions */
import { generateSvelteHelpers, type UseUploadthingProps } from "@uploadthing/svelte";
import type { UploadThingError } from "uploadthing/server";
import type { inferErrorShape } from "uploadthing/types";

import type { UploadsRouter } from "$server/uploads";

export const { createUploadThing } = generateSvelteHelpers<UploadsRouter>({
	url: "/upload"
});

type UploaderOpts<TEndpoint extends keyof UploadsRouter> = Omit<
	UseUploadthingProps<UploadsRouter, TEndpoint>,
	"onUploadBegin" | "onUploadError"
> & {
	onUploadBegin?: ((fileName: string, promise: Promise<void>) => void) | undefined;
	onUploadError?:
		| ((
				e: UploadThingError<inferErrorShape<UploadsRouter>>,
				rejected: boolean
		  ) => void | Promise<void>)
		| undefined;
};

type Uploader<TEndpoint extends keyof UploadsRouter> = ReturnType<
	typeof createUploadThing<TEndpoint>
> & {
	promise: Promise<void> | null;
	resolve: () => void;
	reject: (msg?: string) => void;
};

export function createUploader<TEndpoint extends keyof UploadsRouter>(
	endpoint: TEndpoint,
	opts?: UploaderOpts<TEndpoint>
) {
	const uploader: Uploader<TEndpoint> = {
		...createUploadThing(endpoint, {
			...opts,
			onUploadBegin(fileName) {
				uploader.promise = createPromise();
				opts?.onUploadBegin && opts.onUploadBegin(fileName, uploader.promise);
			},
			onUploadError(err) {
				try {
					console.error("Upload error:", err);
					let rejected = false;
					if (uploader.promise) {
						uploader.reject();
						rejected = true;
					}

					opts?.onUploadError && opts.onUploadError(err, rejected);
				} finally {
					resetPromise();
				}
			},
			onClientUploadComplete(data) {
				try {
					opts?.onClientUploadComplete && opts.onClientUploadComplete(data);
				} finally {
					uploader.resolve();
					resetPromise();
				}
			}
		}),
		promise: null,
		resolve: () => {},
		reject: () => {}
	};

	function resetPromise() {
		uploader.promise = null;
		uploader.resolve = () => {};
		uploader.reject = () => {};
	}

	function createPromise() {
		return new Promise<void>((res, rej) => {
			uploader.resolve = res;
			uploader.reject = rej;
		});
	}

	return uploader;
}
