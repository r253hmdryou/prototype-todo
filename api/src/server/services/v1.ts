import express from "express";
import * as UserUsecase from "features/users/UserUsecase";
import { Login, Me } from "types/api";

/**
 * POST /v1/login
 * login
 * @param req request
 * @param email email
 * @param password password
 * @returns void
 */
export async function postLogin(req: express.Request, email: string, password: string): Promise<Login.Login.ResponseBody> {
	const user = await UserUsecase.login(req, email, password);
	return UserUsecase.toResponse(user);
}

/**
 * POST /v1/logout
 * @param sessionId sessionId
 * @returns void
 */
export async function postLogout(sessionId: string): Promise<void> {
	await UserUsecase.logout(sessionId);
}

/**
 * GET /v1/users/me
 * get my user
 * @param sessionID sessionID
 * @returns user
 */
export async function getMe(sessionID: string): Promise<Me.GetMyUser.ResponseBody> {
	const user = await UserUsecase.findAuthorizedUser(sessionID);
	return UserUsecase.toResponse(user);
}
