import { AccessLevel, ProjectModel, Type } from "models/ProjectModel";
import { ProjectEntity, AccessLevel as EntityAccessLevel, Type as EntityType } from "./ProjectEntity";

/**
 * エンティティーを永続化する
 * @param project プロジェクト
 * @returns void
 */
export async function save(project: ProjectEntity): Promise<void> {
	const model = toModel(project);
	await model.save();
}

/**
 * モデルに変換
 * @param project プロジェクト
 * @returns モデル
 */
function toModel(project: ProjectEntity): ProjectModel {
	const model = new ProjectModel({
		uuid: project.uuid,
		name: project.name,
		description: project.description,
		accessLevel: toModel$accessLevel(project.accessLevel),
		type: toModel$type(project.type),
		userId: project.user.id,
		createdAt: project.createdAt,
		deletedAt: project.deletedAt,
	});

	if(!project.isNewRecord) {
		model.id = project.id;
	}

	return model;
}

/**
 * モデルに変換; 公開範囲
 * @param accessLevel 公開範囲
 * @returns 公開範囲
 */
function toModel$accessLevel(accessLevel: EntityAccessLevel): AccessLevel {
	switch (accessLevel) {

	case EntityAccessLevel.PRIVATE:
		return AccessLevel.PRIVATE;

	case EntityAccessLevel.PUBLIC:
		return AccessLevel.PUBLIC;

	}
}

/**
 * モデルに変換; プロジェクトの種類
 * @param type プロジェクトの種類
 * @returns プロジェクトの種類
 */
function toModel$type(type: EntityType): Type {
	switch (type) {

	case EntityType.PERSONAL:
		return Type.PERSONAL;

	}
}
