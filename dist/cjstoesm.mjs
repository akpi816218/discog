import { transform } from 'cjstoesm';
import 'process';
await transform({
	input: process.argv[2],
	outDir: 'dist',
});
