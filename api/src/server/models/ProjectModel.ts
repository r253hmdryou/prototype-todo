import { sequelize } from "common/repository";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { UserModel } from "./UserModel";

const TABLENAME = "projects";

export const enum AccessLevel {
	PUBLIC = 0,
	PRIVATE = 1,
}

export const enum Type {
	PERSONAL = 0,
}

export class ProjectModel extends Model<InferAttributes<ProjectModel>, InferCreationAttributes<ProjectModel>> {
	declare id: CreationOptional<number>;
	declare uuid: string;
	declare name: string;
	declare description: string;
	declare accessLevel: number;
	declare type: number;
	declare userId: number | null;
	declare createdAt: number;
	declare deletedAt: number | null;

	declare user?: NonAttribute<UserModel>;
}

ProjectModel.init({
	id: {
		primaryKey: true,
		autoIncrement: true,
		type: DataTypes.BIGINT.UNSIGNED,
	},
	uuid: {
		comment: "UUID",
		allowNull: false,
		type: DataTypes.UUID,
		unique: true,
	},
	name: {
		comment: "プロジェクト名",
		allowNull: false,
		type: DataTypes.TEXT("tiny"),
	},
	description: {
		comment: "プロジェクトの説明",
		allowNull: false,
		type: DataTypes.TEXT("medium"),
	},
	accessLevel: {
		comment: "アクセスレベル",
		allowNull: false,
		type: DataTypes.TINYINT.UNSIGNED,
	},
	type: {
		comment: "プロジェクトの区分（個人、チーム等）",
		allowNull: false,
		type: DataTypes.TINYINT.UNSIGNED,
	},
	userId: {
		comment: "作成者ID",
		allowNull: true,
		type: DataTypes.BIGINT.UNSIGNED,
	},
	createdAt: {
		comment: "作成日時[ms]",
		allowNull: false,
		type: DataTypes.BIGINT.UNSIGNED,
	},
	deletedAt: {
		comment: "削除日時[ms]",
		allowNull: true,
		type: DataTypes.BIGINT.UNSIGNED,
	},
}, {
	sequelize,
	tableName: TABLENAME,
	underscored: true,
	timestamps: false,
	indexes: [
		{
			unique: false,
			name: `IDX:${TABLENAME}:access_level`,
			fields: ["access_level"],
		},
		{
			unique: false,
			name: `IDX:${TABLENAME}:created_at`,
			fields: ["created_at"],
		},
		{
			unique: false,
			name: `IDX:${TABLENAME}:deleted_at`,
			fields: ["deleted_at"],
		},
	],
});

ProjectModel.belongsTo(UserModel, {
	foreignKey: "userId",
	targetKey: "id",
});

UserModel.hasMany(ProjectModel, {
	foreignKey: "userId",
});
