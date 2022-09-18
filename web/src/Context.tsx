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

export const UserContext = React.createContext<User>(userInitialState);
export const UserDispatchContext = React.createContext<React.Dispatch<UserAction>>(() => {});

function UserContextWrapper({children}: Props) {

	const [user, userDispatch] = useUserReducer();

	React.useEffect(() => {
		if(user === null) {
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
	}, [user]);

	if(user === null) {
		return (
			<div>Loading...</div>
		);
	}

	return (
		<UserContext.Provider value={user}>
			<UserDispatchContext.Provider value={userDispatch}>
				{children}
			</UserDispatchContext.Provider>
		</UserContext.Provider>
	);
}
