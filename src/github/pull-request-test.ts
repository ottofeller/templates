import {Component, github as gh} from 'projen'

/**
 * Options for PullRequestLint
 */
export interface PullRequestTestOptions {
  /**
   * Github Runner selection labels
   * @default ['ubuntu-latest']
   */
  readonly runsOn?: string[]
}

/**
 * Configure validations to run on GitHub pull requests.
 * Only generates a file if at least one linter is configured.
 */
export class PullRequestTest extends Component {
  constructor(github: gh.GitHub, options: PullRequestTestOptions = {}) {
    super(github.project)

    const job = (steps: Array<gh.workflows.JobStep>): gh.workflows.Job => ({
      runsOn: options.runsOn ?? ['ubuntu-latest'],
      permissions: {
        pullRequests: gh.workflows.JobPermission.READ,
      },
      steps: [
        {
          uses: 'actions/checkout@v2',
          with: {
            fetchDepth: 0,
          },
        },
        ...steps,
      ],
    })

    const workflow = github.addWorkflow('test')
    workflow.on({
      pullRequestTarget: {
        types: ['opened', 'synchronize', 'reopened'],
      },
      push: {
        branches: ['*'],
      },
    })
    workflow.addJobs({
      lint: job([
        {
          uses: 'ottofeller/github-actions/npm-run@main',
          with: {
            nodeVersion: 16,
            command: 'npm run lint',
          },
        },
      ]),
      typecheck: job([
        {
          uses: 'ottofeller/github-actions/npm-run@main',
          with: {
            nodeVersion: 16,
            command: 'npm run typecheck',
          },
        },
      ]),
      test: job([
        {
          uses: 'ottofeller/github-actions/npm-run@main',
          with: {
            nodeVersion: 16,
            command: 'npm run test',
          },
        },
      ]),
    })
  }
}
