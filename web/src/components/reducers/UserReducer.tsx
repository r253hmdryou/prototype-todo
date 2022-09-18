import React from "react";
import { Api, Login } from "@/api/api";

/**
 * 認証されていればユーザーデータが入る
 * 認証されていなければ false になる
 * 認証処理をしていなければ null になる
 */
export type User = false | null | {
	id: string,
	email: string,
};
export type UserAction = {
	type: "loginSuccess",
	payload: Login.Login.ResponseBody,
} | {
	type: "failedToLogin",
} | {
	type: "logout",
};

export const userInitialState = null;

const userReducer: React.Reducer<User, UserAction> = (_state, action): User => {
	switch(action.type){
	case "loginSuccess":
		return {
			...action.payload,
		};
	case "failedToLogin":
		return false;
	case "logout":
		(new Api).logout.logout({
			credentials: "include",
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
		});
		return false;
	}
};

export const useUserReducer = () => {
	return React.useReducer(userReducer, userInitialState);
};
