const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: "./src/Index.tsx",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "./app.js",
	},

	devtool: "source-map",

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "/src"),
		},
		extensions: [".ts", ".tsx", ".js"],
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{loader: "ts-loader"},
				],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		open: false,
		port: 8080,
		client: {
			logging: "info",
			webSocketURL: {
				hostname: "0.0.0.0",
				pathname: "/ws",
				port: 443,
				protocol: "ws",
			},
		},
		compress: false,
		historyApiFallback: true,
		allowedHosts: "all",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/public/index.html",
		}),
	],
};
