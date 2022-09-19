import request from "supertest";
import app from "app";

import { UserModel } from "models/UserModel";

import {UserForMe} from "types/api";

/**
 * ユーザーを登録する
 * @param email メールアドレス
 * @param password パスワード
 * @returns ユーザー情報
 */
export async function registerUser(email: string, password: string): Promise<UserForMe> {
	await request(app)
		.post(`/v1/users`)
		.set("X-Requested-With", "test")
		.send({
			email: email,
		});

	const model = await UserModel.findOne({
		where: {
			email: email,
		},
	});

	// signup
	const response = await request(app)
		.post(`/v1/users/${model?.uuid}`)
		.set("X-Requested-With", "test")
		.send({
			password: password,
		});

	expect(response.status).toEqual(201);
	return response.body;
}

/**
 * ログインしてクッキーを取得する
 * @param email メールアドレス
 * @param password パスワード
 * @returns クッキー
 */
export async function getCookie(email: string, password: string): Promise<string> {
	const response = await request(app)
		.post(`/v1/login`)
		.set("X-Requested-With", "test")
		.send({
			email: email,
			password: password,
		});

	expect(response.status).toEqual(201);
	return response.header["set-cookie"];
}
