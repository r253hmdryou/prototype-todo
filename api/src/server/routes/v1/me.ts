import express from "express";

import { routingHandler } from "libs/handler";
import * as services from "services/v1/me";

import { Me } from "types/api";

/**
 * routing me
 * @returns Router
 */
export function routing(): express.Router {
	return express.Router()
		.get("/", routingHandler(get))
		.get("/projects", routingHandler(getProjects));
}

/**
 * GET /v1/me
 * get my user
 * @param req request
 * @param res response
 * @returns void
 */
async function get(req: express.Request, res: express.Response): Promise<void> {
	const resBody: Me.GetMyUser.ResponseBody = await services.get(req.sessionID);
	res
		.status(200)
		.send(resBody);
}

/**
 * GET /v1/me/projects
 * get my projects
 * @param req request
 * @param res response
 * @returns void
 */
async function getProjects(req: express.Request, res: express.Response): Promise<void> {
	const resBody: Me.GetMyPersonalProjects.ResponseBody = await services.getProjects(req.sessionID);
	res
		.status(200)
		.send(resBody);
}
