import React from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";

import { Api } from "@/api/api";
import { GenericTemplate } from "@/components/templates/GenericTemplate";
import { UserDispatchContext } from "@/Context";

type Credential = {
	email: string;
	password: string;
}

export function Login() {
	const userDispatch = React.useContext(UserDispatchContext);
	const [credential, setCredential] = React.useState<Credential>({email: "", password: ""});
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
	const navigate = useNavigate();

	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setCredential((credential) => ({
			...credential,
			[e.target.name]: e.target.value,
		}));
	}, []);

	const handleOnSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if(credential.email === "" || credential.password === "") {
			setErrorMessage("メールアドレスとパスワードを正しく入力してください。");
			return;
		}

		const api = new Api;
		api.login.login({
			email: credential.email,
			password: credential.password,
		}, {
			credentials: "include",
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
		}).then((response) => {
			userDispatch({
				type: "loginSuccess",
				payload: response.data,
			});
			navigate("/", {replace: true});
		}).catch((_error) => {
			userDispatch({
				type: "failedToLogin",
			});
		});

	}, [credential]);

	return (
		<GenericTemplate>
			<div css={style.root}>
				<div css={style.container}>
					<div css={style.logo}>
						ログイン
					</div>
					<form onSubmit={handleOnSubmit}>
						<label>
							<p>email-address</p>
							<input type="email" name="email" id="loginEmail" value={credential.email} onChange={handleChange}/>
						</label>
						<label>
							<p>password</p>
							<input type="password" name="password" id="loginPassword" value={credential.password} onChange={handleChange}/>
						</label>
						<div css={style.formItem}>
							<p css={style.errorMessage}>
								{errorMessage}
							</p>
						</div>
						<div css={style.formItem}>
							<div css={style.flexCenter}>
								<button type="submit" color="primary">ログイン！</button>
							</div>
							<div css={style.clearFix}></div>
						</div>
					</form>
				</div>
			</div>
		</GenericTemplate>
	);
}

const style = {
	root: css`
		width: 360px;
		margin: auto;
		margin-top: 100px;
	`,
	container: css`
		padding: 20px;
		background-color: #E8E8E8;
	`,
	logo: css`
		margin: 20px 20px 30px 20px;
		font-size: 24px;
		text-align: center;
	`,
	formItem: css``,
	errorMessage: css``,
	flexCenter: css``,
	link: css``,
	clearFix: css``,
};
