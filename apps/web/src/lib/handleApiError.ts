import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { ApolloError } from "@apollo/client/core";
import { error, type NumericRange } from "@sveltejs/kit";
import { AxiosError, isAxiosError } from "axios";

import { pushNotification } from "./stores/NotificationStore";

export function handleApiError(err?: AxiosError | ApolloError, options?: { notification?: boolean; throwAll?: boolean; }) {
    if (!err) return;

    options ??= {};
    options.notification ??= browser;

    let message: string = "";
    let statusCode: number = -1;
    if (isAxiosError(err) && err.response?.status) {
        statusCode = err.response.status;
        message = err.message;
    } else if (err instanceof ApolloError && err.networkError && "statusCode" in err.networkError) {
        statusCode = err.networkError.statusCode;
        message = err.message;
    }

    if (statusCode < 400) return;
    switch (statusCode) {
        case 429:
            if (options?.notification) {
                pushNotification({
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
                    pushNotification({
                        type: "error",
                        message
                    });
                } else {
                    error(statusCode as NumericRange<400, 599>, message);
                }
            }
    }
}