import { ESLint } from 'eslint';
import { writeFile } from 'fs/promises';

const eslint = new ESLint({
	overrideConfigFile: './.eslintrc'
});

const results = await eslint.lintFiles('./src/**/*.ts');

if (results.join() == '') {
	await writeFile(
		'./lint-results.txt',
		await (await eslint.loadFormatter('stylish')).format(results)
	);
	// eslint-disable-next-line no-console
	console.log('Linting errors were found; check the lint-results.txt file.');
}
// eslint-disable-next-line no-console
else console.log('No linting errors were found.');
