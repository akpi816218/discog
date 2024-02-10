import { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: ['src/index.ts', 'src/{commands,events}/*.ts', 'scripts/*.ts'],
	project: ['src/**/*.ts']
};

export default config;
