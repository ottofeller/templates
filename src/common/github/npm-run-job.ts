/**
 * Create GitHub workflow which runs npm script using ottofeller/github-actions/npm-run@main action.
 */
export const npmRunJob = (
  /**
   * npm script command. E.g. command === "build" will result in "npm run build"
   */
  command: string,
) => ({
  uses: 'ottofeller/github-actions/npm-run@main',
  with: {'node-version': 16, command: `npm run ${command}`},
})
