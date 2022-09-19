import express from "express";
import * as SessionRepository from "./SessionRepository";

declare module "express-session" {
	interface SessionData {
		todoSessionId: string;
	}
}

/**
 * create session record
 * @param req request
 * @param userId userId
 * @returns void
 */
export async function create(req: express.Request, userId: number): Promise<void> {
	await SessionRepository.create(req.sessionID, userId, req.session.cookie);
}

/**
 * remove session record
 * @param sessionId sessionId
 * @returns void
 */
export async function remove(sessionId: string): Promise<void> {
	await SessionRepository.remove(sessionId);
}
