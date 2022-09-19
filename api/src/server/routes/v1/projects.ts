import express from "express";

import { routingHandler } from "libs/handler";
import * as services from "services/v1/projects";

import * as validators from "validators/v1/projects";
import { Projects } from "types/api";

/**
 * routing users
 * @returns Router
 */
export function routing(): express.Router {
	return express.Router()
		.post("/", routingHandler(post));
}

/**
 * POST /v1/projects
 * create new project
 * @param req request
 * @param res response
 * @returns void
 */
async function post(req: express.Request, res: express.Response): Promise<void> {
	const reqBody: Projects.CreateProject.RequestBody = validators.BodyPost(req);
	const resBody: Projects.CreateProject.ResponseBody = await services.post(req.sessionID, reqBody);

	res
		.status(201)
		.send(resBody);
}
