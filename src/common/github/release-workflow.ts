import {job} from './job'
import {github} from 'projen'

/**
 * Bump the version of root package and create draft release.
 */
export const releaseWorkflow = (params: {
  /**
   * An instance of Github component of a project.
   */
  githubInstance: github.GitHub

  /**
   * The initial version to bump, e.g. "0.0.1".
   */
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