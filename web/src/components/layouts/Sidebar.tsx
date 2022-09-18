import React from "react";
import { css } from "@emotion/react";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { Link } from "react-router-dom";

export function Sidebar() {
	const [isMenuOpen, _setIsMenuOpen] = React.useState(true);
	const menuStyle = isMenuOpen ? style.menuOpen : style.menuClose;

	return (
		<div id="sidebar" css={menuStyle}>
			<div css={style.header}>
				ToDo アプリ
			</div>
			<ul css={style.ul}>
				<SidebarItem />
				<SidebarItem />
				<SidebarItem />
				<SidebarItem />
			</ul>
		</div>
	);
}

function SidebarItem() {
	return (
		<li css={style.li}>
			<Link to="/" css={style.link}>
				<DashboardIcon css={style.icon}/>
				test
			</Link>
		</li>
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
		padding-left: 30px;
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

		&:hover {
			padding-left: 20px;
			transition: 0.3s;
		}
	`,
};
