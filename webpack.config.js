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

		return `${capitalise(nameArray[0])}${capitalise(nameArray[1])}`;
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