import {DataTypes, QueryInterface, Sequelize} from "sequelize";

const TABLENAME = "projects";

/**
 * up
 * @param queryInterface QueryInterface
 * @param _sequelize Sequelize
 * @returns void
 */
export async function up(queryInterface: QueryInterface, _sequelize: Sequelize): Promise<void> {
	await queryInterface.createTable(TABLENAME, {
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
		access_level: {
			comment: "アクセスレベル",
			allowNull: false,
			type: DataTypes.TINYINT.UNSIGNED,
		},
		type: {
			comment: "プロジェクトの区分（個人、チーム等）",
			allowNull: false,
			type: DataTypes.TINYINT.UNSIGNED,
		},
		user_id: {
			comment: "作成者ID",
			allowNull: true,
			type: DataTypes.BIGINT.UNSIGNED,
		},
		created_at: {
			comment: "作成日時[ms]",
			allowNull: false,
			type: DataTypes.BIGINT.UNSIGNED,
		},
		deleted_at: {
			comment: "削除日時[ms]",
			allowNull: true,
			type: DataTypes.BIGINT.UNSIGNED,
		},
	});

	await queryInterface.addConstraint(TABLENAME, {
		type: "foreign key",
		name: `FK:${TABLENAME}:user_id`,
		fields: ["user_id"],
		references: {
			table: "users",
			field: "id",
		},
		onDelete: "SET NULL",
		onUpdate: "CASCADE",
	});

	await queryInterface.addIndex(TABLENAME, {
		unique: false,
		name: `IDX:${TABLENAME}:access_level`,
		fields: ["access_level"],
	});
	await queryInterface.addIndex(TABLENAME, {
		unique: false,
		name: `IDX:${TABLENAME}:created_at`,
		fields: ["created_at"],
	});
	await queryInterface.addIndex(TABLENAME, {
		unique: false,
		name: `IDX:${TABLENAME}:deleted_at`,
		fields: ["deleted_at"],
	});
}

/**
 * down
 * @param queryInterface QueryInterface
 * @param _sequelize Sequelize
 * @returns void
 */
export async function down(queryInterface: QueryInterface, _sequelize: Sequelize): Promise<void> {
	await queryInterface.dropTable(TABLENAME);
}
