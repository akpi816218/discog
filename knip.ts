import { KnipConfig } from 'knip';

export default {
	entry: ['scripts/*.ts', 'src/index.ts', 'src/{commands,events}/**/*.ts'],
	project: ['src/**/*.ts'],
	ignoreDependencies: ['husky']
} satisfies KnipConfig;
