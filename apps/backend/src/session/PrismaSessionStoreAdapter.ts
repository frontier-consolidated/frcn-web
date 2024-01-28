/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaClient } from "@prisma/client";
import { type SessionData, Store } from "express-session";

export interface PrismaSessionStoreAdapteOptions {
	maxAge?: number;
	checkPeriod?: number;
	allowTouch?: boolean;
}

export default class PrismaSessionStoreAdapter extends Store {
	private db: PrismaClient;
	private checkInterval: NodeJS.Timeout;

	private allowTouch: boolean;
	private maxAge: number;

	constructor(database: PrismaClient, options?: PrismaSessionStoreAdapteOptions) {
		super();

		this.db = database;
		this.allowTouch = options?.allowTouch ?? true;
		this.maxAge = options?.maxAge ?? 86400 * 1000;

		const checkPeriod = options.checkPeriod ?? 3600;
		this.checkInterval = setInterval(() => {
			this.clean();
		}, checkPeriod * 1000);
		this.clean();
	}

	get(sid: string, callback: (err: any, session?: SessionData | null | undefined) => void): void {
		this.db.userSession
			.findFirst({
				where: { sid },
			})
			.then((session) => {
				if (!session) return callback(null);

				const now = new Date();
				if (session.expiresAt < now) return callback(null);

				try {
					const data = JSON.parse(session.data) as SessionData;
					callback(null, data);
				} catch (err) {
					callback(err);
				}
			})
			.catch((err) => {
				callback(err);
			});
	}

	set(sid: string, sessionData: SessionData, callback?: ((err?: any) => void) | undefined): void {
		let expiresAt: Date;
		if (sessionData.cookie.expires) {
			expiresAt = sessionData.cookie.expires;
		} else {
			expiresAt = new Date(Date.now() + this.maxAge);
		}

		const userId = sessionData.user;
		const deviceId = sessionData.deviceId;
		const data = JSON.stringify(sessionData);

		this.db.userSession
			.upsert({
				where: { sid },
				update: {
					data,
					user: {
						connect: userId
							? {
									id: userId,
							  }
							: undefined,
						disconnect:
							!userId && sessionData.user
								? {
										id: sessionData.user,
								  }
								: undefined,
					},
					deviceId,
					expiresAt: this.allowTouch ? expiresAt : undefined,
				},
				create: {
					sid,
					data,
					deviceId,
					userId,
					expiresAt,
				},
			})
			.then(() => {
				// Delete sessions from the same device that are not being used
				return this.db.userSession.deleteMany({
					where: {
						sid: {
							not: sid,
						},
						deviceId,
					},
				});
			})
			.then(() => {
				callback && callback();
			})
			.catch((err) => {
				callback && callback(err);
			});
	}

	destroy(sid: string, callback?: ((err?: any) => void) | undefined): void {
		this.db.userSession
			.delete({
				where: { sid },
			})
			.then(() => callback && callback())
			.catch((err) => callback && callback(err));
	}

	all(
		callback: (err: any, obj?: { [sid: string]: SessionData } | null | undefined) => void
	): void {
		const now = new Date();

		this.db.userSession
			.findMany({
				where: {
					expiresAt: {
						gte: now,
					},
				},
			})
			.then((sessions) => {
				const obj: { [sid: string]: SessionData } = {};
				for (const session of sessions) {
					try {
						const data = JSON.parse(session.data) as SessionData;
						obj[session.sid] = data;
					} catch (err) {
						return callback(err);
					}
				}
				callback(null, obj);
			})
			.catch((err) => {
				callback(err);
			});
	}

	length(callback: (err: any, length?: number | undefined) => void): void {
		const now = new Date();

		this.db.userSession
			.count({
				where: {
					expiresAt: {
						gte: now,
					},
				},
			})
			.then((count) => {
				callback(null, count);
			})
			.catch((err) => {
				callback(err);
			});
	}

	clear(callback?: ((err?: any) => void) | undefined): void {
		this.db.userSession
			.deleteMany({})
			.then(() => {
				callback && callback();
			})
			.catch((err) => {
				callback && callback(err);
			});
	}

	clean(callback?: ((err?: any, count?: number) => void) | undefined): void {
		const now = new Date();

		this.db.userSession
			.deleteMany({
				where: {
					expiresAt: {
						lt: now,
					},
				},
			})
			.then(({ count }) => {
				callback && callback(null, count);
			})
			.catch((err) => {
				callback && callback(err);
			});
	}

	touch(sid: string, session: SessionData, callback?: ((err?: any) => void) | undefined): void {
		if (!this.allowTouch) {
			callback && callback();
			return;
		}

		let expiresAt: Date;
		if (session.cookie.expires) {
			expiresAt = session.cookie.expires;
		} else {
			expiresAt = new Date(Date.now() + this.maxAge);
		}

		this.db.userSession
			.update({
				where: { sid },
				data: {
					expiresAt,
				},
			})
			.then(() => {
				callback && callback();
			})
			.catch((err) => {
				callback && callback(err);
			});
	}
}
