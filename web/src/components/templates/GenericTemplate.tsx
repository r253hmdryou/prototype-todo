import { Header } from "@/components/layouts/Header";
import { css } from "@emotion/react";
import { Sidebar } from "../layouts/Sidebar";

type Props = {
  children: React.ReactNode;
}

export function GenericTemplate(props: Props) {
	return (
		<div css={style.root}>
			<Header />
			<div css={style.wrapper}>
				<Sidebar />
				<main css={style.main}>
					{props.children}
				</main>
			</div>
		</div>
	);
}

const style = {
	root: css`
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	`,
	wrapper: css`
		display: flex;
		height: auto;
		height: 100%;
	`,
	main: css`
		width: 100%;
	`,
};
