import { JestConfigWithTsJest } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

const config: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                // ts-jest configuration goes here
            },
        ],
    },
}

export default config
