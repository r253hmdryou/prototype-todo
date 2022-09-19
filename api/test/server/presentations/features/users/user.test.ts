import request from "supertest";
import app from "app";

import { UserModel } from "models/UserModel";
import { initializeTest } from "@test/libs/initialize";

{
	initializeTest();

	describe("ユーザーの作成", testCreateUser);
	describe("ユーザーのログイン", testLogin);
	describe("自分のユーザー情報の取得", testGetMe);
}

/**
 * create user and login
 * @returns void
 */
function testCreateUser(): void {
	test("ユーザーが作成できる", async() => {
		// ユーザーを作成
		{
			const response = await request(app)
				.post(`/v1/users`)
				.set("X-Requested-With", "test")
				.send({
					email: "test@example.com",
				});

			// always 201 if email is valid
			expect(response.status).toEqual(201);
		}

		let userId = "";
		// DBを直接見てUUIDを確認
		{
			const models = await UserModel.findAll();
			expect(models.length).toEqual(1);
			expect(models[0].email).toEqual("test@example.com");
			expect(models[0].password).toBeNull();
			userId = models[0].uuid;
		}

		// パスワード登録によるユーザー作成の完了
		{
			const response = await request(app)
				.post(`/v1/users/${userId}`)
				.set("X-Requested-With", "test")
				.send({
					password: "password",
				});

			expect(response.status).toEqual(201);
			expect(response.body).toEqual({
				id: userId,
				email: "test@example.com",
			});
		}
	});

	test("同一のメールアドレスで何度リクエストしてもUUIDは変わらない", async() => {
		// ユーザーを作成
		{
			const response = await request(app)
				.post(`/v1/users`)
				.set("X-Requested-With", "test")
				.send({
					email: "bob@example.com",
				});

			expect(response.status).toEqual(201);
		}

		let userId = "";
		// DBを直接見てUUIDを確認
		{
			const model = await UserModel.findOne({
				where: {
					email: "bob@example.com",
				},
			});
			expect(model).not.toBeNull();
			expect(model?.email).toEqual("bob@example.com");
			expect(model?.password).toBeNull();
			userId = model?.uuid || "";
		}

		// ユーザーを作成 - もう一度同じメールアドレスを使用
		{
			const response = await request(app)
				.post(`/v1/users`)
				.set("X-Requested-With", "test")
				.send({
					email: "bob@example.com",
				});

			expect(response.status).toEqual(201);
		}

		// DBを直接見てUUIDを確認 - UUIDは変わらない
		{
			const model = await UserModel.findOne({
				where: {
					email: "bob@example.com",
				},
			});
			expect(model).not.toBeNull();
			expect(model?.email).toEqual("bob@example.com");
			expect(model?.password).toBeNull();

			expect(model?.uuid).toEqual(userId);
		}
	});

	test("ユーザー作成のパラメーターエラー", async() => {
		// 無効なメールアドレス
		{
			const response = await request(app)
				.post(`/v1/users`)
				.set("X-Requested-With", "test")
				.send({
					email: "invalid",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userCreate",
				message: "Failed to create user",
				errors: [
					{
						code: "invalidUserParamEmailPattern",
						message: "Invalid email pattern",
					},
				],
			});
		}

		// メールアドレスを指定していない
		{
			const response = await request(app)
				.post(`/v1/users`)
				.set("X-Requested-With", "test")
				.send({
					// email: "test@example.com",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userCreate",
				message: "Failed to create user",
				errors: [
					{
						code: "invalidUserParamEmail",
						message: "Invalid email",
					},
				],
			});
		}
	});

	test("既に登録済みのユーザーではsignupできない", async() => {
		let userId: string | undefined = "";
		// 登録済みユーザーのIDを取得
		{
			const model = await UserModel.findOne({
				where: {
					email: "test@example.com",
				},
			});
			expect(model).not.toBeNull();
			expect(model?.password).toMatch("$argon2id"); // パスワードがセットされている
			expect(model?.uuid).toEqual(expect.any(String));
			userId = model?.uuid;
		}

		// signup
		{
			const response = await request(app)
				.post(`/v1/users/${userId}`)
				.set("X-Requested-With", "test")
				.send({
					password: "password",
				});

			expect(response.status).toEqual(403);
			expect(response.body).toEqual({
				code: "userAlreadySignedUp",
				message: "User already signed up",
			});
		}
	});

	test("signupのパラメーターエラー", async() => {
		// ユーザーを作成
		{
			const response = await request(app)
				.post(`/v1/users`)
				.set("X-Requested-With", "test")
				.send({
					email: "signup400@example.com",
				});

			// always 201 if email is valid
			expect(response.status).toEqual(201);
		}

		let userId: string | undefined = "";
		// DBを直接見てUUIDを確認
		{
			const model = await UserModel.findOne({
				where: {
					email: "signup400@example.com",
				},
			});
			expect(model).not.toBeNull();
			expect(model?.email).toEqual("signup400@example.com");
			expect(model?.password).toBeNull();

			userId = model?.uuid;
		}

		// パスワードを指定していない
		{
			const response = await request(app)
				.post(`/v1/users/${userId}`)
				.set("X-Requested-With", "test")
				.send({
					// password: "password",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userSignup",
				message: "Failed to signup user",
				errors: [
					{
						code: "invalidUserParamPassword",
						message: "Invalid password",
					},
				],
			});
		}

		// 最小文字数要件を満たしていない
		{
			const response = await request(app)
				.post(`/v1/users/${userId}`)
				.set("X-Requested-With", "test")
				.send({
					password: "pass",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userSignup",
				message: "Failed to signup user",
				errors: [
					{
						code: "invalidUserParamPasswordMinLength",
						message: "Invalid password. Minimum length is 8",
					},
				],
			});
		}

		// 最大文字数要件を満たしていない
		{
			const response = await request(app)
				.post(`/v1/users/${userId}`)
				.set("X-Requested-With", "test")
				.send({
					password: "a".repeat(101),
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userSignup",
				message: "Failed to signup user",
				errors: [
					{
						code: "invalidUserParamPasswordMaxLength",
						message: "Invalid password. Maximum length is 100",
					},
				],
			});
		}

		// 境界値チェック、100文字ならOK
		{
			const response = await request(app)
				.post(`/v1/users/${userId}`)
				.set("X-Requested-With", "test")
				.send({
					password: "a".repeat(100),
				});

			expect(response.status).toEqual(201);
		}

		// 登録 - 存在しないユーザー
		{
			const response = await request(app)
				.post(`/v1/users/601407ee-4ed3-4271-80b9-89c7f805e53b`)
				.set("X-Requested-With", "test")
				.send({
					password: "password",
				});

			expect(response.status).toEqual(404);
			expect(response.body).toEqual({
				code: "userIdNotFound",
				message: "User not found. id: 601407ee-4ed3-4271-80b9-89c7f805e53b",
			});
		}

		// 登録 - UUID形式ではない
		{
			const response = await request(app)
				.post(`/v1/users/601407ee`)
				.set("X-Requested-With", "test")
				.send({
					password: "password",
				});

			expect(response.status).toEqual(404);
			expect(response.body).toEqual({
				code: "userIdNotFound",
				message: "User not found. id: 601407ee",
			});
		}
	});
}

