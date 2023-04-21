import { ESLint } from 'eslint';
import { writeFile } from 'fs/promises';

const eslint = new ESLint({
	overrideConfigFile: './.eslintrc'
});

const results = await eslint.lintFiles('./src/**/*.ts');

if (results.length > 0) {
	await writeFile(
		'./lint-results.txt',
		await (await eslint.loadFormatter('stylish')).format(results)
	);
} else {
	// eslint-disable-next-line no-console
	console.log('No linting errors');
}
