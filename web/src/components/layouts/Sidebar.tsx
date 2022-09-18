import React from "react";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import { UserContext } from "@/Context";

const guestLinks = [
	{
		to: "/",
		label: "ホーム",
		icon: DashboardIcon,
	},
	{
		to: "/login",
		label: "ログイン",
		icon: LoginIcon,
	},
];

const userLinks = [
	{
		to: "/",
		label: "ホーム",
		icon: DashboardIcon,
	},
	{
		to: "/logout",
		label: "ログアウト",
		icon: LogoutIcon,
	},
];

export function Sidebar() {
	const user = React.useContext(UserContext);
	const [isMenuOpen, _setIsMenuOpen] = React.useState(true);
	const menuStyle = isMenuOpen ? style.menuOpen : style.menuClose;
	const links = user === false ? guestLinks : userLinks;

	return (
		<div id="sidebar" css={menuStyle}>
			<div css={style.header}>
				ToDo アプリ
			</div>
			<ul css={style.ul}>
				{links.map((link) => (
					<li css={style.li} key={link.to}>
						<Link to={link.to} css={style.link}>
							<link.icon css={style.icon}/>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

const style = {
	menuOpen: css`
		height: 100%;
		width: 250px;
		background-color: #EEEEEE;
	`,
	menuClose: css`
		display: none;
	`,
	header: css`
		line-height: 75px;
		text-align: center;
		background-color: #DDDDDD;
		user-select: none;
	`,
	ul: css`
		margin: 0;
		padding: 0;
		list-style: none;
	`,
	li: css`
		line-height: 50px;
		padding-right: 20px;
		padding-left: 20px;
		border-bottom: 1px solid;
	`,
	icon: css`
		padding-right: 4px;
		line-height: 100%;
	`,
	link: css`
		display: inline-flex;
		align-items: center;
		height: 100%;
		width: 100%;
		text-decoration: none;
		color: #000000;

		&:hover {
			padding-left: 20px;
			transition: 0.3s;
		}
	`,
};
