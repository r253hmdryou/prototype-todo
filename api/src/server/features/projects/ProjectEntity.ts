import { Entity } from "common/entity";
import { generateUuid } from "libs/utils";

import { UserEntity } from "features/users/UserEntity";

export const enum AccessLevel {
	PRIVATE = "private",
	PUBLIC = "public",
}

type PropertiesEssential = {
	readonly owner: UserEntity;
	readonly name: string;
	readonly description: string;
	readonly accessLevel: AccessLevel;
}

type Properties = {
	readonly id?: number;
	readonly uuid: string;
	name: string;
	description: string;
	accessLevel: AccessLevel;

	readonly owner: UserEntity;

	readonly createdAt: number;
	deletedAt: number | null;
}

export class ProjectEntity extends Entity<Properties> {

	static factory(properties: PropertiesEssential): ProjectEntity {
		return new ProjectEntity({
			uuid: generateUuid(),
			name: properties.name,
			description: properties.description,
			accessLevel: properties.accessLevel,

			owner: properties.owner,

			createdAt: Date.now(),
			deletedAt: null,
		});
	}

	// static fromModel(model: ProjectModel): ProjectEntity {
	// 	return new ProjectEntity({
	// 		id: model.id,
	// 		uuid: model.uuid,
	// 		email: model.email,
	// 		password: model.password,
	// 		createdAt: model.createdAt,
	// 		deletedAt: model.deletedAt,
	// 	});
	// }

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

	get owner(): UserEntity {
		return this.properties.owner;
	}

	get createdAt(): number {
		return this.properties.createdAt;
	}

	get deletedAt(): number | null {
		return this.properties.deletedAt;
	}
}
