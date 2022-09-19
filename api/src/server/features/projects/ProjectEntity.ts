import { Entity } from "common/entity";
import { generateUuid } from "libs/utils";

import { UserEntity } from "features/users/UserEntity";
import { ProjectModel, AccessLevel as ModelAccessLevel, Type as ModelType } from "models/ProjectModel";

export const enum AccessLevel {
	PRIVATE = "private",
	PUBLIC = "public",
}

export const enum Type {
	PERSONAL = "personal",
}

type PropertiesEssential = {
	readonly name: string;
	readonly description: string;
	readonly accessLevel: AccessLevel;
	readonly type: Type;
	readonly userId: number | null;
}

type Properties = {
	readonly id?: number;
	readonly uuid: string;
	name: string;
	description: string;
	accessLevel: AccessLevel;
	type: Type;
	userId: number | null;

	readonly user?: UserEntity | null;

	readonly createdAt: number;
	deletedAt: number | null;
}

export class ProjectEntity extends Entity<Properties> {

	static factory(properties: PropertiesEssential, user?: UserEntity): ProjectEntity {
		return new ProjectEntity({
			uuid: generateUuid(),
			name: properties.name,
			description: properties.description,
			accessLevel: properties.accessLevel,
			type: properties.type,
			userId: properties.userId,

			user: user,

			createdAt: Date.now(),
			deletedAt: null,
		});
	}

	static fromModel(model: ProjectModel): ProjectEntity {
		return new ProjectEntity({
			id: model.id,
			uuid: model.uuid,
			name: model.name,
			description: model.description,
			accessLevel: ProjectEntity.fromModel$accessLevel(model.accessLevel),
			type: ProjectEntity.fromModel$type(model.type),
			userId: model.userId,

			createdAt: model.createdAt,
			deletedAt: model.deletedAt,

			user: model.user && UserEntity.fromModel(model.user),
		});
	}

	static fromModel$accessLevel(accessLevel: ModelAccessLevel): AccessLevel {
		switch(accessLevel) {

		case ModelAccessLevel.PRIVATE:
			return AccessLevel.PRIVATE;

		case ModelAccessLevel.PUBLIC:
			return AccessLevel.PUBLIC;

		}
	}

	static fromModel$type(type: ModelType): Type {
		switch(type) {

		case ModelType.PERSONAL:
			return Type.PERSONAL;

		}
	}

	get id(): number {
		return this.getPropertiyOrRaiseIfUndefined(this.properties.id);
	}

	get uuid(): string {
		return this.properties.uuid;
	}

	get name(): string {
		return this.properties.name;
	}

	get description(): string {
		return this.properties.description;
	}

	get accessLevel(): AccessLevel {
		return this.properties.accessLevel;
	}

	get type(): Type {
		return this.properties.type;
	}

	get userId(): number | null {
		return this.properties.userId;
	}

	get user(): UserEntity | null {
		return this.getPropertiyOrRaiseIfUndefined(this.properties.user);
	}

	get createdAt(): number {
		return this.properties.createdAt;
	}

	get deletedAt(): number | null {
		return this.properties.deletedAt;
	}
}
