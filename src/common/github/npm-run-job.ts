import {JobStep} from 'projen/lib/github/workflows-model'

/**
 * Create GitHub workflow which runs npm script using ottofeller/github-actions/npm-run@main action.
 * @param command npm script command. E.g. command === "build" will result in "npm run build"
 */
export const npmRunJob = (command: string): JobStep => ({
  uses: 'ottofeller/github-actions/npm-run@main',
  with: {'node-version': 16, command: `npm run ${command}`},
})
