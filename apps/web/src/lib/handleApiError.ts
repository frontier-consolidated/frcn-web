import { browser } from "$app/environment";
import { ApolloError } from "@apollo/client/core";
import { error, type NumericRange } from "@sveltejs/kit";
import { AxiosError, isAxiosError } from "axios";

import { push_notification } from "./stores/NotificationStore";

export function handle_api_error(err?: AxiosError | ApolloError, options?: { notification?: boolean; throwAll?: boolean; }) {
    if (!err) return;

    options ??= {};
    options.notification ??= browser;

    let message: string = "";
    let status_code: number = -1;
    if (isAxiosError(err) && err.response?.status) {
        status_code = err.response.status;
        message = err.message;
    } else if (err instanceof ApolloError && err.networkError && "statusCode" in err.networkError) {
        status_code = err.networkError.statusCode;
        message = err.message;
    }

    if (status_code < 400) return;
    switch (status_code) {
        case 429:
            if (options?.notification) {
                push_notification({
                    type: "error",
                    message: "Too Many Requests"
                });
            } else {
                error(429, "Too Many Requests");
            }
            break;
        default:
            if (options?.throwAll) {
                if (options?.notification) {
                    push_notification({
                        type: "error",
                        message
                    });
                } else {
                    error(status_code as NumericRange<400, 599>, message);
                }
            }
    }
}