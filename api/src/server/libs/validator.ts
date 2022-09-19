export const project = {
	name: {
		maxLength: 20,
	},
	description: {
		maxLength: 1000,
	},
	accessLevel: {
		only: ["public", "private"],
	},
};
