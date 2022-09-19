import express from "express";

import { routingHandler } from "libs/handler";
import * as services from "services/v1/me";

import * as validators from "validators/v1/me";
import { Me, Projects } from "types/api";

/**
 * routing me
 * @returns Router
 */
export function routing(): express.Router {
	return express.Router()
		.get("/", routingHandler(get))
		.get("/projects", routingHandler(getProjects))
		.post("/projects", routingHandler(postProjects));
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

/**
 * POST /v1/me/projects
 * create new project
 * @param req request
 * @param res response
 * @returns void
 */
async function postProjects(req: express.Request, res: express.Response): Promise<void> {
	const reqBody: Projects.CreateProject.RequestBody = validators.BodyPostProjects(req);
	const resBody: Projects.CreateProject.ResponseBody = await services.postProjects(req.sessionID, reqBody);

	res
		.status(201)
		.send(resBody);
}
