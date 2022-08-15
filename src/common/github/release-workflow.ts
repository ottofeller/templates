import {job} from './job'
import {github} from 'projen'

export const releaseWorkflow = (params: {
  githubInstance: github.GitHub
  initlaReleaseVersion: string
}): github.GithubWorkflow => {
  const workflow = params.githubInstance.addWorkflow('release')

  workflow.on({
    workflowDispatch: {
      inputs: {
        bumpLevel: {
          description: 'Version level to bump',
          default: 'patch',
          required: false,
          type: 'choice',
          options: ['none', 'patch', 'minor', 'major'],
        },
      },
    },
  })
  
  workflow.addJobs({
    create: job([
      {
        uses: 'ottofeller/github-actions/create-release@main',
  
        with: {
          'initial-version': params.initlaReleaseVersion,
          'bump-level': '${{ github.event.inputs.bump-level }}',
          'release-branches': 'master',
          'update-root-package_json': true,
          'github-token': '${{ secrets.GITHUB_TOKEN }}',
        },
      },
    ]),
  })

  return workflow
}