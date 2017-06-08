const path = require('path');

module.exports = {
	entry: "./script/app.ts",
	output: {
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: "ts-loader" },
			{ test: /\.css$/, loaders: ["style", "css"] },
			{ test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
		]
	}
}