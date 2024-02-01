import * as dotenv from 'dotenv'
import type {Config} from 'jest'

dotenv.config({path: './.env.local'})
dotenv.config({path: './.env.development'})

const config: Config = {
  testTimeout: 60000,
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFilesAfterEnv: ['jest-extended/all'],
}

export default config
