import { Project, ProjectAccessLevel, ProjectTypePersonal } from "types/api";

import { AccessLevel, ProjectEntity, Type } from "./ProjectEntity";
import * as ProjectRepository from "./ProjectRepository";

import { UserEntity } from "features/users/UserEntity";

/**
 * 自身のすべての個人プロジェクトを取得する
 * @param user ユーザー
 * @returns プロジェクト
 */
export async function findAllMyPersonal(user: UserEntity): Promise<ProjectEntity[]> {
	return await ProjectRepository.findAllMyPersonal(user);
}

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
 * Typeを文字列から変換する
 * @param typeString TypeString
 * @returns Type
 */
export function convertType(typeString: ProjectTypePersonal): Type {
	switch (typeString) {

	case ProjectTypePersonal.Personal:
		return Type.PERSONAL;

	}
}

/**
 * プロジェクトを作成する
 * @param user ユーザー
 * @param name プロジェクト名
 * @param description プロジェクトの説明
 * @param accessLevel 公開範囲
 * @param type プロジェクトの種類
 * @returns 作成されたプロジェクト
 */
export async function create(user: UserEntity, name: string, description: string, accessLevel: AccessLevel, type: Type): Promise<ProjectEntity> {
	const project = ProjectEntity.factory({
		name: name,
		description: description,
		accessLevel: accessLevel,
		type: type,
		userId: user.id,
	}, user);

	await ProjectRepository.save(project);
	return project;
}

/**
 * 個人プロジェクトを作成する
 * @param user ユーザー
 * @param name プロジェクト名
 * @param description プロジェクトの説明
 * @param accessLevel 公開範囲
 * @returns 作成されたプロジェクト
 */
export async function createPersonal(user: UserEntity, name: string, description: string, accessLevel: AccessLevel): Promise<ProjectEntity> {
	return await create(user, name, description, accessLevel, Type.PERSONAL);
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
		type: toResponse$type(project.type),
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

/**
 * レスポンス用に変換する; プロジェクトの種類
 * @param type プロジェクトの種類
 * @returns プロジェクトの種類
 */
export function toResponse$type(type: Type): ProjectTypePersonal {
	switch (type) {

	case Type.PERSONAL:
		return ProjectTypePersonal.Personal;

	}
}
