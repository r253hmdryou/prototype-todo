import React from "react";
import { BrowserRouter, Outlet, Routes, Route, Navigate } from "react-router-dom";

import { Home } from "@/components/pages/Home";
import { Login } from "./components/pages/Login";
import { Logout } from "./components/pages/Logout";

import { UserContext } from "@/Context";

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />}/>

				<Route element={<PrivateRoute />}>
					<Route path="/logout" element={<Logout />}/>
				</Route>

				<Route element={<GuestRoute />}>
					<Route path="/login" element={<Login />}/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

function PrivateRoute() {
	const user = React.useContext(UserContext);

	if(user === false) {
		return (
			<Navigate to="/" replace />
		);
	}
	return (
		<Outlet />
	);
}

function GuestRoute() {
	const user = React.useContext(UserContext);

	if(user) {
		return (
			<Navigate to="/" replace />
		);
	}
	return (
		<Outlet />
	);
}
