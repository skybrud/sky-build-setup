const vue = require('rollup-plugin-vue');
const buble = require('rollup-plugin-buble');
const path = require('path');

function init(packageJson, buildRoot) {
	const pascaledName = (() => {
		const pascalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
		const nameArray = packageJson.name.split('-');

		return nameArray.reduce((acc, cur) => { return acc += pascalize(cur)}, '');
	})();

	const config = {
		external: Object.keys(packageJson.dependencies),
		input: path.resolve(buildRoot + '/src/index.js'),
		output: {
			name: pascaledName,
			dir: path.resolve(buildRoot + '/dist/'),
			exports: 'named',
		},
		plugins: [
			vue({
				css: true,
				compileTemplate: true,
			}),
			buble(),
		],
	};

	return config;
};

module.exports = init;