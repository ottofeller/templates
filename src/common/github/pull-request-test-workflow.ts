import {Component, github} from 'projen'

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
 * Configure a testing workflow with basic checks to run on GitHub pull requests.
 */
export class PullRequestTest extends Component {
  constructor(githubInstance: github.GitHub, options: PullRequestTestOptions = {}) {
    super(githubInstance.project)

    const job = (command: string): github.workflows.Job => ({
      runsOn: options.runsOn ?? ['ubuntu-latest'],
      permissions: {pullRequests: github.workflows.JobPermission.READ},

      steps: [
        {uses: 'actions/checkout@v2', with: {fetchDepth: 0}},
        {uses: 'ottofeller/github-actions/npm-run@main', with: {nodeVersion: 16, command}},
      ],
    })

    const workflow = githubInstance.addWorkflow('test')
    workflow.on({
      pullRequestTarget: {types: ['opened', 'synchronize', 'reopened']},
      push: {branches: ['*']},
    })
    workflow.addJobs({
      lint: job('npm run lint'),
      typecheck: job('npm run typecheck'),
      test: job('npm run test'),
    })
  }
}