/**
 * ユーザーのログイン
 * @returns void
 */
function testLogin(): void {
	test("正常にログインできる", async() => {
		// login
		{
			const response = await request(app)
				.post(`/v1/login`)
				.set("X-Requested-With", "test")
				.send({
					email: "test@example.com",
					password: "password",
				});

			expect(response.status).toEqual(201);
		}
	});

	test("ログイン失敗", async() => {
		let cookie = "";
		// login - メールアドレスが異なる
		{
			const response = await request(app)
				.post(`/v1/login`)
				.set("X-Requested-With", "test")
				.send({
					email: "test@example.commm",
					password: "password",
				});

			expect(response.status).toEqual(401);
			expect(response.body).toEqual({
				code: "userLogin",
				message: "Failed to login user",
			});
		}

		// login - パスワードが異なる
		{
			const response = await request(app)
				.post(`/v1/login`)
				.set("X-Requested-With", "test")
				.send({
					email: "test@example.com",
					password: "passworddd",
				});

			expect(response.status).toEqual(401);
			expect(response.body).toEqual({
				code: "userLogin",
				message: "Failed to login user",
			});
			cookie = response.header["set-cookie"];
		}

		// get my user - not logged in cookie
		{
			const response = await request(app)
				.get(`/v1/users/me`)
				.set("X-Requested-With", "test")
				.set("Cookie", cookie);

			expect(response.status).toEqual(401);
			expect(response.body).toEqual({
				code: "unauthorized",
				message: "Unauthorized",
			});
		}

		// login - parameter error
		{
			const response = await request(app)
				.post(`/v1/login`)
				.set("X-Requested-With", "test")
				.send({
					// email: "test@example.com",
					// password: "password",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userLogin",
				message: "Failed to login user",
				errors: [
					{
						code: "invalidUserParamEmail",
						message: "Invalid email",
					},
					{
						code: "invalidUserParamPassword",
						message: "Invalid password",
					},
				],
			});
		}

		// login - parameter error
		{
			const response = await request(app)
				.post(`/v1/login`)
				.set("X-Requested-With", "test")
				.send({
					email: "invalid", // invalid email
					password: "a".repeat(101),
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userLogin",
				message: "Failed to login user",
				errors: [
					{
						code: "invalidUserParamEmailPattern",
						message: "Invalid email pattern",
					},
					{
						code: "invalidUserParamPasswordMaxLength",
						message: "Invalid password. Maximum length is 100",
					},
				],
			});
		}
	});
}

