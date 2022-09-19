import { STATUS } from "./AppError";
import { config } from "libs/config";
import { project } from "libs/validator";

export interface ErrorMessage {
	status: STATUS,
	code: string;
	message: string;
}

export const errorMessages = {
	api: {
		headerRequired: {
			status: STATUS.BAD_REQUEST,
			code: "apiHeaderRequired",
			message: "required header is missing, please set X-Requested-With",
		},
	},
	general: {
		badRequest: {
			status: STATUS.BAD_REQUEST,
			code: "badRequest",
			message: "Bad Request",
		},
		unauthorized: {
			status: STATUS.UNAUTHORIZED,
			code: "unauthorized",
			message: "Unauthorized",
		},
		forbidden: {
			status: STATUS.FORBIDDEN,
			code: "forbidden",
			message: "Forbidden",
		},
		notFound: {
			status: STATUS.NOT_FOUND,
			code: "apiNotFound",
			message: "API Not Found. Please check the URL.",
		},
		conflict: {
			status: STATUS.CONFLICT,
			code: "conflict",
			message: "Conflict",
		},
		internalServerError: {
			status: STATUS.INTERNAL_SERVER_ERROR,
			code: "internalServerError",
			message: "Internal Server Error",
		},
	},
	project: {
		create: {
			code: "projectCreate",
			message: "Failed to create project",
		},
		param: {
			name: {
				default: {
					status: STATUS.BAD_REQUEST,
					code: "invalidProjectParamName",
					message: "Invalid name",
				},
				empty: {
					status: STATUS.BAD_REQUEST,
					code: "invalidProjectParamNameEmpty",
					message: "Invalid name, name is empty",
				},
				maxLength: {
					status: STATUS.BAD_REQUEST,
					code: "invalidProjectParamNameMaxLength",
					message: `Invalid name, maximum length is ${project.name.maxLength}`,
				},
			},
			description: {
				default: {
					status: STATUS.BAD_REQUEST,
					code: "invalidProjectParamDescription",
					message: "Invalid description",
				},
				maxLength: {
					status: STATUS.BAD_REQUEST,
					code: "invalidProjectParamDescriptionMaxLength",
					message: `Invalid description, maximum length is ${project.description.maxLength}`,
				},
			},
			accessLevel: {
				default: {
					status: STATUS.BAD_REQUEST,
					code: "invalidProjectParamAccessLevel",
					message: "Invalid accessLevel. accessLevel must be one of 'public', 'private'",
				},
			},
		},
	},
	user: {
		create: {
			code: "userCreate",
			message: "Failed to create user",
		},
		signup: {
			code: "userSignup",
			message: "Failed to signup user",
		},
		alreadySignedUp: {
			status: STATUS.FORBIDDEN,
			code: "userAlreadySignedUp",
			message: "User already signed up",
		},
		login: {
			status: STATUS.UNAUTHORIZED,
			code: "userLogin",
			message: "Failed to login user",
		},
		param: {
			id: {
				notFound: (id: string): ErrorMessage => ({
					status: STATUS.NOT_FOUND,
					code: "userIdNotFound",
					message: `User not found. id: ${id}`,
				}),
			},
			email: {
				default: {
					status: STATUS.BAD_REQUEST,
					code: "invalidUserParamEmail",
					message: "Invalid email",
				},
				pattern: {
					status: STATUS.BAD_REQUEST,
					code: "invalidUserParamEmailPattern",
					message: "Invalid email pattern",
				},
			},
			password: {
				default: {
					status: STATUS.BAD_REQUEST,
					code: "invalidUserParamPassword",
					message: "Invalid password",
				},
				minLength: {
					status: STATUS.BAD_REQUEST,
					code: "invalidUserParamPasswordMinLength",
					message: `Invalid password. Minimum length is ${config.user.password.minLength}`,
				},
				maxLength: {
					status: STATUS.BAD_REQUEST,
					code: "invalidUserParamPasswordMaxLength",
					message: `Invalid password. Maximum length is ${config.user.password.maxLength}`,
				},
			},
		},
	},
};
