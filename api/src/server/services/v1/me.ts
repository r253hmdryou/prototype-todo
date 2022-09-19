import * as UserUsecase from "features/users/UserUsecase";
import * as ProjectUsecase from "features/projects/ProjectUsecase";
import { Me, Projects } from "types/api";

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
export async function postProjects(sessionID: string, input: Projects.CreateProject.RequestBody): Promise<Projects.CreateProject.ResponseBody> {
	const accessLevel = ProjectUsecase.convertAccessLevel(input.accessLevel);
	const type = ProjectUsecase.convertType(input.type);
	const user = await UserUsecase.findAuthorizedUser(sessionID);
	const project = await ProjectUsecase.create(user, input.name, input.description, accessLevel, type);
	return ProjectUsecase.toResponse(project);
}
