import {job} from './job'
import {github} from 'projen'

/**
 * Options for PullRequestLint
 */
export interface ReleaseWorkflowOptions {
  /**
   * The initial version to bump
   * @default 0.0.1
   */
  readonly initlaReleaseVersion: string
}

/**
 * A GitHub workflow taht bumps the version of root package and create draft release.
 */
export class ReleaseWorkflow extends github.GithubWorkflow {
  constructor(githubInstance: github.GitHub, options: ReleaseWorkflowOptions = {initlaReleaseVersion: '0.0.1'}) {
    super(githubInstance, 'release')

    this.on({
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

    this.addJobs({
      create: job([
        {
          uses: 'ottofeller/github-actions/create-release@main',

          with: {
            'initial-version': options.initlaReleaseVersion,
            'bump-level': '${{ github.event.inputs.bump-level }}',
            'release-branches': 'master',
            'update-root-package_json': true,
            'github-token': '${{ secrets.GITHUB_TOKEN }}',
          },
        },
      ]),
    })
  }
}
