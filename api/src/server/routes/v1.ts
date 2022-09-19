import express from "express";

import { routingHandler } from "libs/handler";

import {routing as routingMe} from "./v1/me";
import {routing as routingUsers} from "./v1/users";
import {routing as routingProjects} from "./v1/projects";

import * as services from "services/v1";
import { Login } from "types/api";
import * as validators from "validators/v1";

/**
 * routing function
 * @returns Router
 */
export function routing(): express.Router {
	return express.Router()
		.use("/me", routingMe())
		.use("/users", routingUsers())
		.use("/projects", routingProjects())
		.get("/hello", routingHandler(getHello))
		.post("/login", routingHandler(postLogin))
		.post("/logout", routingHandler(postLogout));
}

/**
 * GET /hello
 * Hello World
 * @param _req request
 * @param res response
 * @returns void
 */
async function getHello(_req: express.Request, res: express.Response): Promise<void> {
	res
		.status(200)
		.json("Hello World!!");
}

/**
 * POST /v1/login
 * login
 * @param req request
 * @param res response
 * @returns void
 */
async function postLogin(req: express.Request, res: express.Response): Promise<void> {
	const reqBody: Login.Login.RequestBody = validators.BodyPostLogin(req);
	const resBody: Login.Login.ResponseBody = await services.postLogin(req, reqBody.email, reqBody.password);
	res
		.status(201)
		.send(resBody);
}

/**
 * POST /v1/logout
 * disable cookie to logout
 * @param req request
 * @param res response
 * @returns void
 */
async function postLogout(req: express.Request, res: express.Response): Promise<void> {
	await services.postLogout(req.sessionID);
	res
		.status(200)
		.send();
}
