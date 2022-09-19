import { createInMemoryDatabase, dropDatabase } from "@test/libs/sequelize";

/**
 * initialize
 * @returns void
 */
export function initializeTest(): void {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let sequelize: any = null;
	beforeAll(async() => {
		sequelize = await createInMemoryDatabase();
	});
	afterAll(async() => {
		await dropDatabase(sequelize);
	});
}
