import request from "supertest";
import app from "app";

import { initializeTest } from "@test/libs/initialize";

import { getCookie, registerUser } from "@test/libs/register";
import mockDate from "@test/libs/date";

{
	initializeTest();

	describe("プロジェクトの作成", testCreateProject);
}

/**
 * プロジェクトの作成
 * @returns void
 */
function testCreateProject(): void {
	test("ログインしていない状態ではプロジェクトを作成することができない", async() => {
		// プロジェクトを作成
		{
			const response = await request(app)
				.post(`/v1/projects`)
				.set("X-Requested-With", "test")
				.send({
					name: "project",
					description: "private project",
					accessLevel: "private",
					type: "personal",
				});

			expect(response.status).toEqual(401);
		}
	});

	test("ログインするとプロジェクトを作成できる", async() => {
		// ユーザーを作成
		await registerUser("alice@example.com", "password");
		const aliceCookie = await getCookie("alice@example.com", "password");

		// プロジェクトを作成 - private
		mockDate(1663513200000, async() => {
			const response = await request(app)
				.post(`/v1/projects`)
				.set("X-Requested-With", "test")
				.set("Cookie", aliceCookie)
				.send({
					name: "aliceProject",
					description: "private project of Alice",
					accessLevel: "private",
					type: "personal",
				});

			expect(response.status).toEqual(201);
			expect(response.body).toEqual({
				id: expect.any(String),
				name: "aliceProject",
				description: "private project of Alice",
				accessLevel: "private",
				type: "personal",
				createdAt: 1663513200000,
			});
		});

		// プロジェクトを作成 - public
		mockDate(1663513200000, async() => {
			const response = await request(app)
				.post(`/v1/projects`)
				.set("X-Requested-With", "test")
				.set("Cookie", aliceCookie)
				.send({
					name: "aliceProject",
					description: "public project of Alice",
					accessLevel: "public",
					type: "personal",
				});

			expect(response.status).toEqual(201);
			expect(response.body).toEqual({
				id: expect.any(String),
				name: "aliceProject",
				description: "public project of Alice",
				accessLevel: "public",
				type: "personal",
				createdAt: 1663513200000,
			});
		});
	});

	test("プロジェクトを作成するためのパラメーターが足りない", async() => {
		const aliceCookie = await getCookie("alice@example.com", "password");

		// プロジェクトを作成 - パラメーター無し
		{
			const response = await request(app)
				.post(`/v1/projects`)
				.set("X-Requested-With", "test")
				.set("Cookie", aliceCookie);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "projectCreate",
				message: "Failed to create project",
				errors: [
					{
						code: "invalidProjectParamName",
						message: "Invalid name",
					},
					{
						code: "invalidProjectParamDescription",
						message: "Invalid description",
					},
					{
						code: "invalidProjectParamAccessLevel",
						message: "Invalid accessLevel. accessLevel must be one of 'public', 'private'",
					},
					{
						code: "invalidProjectParamType",
						message: "Invalid type. type must be one of 'personal'",
					},
				],
			});
		}

		// プロジェクトを作成 - 規定の文字数以上 / 許可されていないアクセスレベル
		{
			const response = await request(app)
				.post(`/v1/projects`)
				.set("X-Requested-With", "test")
				.set("Cookie", aliceCookie)
				.send({
					name: "a".repeat(21),
					description: "a".repeat(1001),
					accessLevel: "invalid",
					type: "invalid",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "projectCreate",
				message: "Failed to create project",
				errors: [
					{
						code: "invalidProjectParamNameMaxLength",
						message: "Invalid name, maximum length is 20",
					},
					{
						code: "invalidProjectParamDescriptionMaxLength",
						message: "Invalid description, maximum length is 1000",
					},
					{
						code: "invalidProjectParamAccessLevel",
						message: "Invalid accessLevel. accessLevel must be one of 'public', 'private'",
					},
					{
						code: "invalidProjectParamType",
						message: "Invalid type. type must be one of 'personal'",
					},
				],
			});
		}

		// プロジェクトを作成 - nameが空文字
		{
			const response = await request(app)
				.post(`/v1/projects`)
				.set("X-Requested-With", "test")
				.set("Cookie", aliceCookie)
				.send({
					name: "",
					description: "project description",
					accessLevel: "public",
					type: "personal",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "projectCreate",
				message: "Failed to create project",
				errors: [
					{
						code: "invalidProjectParamNameEmpty",
						message: "Invalid name, name is empty",
					},
				],
			});
		}
	});
}
