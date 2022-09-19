import { AccessLevel, ProjectEntity, Type } from "features/projects/ProjectEntity";
import { UserEntity } from "features/users/UserEntity";

{
	describe("ProjectEntityのテスト", testProjectEntity);
}

/**
 * ProjectEntityのテスト
 * @returns void
 */
function testProjectEntity(): void {
	test("factory直後は永続化されていないためidを取得できない", async() => {
		const user = UserEntity.factory({
			email: "test@example.com",
		});

		const project = ProjectEntity.factory({
			name: "test",
			description: "test",
			accessLevel: AccessLevel.PRIVATE,
			user: user,
			type: Type.PERSONAL,
		});

		expect(() => {
			project.id;
		}).toThrow();
	});
}
