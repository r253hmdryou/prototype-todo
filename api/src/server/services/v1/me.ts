import * as UserUsecase from "features/users/UserUsecase";
import * as ProjectUsecase from "features/projects/ProjectUsecase";
import { Me } from "types/api";

/**
 * GET /v1/me
 * get my user
 * @param sessionID sessionID
 * @returns user
 */
export async function get(sessionID: string): Promise<Me.GetMyUser.ResponseBody> {
	const user = await UserUsecase.findAuthorizedUser(sessionID);
	return UserUsecase.toResponse(user);
}

/**
 * GET /v1/me/projects
 * get my projects
 * @param sessionID sessionID
 * @returns projects
 */
export async function getProjects(sessionID: string): Promise<Me.GetMyPersonalProjects.ResponseBody> {
	const user = await UserUsecase.findAuthorizedUser(sessionID);
	const projects = await ProjectUsecase.findAllMyPersonal(user);
	return projects.map(ProjectUsecase.toResponse);
}
