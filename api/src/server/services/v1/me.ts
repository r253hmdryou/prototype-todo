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

/**
 * POST /v1/projects
 * create new project
 * @param sessionID sessionID
 * @param input プロジェクト作成に必要なデータ
 * @returns 作成されたプロジェクト
 */
export async function postProjects(sessionID: string, input: Me.CreatePersonalProject.RequestBody): Promise<Me.CreatePersonalProject.ResponseBody> {
	const accessLevel = ProjectUsecase.convertAccessLevel(input.accessLevel);
	const user = await UserUsecase.findAuthorizedUser(sessionID);
	const project = await ProjectUsecase.createPersonal(user, input.name, input.description, accessLevel);
	return ProjectUsecase.toResponse(project);
}
