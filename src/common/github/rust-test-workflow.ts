import {GitHub, GitHubProject, GithubWorkflow, GithubWorkflowOptions} from 'projen/lib/github'
import type {JobStep} from 'projen/lib/github/workflows-model'
import {job} from './jobs/job'

export interface WithRustTestWorkflow {
  /**
   * Include a default GitHub workflow for rust projects.
   *
   * @default false
   */
  readonly hasRustTestWorkflow?: boolean
}

/**
 * Options for RustTestWorkflow
 */
export interface RustTestWorkflowOptions extends GithubWorkflowOptions {
  /**
   * Github Runner selection labels
   * @default ['ubuntu-latest']
   */
  readonly runsOn?: string[]

  /**
   * The workflow name
   * @default 'test'
   */
  readonly name?: string

  /**
   * A list of paths on pushes to which the workflow will run.
   * @default ['.']
   */
  readonly triggerOnPaths?: Array<string>

  /**
   * A list of branches on pushes to which the workflow will run.
   * @default ['main']
   */
  readonly triggerOnBranches?: Array<string>
}

/**
 * Configure a testing workflow with basic checks on a rust project.
 */
export class RustTestWorkflow extends GithubWorkflow {
  constructor(githubInstance: GitHub, options: RustTestWorkflowOptions = {}) {
    const workflowName = options.name ?? 'rust-test'
    super(githubInstance, workflowName, options)

    const paths = options.triggerOnPaths
    const branches = options.triggerOnBranches ?? ['main']

    this.on({
      pullRequest: {paths, types: ['opened', 'synchronize']},
      push: {paths, branches},
    })

    const checkoutStep: JobStep = {uses: 'actions/checkout@v3'}
    const {runsOn} = options

    this.addJobs({
      clippy: job(
        [checkoutStep, {name: 'Run Clippy', run: 'cargo clippy --all-targets --all-features -- -D warnings'}],
        runsOn,
      ),
      check: job([checkoutStep, {name: 'Run compilation check', run: 'cargo check'}], runsOn),
      format: job([checkoutStep, {name: 'Run format', run: 'cargo fmt --check'}], runsOn),
      test: job([checkoutStep, {name: 'Run tests', run: 'cargo test'}], runsOn),
    })
  }

  /**
   * Optionally creates a workflow within the given project
   * or within the project parent (for subprojects).
   *
   * NOTE: Use this method if the described conditional logic is needed.
   * Otherwise just use the constructor.
   */
  static addToProject(project: GitHubProject, options: WithRustTestWorkflow) {
    const hasRustTestWorkflow = options.hasRustTestWorkflow ?? false

    if (!hasRustTestWorkflow) {
      return
    }

    const githubInstance =
      project.parent && project.parent instanceof GitHubProject && project.parent.github
        ? project.parent.github
        : project.github

    if (!githubInstance) {
      return
    }

    new RustTestWorkflow(githubInstance, {})
  }
}
