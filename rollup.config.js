// rollup.config.js
import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify-es';
import minimist from 'minimist';
import path from 'path';

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


export default function init(projectName, requestedBuild, buildRoot) {
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