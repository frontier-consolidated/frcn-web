import { browser } from "$app/environment";
import type { AxiosResponse } from "axios";
import { v4 as uuid } from "uuid";

type ResponsePayload = {
    requestId: string;
    value: string;
} | {
    requestId: string;
    error: { message: string };
};

type IntegrationPayload = {
    type: string;
    message: ResponsePayload;
};

type SpectrumResponse<T> = {
    code: string;
    msg: string;
    success: number;
    data: T;
};

export type SpectrumMember = {
    id: string;
    displayname: string;
    nickname: string;
    avatar: string;
    signature: string;
    isGM: boolean;
    spoken_languages: string[];
};

type SpectrumIdentityData = SpectrumResponse<{
    config: Record<string, string> & {
        permissions_schema: Record<string, string[]>
    };
    token: string;
    member: SpectrumMember;
    settings: Record<string, string | number | boolean | string[] | null>;
    friends: SpectrumMember[];
}>;

type SpectrumMemberAutocompleteData = SpectrumResponse<{
    total: number;
    max_score: number;
    hits: {
        _id: string;
        _index: string;
        _score: number;
        _type: string;
        _source: {
            avatar: string;
            displayname: string;
            id: string;
            nickname: string;
        }
    }[];
    members: SpectrumMember[];
    page: number;
    pages_total: number;
    pagesize: number;
    timed_out: boolean;
    took: number;
}>;

class Integration {
    private metaTag: HTMLMetaElement | null = null;

    constructor() {
        if (browser) {
            const element = document.head.querySelector("meta[name='frcn-integration-version']");
            this.metaTag = element as HTMLMetaElement | null;
        }
    }

    isLoaded() {
        return !!this.metaTag;
    }

    getVersion() {
        return this.metaTag ? this.metaTag.getAttribute("content") ?? "0.0.0" : "0.0.0";
    }

    request<T>(type: string, message: any) {
        return new Promise<T>((resolve, reject) => {
            if (!this.isLoaded()) {
                reject(new Error("Integration not loaded"));
                return;
            }

            const requestId = uuid();
            function listener(event: MessageEvent<IntegrationPayload>) {
                if (!event.data || event.data.type !== "frcnIntegrationResponse") return;
                
                const message = event.data.message;
                if (message.requestId !== requestId) return;

                if ("error" in message) {
                    reject(new Error(message.error.message));
                    return;
                }

                const response = JSON.parse(message.value) as T;
                resolve(response);
                window.removeEventListener("message", listener);
            }
        
            window.addEventListener("message", listener);
            window.postMessage({
                type: "frcnIntegrationRequest",
                message: {
                    id: requestId,
                    type,
                    message
                }
            });
        });
    }

    async identify() {
        const response = await this.request<AxiosResponse<SpectrumIdentityData>>("spectrumRequest", {
            method: "POST",
            path: "/auth/identify",
            data: {}
        });

        return response.data.data;
    }

    async searchUsers(text: string) {
        const response = await this.request<AxiosResponse<SpectrumMemberAutocompleteData>>("spectrumRequest", {
            method: "POST",
            path: "/search/member/autocomplete",
            data: {
                ignore_self: true,
                text,
            }
        });

        console.log(response);
        return response.data.data;
    }

    async addFriend(id: string) {
        const response = await this.request<AxiosResponse<SpectrumResponse<object>>>("spectrumRequest", {
            method: "POST",
            path: "/friend-request/create",
            data: {
                member_id: id
            }
        });

        console.log(response);
    }
}

export const integration = new Integration();