/**
 * 自分のユーザー情報の取得
 * @returns void
 */
function testGetMe(): void {
	test("自分のユーザー情報の取得", async() => {
		let cookie = "";

		// ログイン
		{
			const response = await request(app)
				.post(`/v1/login`)
				.set("X-Requested-With", "test")
				.set("Cookie", cookie)
				.send({
					email: "test@example.com",
					password: "password",
				});

			expect(response.status).toEqual(201);
			cookie = response.header["set-cookie"];
		}

		// ユーザー情報の取得
		{
			const response = await request(app)
				.get(`/v1/users/me`)
				.set("X-Requested-With", "test")
				.set("Cookie", cookie);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				id: expect.any(String),
				email: "test@example.com",
			});
		}

		// logout
		{
			const response = await request(app)
				.post(`/v1/logout`)
				.set("X-Requested-With", "test")
				.set("Cookie", cookie);

			expect(response.status).toEqual(200);
		}

		// get my user
		{
			const response = await request(app)
				.get(`/v1/users/me`)
				.set("X-Requested-With", "test")
				.set("Cookie", cookie);

			expect(response.status).toEqual(401);
			expect(response.body).toEqual({
				code: "unauthorized",
				message: "Unauthorized",
			});
		}
	});

	test("ログインしていなければ情報を取得できない", async() => {
		let cookie = "";
		// login - parameter error
		{
			const response = await request(app)
				.post(`/v1/login`)
				.set("X-Requested-With", "test")
				.send({
					email: "test@example.com",
					password: "pass",
				});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				code: "userLogin",
				message: "Failed to login user",
				errors: [
					{
						code: "invalidUserParamPasswordMinLength",
						message: "Invalid password. Minimum length is 8",
					},
				],
			});
			cookie = response.headers["set-cookie"];
		}

		// get my user - not logged in cookie
		{
			const response = await request(app)
				.get(`/v1/users/me`)
				.set("X-Requested-With", "test")
				.set("Cookie", cookie);

			expect(response.status).toEqual(401);
			expect(response.body).toEqual({
				code: "unauthorized",
				message: "Unauthorized",
			});
		}

		// get my user - cookie does not exist
		{
			const response = await request(app)
				.get(`/v1/users/me`)
				.set("X-Requested-With", "test");

			expect(response.status).toEqual(401);
			expect(response.body).toEqual({
				code: "unauthorized",
				message: "Unauthorized",
			});
		}
	});
}
