import { UserEntity } from "features/users/UserEntity";
import { AccessLevel, ProjectModel, Type } from "models/ProjectModel";
import { ProjectEntity, AccessLevel as EntityAccessLevel, Type as EntityType } from "./ProjectEntity";

/**
 * 自身のすべての個人プロジェクトを取得する
 * @param user ユーザー
 * @returns プロジェクト
 */
export async function findAllMyPersonal(user: UserEntity): Promise<ProjectEntity[]> {
	const models = await ProjectModel.findAll({
		where: {
			...buildTypeCondition(EntityType.PERSONAL),
			...buildUserCondition(user),
		},
	});
	return models.map(ProjectEntity.fromModel);
}

/**
 * Typeの条件を構築する
 * @param type Type
 * @returns Typeの条件
 */
function buildTypeCondition(type: EntityType): { type: Type } {
	return {
		type: toModel$type(type),
	};
}

/**
 * 作成者の条件を構築する
 * @param user ユーザー
 * @returns 作成者の条件
 */
function buildUserCondition(user: UserEntity): { userId: number } {
	return {
		userId: user.id,
	};
}

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
		userId: project.userId,
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
