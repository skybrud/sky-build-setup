const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');

const babelLoaderSetup = {
	loader: 'babel-loader',
	options: {
		babelrc: false,
		presets: ['babel-preset-env'],
		plugins: ['babel-plugin-transform-runtime'],
		comments: false,
	}
}

function init(projectName, requestedBuild, buildRoot) {
	const name = (() => {
		const capitalise = (string) => string.charAt(0).toUpperCase() + string.slice(1);
		const nameArray = projectName.split('-');

		return nameArray.reduce((acc, cur) => { return acc += capitalise(cur)}, '');
	})();

	const baseConfig = {
		output: {
			path: path.resolve(buildRoot + '/dist/'),
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: buildRoot,
					exclude: /node_modules/,
					use: babelLoaderSetup
				},
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						postcss: [
							require('autoprefixer')(),
						],
						loaders: {
							css: 'vue-style-loader!css-loader!sass-loader',
							js: babelLoaderSetup,
						},
					},
				},
			],
		},
		plugins: [
			new UglifyJsPlugin({
				include: /\.min\.js$/,
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
		plugin: {
			target: 'node',
			entry: {
				[name.toLowerCase()]: path.resolve(buildRoot + '/src/index.js'),
				[name.toLowerCase() + '.min']: path.resolve(buildRoot + '/src/index.js'),
			},
			output: {
				filename: '[name].js',
				library: {
					root: name,
					amd: projectName,
					commonjs: projectName,
				},
				libraryTarget: 'umd',
				umdNamedDefine: true,
			},
		},
		service: {
			entry: path.resolve(buildRoot + '/src/' + name + '.js'),
			output: {
				filename: name.toLocaleLowerCase() + '.js',
				libraryTarget: 'umd',
				library: {
					root: name,
					amd: projectName,
					commonjs: projectName,
				},
				umdNamedDefine: true,
			},
		}
	};

	return merge(baseConfig, builds[requestedBuild]);
}

module.exports = init;