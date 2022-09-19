
import * as ProjectUsecase from "features/projects/ProjectUsecase";
import * as UserUsecase from "features/users/UserUsecase";

import { Projects } from "types/api";

/**
 * POST /v1/projects
 * create new project
 * @param sessionID sessionID
 * @param input プロジェクト作成に必要なデータ
 * @returns 作成されたプロジェクト
 */
export async function post(sessionID: string, input: Projects.CreateProject.RequestBody): Promise<Projects.CreateProject.ResponseBody> {
	const accessLevel = ProjectUsecase.convertAccessLevel(input.accessLevel);
	const type = ProjectUsecase.convertType(input.type);
	const user = await UserUsecase.findAuthorizedUser(sessionID);
	const project = await ProjectUsecase.create(user, input.name, input.description, accessLevel, type);
	return ProjectUsecase.toResponse(project);
}
