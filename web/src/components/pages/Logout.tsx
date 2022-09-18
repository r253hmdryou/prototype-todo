import React from "react";
import { Navigate } from "react-router-dom";

import { UserDispatchContext } from "@/Context";

export function Logout() {
	const userDispatch = React.useContext(UserDispatchContext);

	React.useEffect(() => {
		userDispatch({
			type: "logout",
		});
	}, [userDispatch]);

	return (
		<Navigate to="/" replace/>
	);
}
