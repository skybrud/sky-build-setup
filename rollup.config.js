const vue = require('rollup-plugin-vue').default;
const buble = require('rollup-plugin-buble');
const scss = require('rollup-plugin-scss');
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
			external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)],
			input: path.resolve(buildRoot + '/src/index.js'),
			output: {
				format: 'esm',
				file: path.resolve(buildRoot + '/dist/' + packageJson.name + '.esm.js'),
				exports: 'named',
			},
			plugins: [
				scss({ output: path.resolve(buildRoot + '/dist/' + packageJson.name + '.css')}),
				vue({ css: false }),
				buble({ transforms: { dangerousForOf: true } }),
			]
		},
		// SSR build.
		{
			external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)],
			input: path.resolve(buildRoot + '/src/index.js'),
			output: {
				format: 'cjs',
				file: path.resolve(buildRoot + '/dist/' + packageJson.name + '.ssr.js'),
				exports: 'named',
			},
			plugins: [
				vue({
					css: false,
					template: { optimizeSSR: true },
				}),
				scss({ output: path.resolve(buildRoot + '/dist/' + packageJson.name + '.css')}),
				buble({ transforms: { dangerousForOf: true } }),
			]
		},
	];

	return config;
};

module.exports = init;
