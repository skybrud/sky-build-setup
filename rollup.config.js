// rollup.config.js
const vue  require('rollup-plugin-vue');
const buble require('rollup-plugin-buble');
const uglify require('rollup-plugin-uglify-es');
const minimist require('minimist');
const path require('path');

const argv = minimist(process.argv.slice(2));

const config = {
    input: 'src/index.js',
    output: {
        name: '{{componentNamePascal}}',
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

// Only minify browser (iife) version
if (argv.format === 'iife') {
    config.plugins.push(uglify());
}

// export default config;

function init(projectName, requestedBuild, buildRoot) {
	const name = (() => {
		const capitalise = (string) => string.charAt(0).toUpperCase() + string.slice(1);
		const nameArray = projectName.split('-');

		return nameArray.reduce((acc, cur) => { return acc += capitalise(cur)}, '');
	})();

	const argv = minimist(process.argv.slice(2));

	const config = {
		input: path.resolve(buildRoot + 'src/index.js'),
		output: {
			name,
			dir: path.resolve(buildRoot + 'dist/'),
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

	// Only minify browser (iife) version
	if (argv.format === 'iife') {
		config.plugins.push(uglify());
	}

	return config;
};

module.exports = init;