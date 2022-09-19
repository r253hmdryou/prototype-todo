import { Project, ProjectAccessLevel } from "types/api";

import { AccessLevel, ProjectEntity } from "./ProjectEntity";
import * as ProjectRepository from "./ProjectRepository";

import { UserEntity } from "features/users/UserEntity";

/**
 * AccessLevelを文字列から変換する
 * @param accessLevelString AccessLevelString
 * @returns AccessLevel
 */
export function convertAccessLevel(accessLevelString: ProjectAccessLevel): AccessLevel {
	switch (accessLevelString) {

	case ProjectAccessLevel.Private:
		return AccessLevel.PRIVATE;

	case ProjectAccessLevel.Public:
		return AccessLevel.PUBLIC;

	}
}

/**
 * プロジェクトを作成する
 * @param user ユーザー
 * @param name プロジェクト名
 * @param description プロジェクトの説明
 * @param accessLevel 公開範囲
 * @returns 作成されたプロジェクト
 */
export async function create(user: UserEntity, name: string, description: string, accessLevel: AccessLevel): Promise<ProjectEntity> {
	const project = ProjectEntity.factory({
		name: name,
		description: description,
		accessLevel: accessLevel,
		owner: user,
	});

	await ProjectRepository.save(project);
	return project;
}

/**
 * レスポンス用に変換する
 * @param project プロジェクト
 * @returns レスポンス
 */
export function toResponse(project: ProjectEntity): Project {
	return {
		id: project.uuid,
		name: project.name,
		description: project.description,
		accessLevel: toResponse$accessLevel(project.accessLevel),
		createdAt: project.createdAt,
	};
}

/**
 * レスポンス用に変換する; 公開範囲
 * @param accessLevel 公開範囲
 * @returns 公開範囲
 */
export function toResponse$accessLevel(accessLevel: AccessLevel): ProjectAccessLevel {
	switch (accessLevel) {

	case AccessLevel.PRIVATE:
		return ProjectAccessLevel.Private;

	case AccessLevel.PUBLIC:
		return ProjectAccessLevel.Public;

	}
}
