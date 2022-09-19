import * as UserUsecase from "features/users/UserUsecase";
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
