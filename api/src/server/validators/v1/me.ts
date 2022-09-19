import express from "express";
import vs from "value-schema";

import { AppError } from "libs/error/AppError";
import { ErrorMessage, errorMessages } from "libs/error/messages";

import { ProjectAccessLevel, Projects, ProjectTypePersonal } from "types/api";
import { RULE } from "../common";
import { Key } from "value-schema/dist/libs/types";
import { project } from "libs/validator";

const schemaBodyPostProjects = {
	name: vs.string({
		maxLength: project.name.maxLength,
	}),
	description: vs.string({
		ifEmptyString: "",
		maxLength: project.description.maxLength,
	}),
	accessLevel: vs.enumeration({
		only: [ProjectAccessLevel.Private, ProjectAccessLevel.Public],
	}),
	type: vs.enumeration({
		only: [ProjectTypePersonal.Personal],
	}),
};

/**
 * POST /v1/project
 * create new project
 * @param req request
 * @returns RequestBody
 */
export function BodyPostProjects(req: express.Request): Projects.CreateProject.RequestBody {
	const appError = AppError.factory(errorMessages.project.create);

	return vs.applySchemaObject(schemaBodyPostProjects, req.body, (error) => {
		const key = error.keyStack.shift();
		appError.addError(assignError(key, error.rule));
	}, () => {
		appError.raiseIfError();
	});
}

/**
 * assign error
 * @param key key
 * @param rule rule
 * @returns error message
 */
function assignError(key: Key | undefined, rule: RULE): ErrorMessage {
	switch(key) {
	case "name":
		switch(rule) {
		case vs.RULE.EMPTY_STRING:
			return errorMessages.project.param.name.empty;
		case vs.RULE.MAX_LENGTH:
			return errorMessages.project.param.name.maxLength;
		default:
			return errorMessages.project.param.name.default;
		}
	case "description":
		switch(rule) {
		case vs.RULE.MAX_LENGTH:
			return errorMessages.project.param.description.maxLength;
		default:
			return errorMessages.project.param.description.default;
		}
	case "accessLevel":
		return errorMessages.project.param.accessLevel.default;
	case "type":
		return errorMessages.project.param.type.default;
	default:
		return errorMessages.general.badRequest;
	}
}
