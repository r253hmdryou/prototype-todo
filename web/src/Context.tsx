import React from "react";

import { Api } from "@/api/api";

import { UserAction, userInitialState, User, useUserReducer } from "@/components/reducers/UserReducer";

type Props = {
	children: React.ReactNode;
}

export function Context({children}: Props) {

	return (
		<UserContextWrapper>
			{children}
		</UserContextWrapper>
	);
}

export const UserStateContext = React.createContext<User>(userInitialState);
export const UserDispatchContext = React.createContext<React.Dispatch<UserAction>>(() => {});

function UserContextWrapper({children}: Props) {

	const [userState, userDispatch] = useUserReducer();

	React.useEffect(() => {
		if(userState === null) {
			const api = new Api;
			api.users.getMyUser({
				credentials: "include",
				headers: {
					"X-Requested-With": "XMLHttpRequest",
				},
			}).then((response) => {
				console.log(response);
				userDispatch({
					type: "loginSuccess",
					payload: response.data,
				});
			}).catch((error) => {
				switch(error.status) {
				case 401:
					userDispatch({
						type: "failedToLogin",
					});
				}
			});
		}
	}, [userState]);

	if(userState === null) {
		return (
			<div>Loading...</div>
		);
	}

	return (
		<UserStateContext.Provider value={userState}>
			<UserDispatchContext.Provider value={userDispatch}>
				{children}
			</UserDispatchContext.Provider>
		</UserStateContext.Provider>
	);
}
