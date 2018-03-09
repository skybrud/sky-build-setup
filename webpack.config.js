const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');

console.log('tææææt');

function init(projectName, requestedBuild, buildRoot) {
	const name = (() => {
		const capitalise = (string) => string.charAt(0).toUpperCase() + string.slice(1);
		const nameArray = projectName.split('-');

		return `${capitalise(nameArray[0])}${capitalise(nameArray[1])}`;
	})();

	const baseConfig = {
		output: {
			path: path.resolve(buildRoot + '/dist/'),
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					include: buildRoot,
					exclude: /node_modules/,
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						preserveWhitespace: false,
						postcss: [
							require('autoprefixer')(),
						],
						loaders: {
							css: 'vue-style-loader!css-loader!sass-loader',
						},
					},
				},
			],
		},
		plugins: [
			new UglifyJsPlugin({
				sourceMap: false,
				uglifyOptions: {
					mangle: true,
					compress: {
						warnings: false,
					},
				},
			}),
		],
	};

	const builds = {
		module: {
			target: 'node',
			entry: path.resolve(buildRoot + '/src/' + name + '.vue'),
			output: {
				filename: name.toLowerCase() + '.js',
				libraryTarget: 'umd',
				library: name,
				umdNamedDefine: true,
			},
		},
		plugin: {
			entry: path.resolve(buildRoot + '/src/plugin.js'),
			output: {
				filename: name.toLowerCase() + '.min.js',
				libraryTarget: 'window',
				library: name,
			}
		},
		service: {
			entry: path.resolve(buildRoot + '/src/' + name + '.js'),
			output: {
				filename: name.toLocaleLowerCase() + '.js',
				libraryTarget: 'umd',
				library: name,
				umdNamedDefine: true,
			},
		}
	};

	return merge(baseConfig, builds[requestedBuild]);
}

module.exports = init;