import {github} from 'projen'
import {job} from './job'

/**
 * Options for ReleaseWorkflow
 */
export interface ReleaseWorkflowOptions {
  /**
   * The initial version to bump
   * @default 0.0.1
   */
  readonly initlaReleaseVersion?: string

  /**
   * The branch to release from
   * @default 'master'
   */
  readonly releaseBranch?: string
}

/**
 * A GitHub workflow that bumps the version of root package and create draft release.
 */
export class ReleaseWorkflow extends github.GithubWorkflow {
  constructor(githubInstance: github.GitHub, options: ReleaseWorkflowOptions = {}) {
    super(githubInstance, 'release')

    const {initlaReleaseVersion = '0.0.1', releaseBranch = 'master'} = options

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
            'initial-version': initlaReleaseVersion,
            'bump-level': '${{ github.event.inputs.bump-level }}',
            'release-branches': releaseBranch,
            'update-root-package_json': true,
            'github-token': '${{ secrets.GITHUB_TOKEN }}',
          },
        },
      ]),
    })
  }
}
