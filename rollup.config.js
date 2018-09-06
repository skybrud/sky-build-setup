const vue = require('rollup-plugin-vue').default;
const path = require('path');

function init(packageJson, buildRoot) {
	const pascaledName = (() => {
		const pascalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
		const nameArray = packageJson.name.split('-');

		return nameArray.reduce((acc, cur) => { return acc += pascalize(cur)}, '');
	})();

	const config = [
		// ESM build to be used with webpack/rollup.
		{
			input: path.resolve(buildRoot + '/src/index.js'),
			output: {
				format: 'esm',
				file: path.resolve(buildRoot + '/dist/' + packageJson.name + '.esm.js')
			},
			plugins: [
				vue()
			]
		},
		// SSR build.
		{
			input: path.resolve(buildRoot + '/src/index.js'),
			output: {
				format: 'cjs',
				file: path.resolve(buildRoot + '/dist/' + packageJson.name + '.ssr.js')
			},
			plugins: [
				vue({ template: { optimizeSSR: true } })
			]
		},
		// Browser build.
		{
			input: path.resolve(buildRoot + '/src/index.js'),
			output: {
				name: pascaledName,
				format: 'iife',
				file: path.resolve(buildRoot + '/dist/' + packageJson.name + '.js')
			},
			plugins: [
				vue()
			]
		}
	];

	return config;
};

module.exports = init;
