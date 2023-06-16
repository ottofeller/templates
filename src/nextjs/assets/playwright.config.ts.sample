import {defineConfig} from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve(__dirname, '.env.local')})

export default defineConfig({
  testDir: './src/tests/specs',
  timeout: 60000,
  expect: {
    timeout: 30000,
  },
  use: {
    baseURL: process.env.BASE_URL,
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: [
    ['list'],
    ['html', {open: 'never'}],
    [
      'playwright-qase-reporter',
      {
        basePath: 'https://api.qase.io/v1',
        uploadAttachments: true,
        projectCode: process.env.QASE_PROJECT_CODE,
        runComplete: true,
        logging: true,
      },
    ],
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
})
