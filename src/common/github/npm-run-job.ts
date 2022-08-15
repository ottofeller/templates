export const npmRunJob = (command: string) => ({
  uses: 'ottofeller/github-actions/npm-run@main',
  with: {'node-version': 16, command: `npm run ${command}`},
})
