import {GitHub, GitHubProject, GithubWorkflow, GithubWorkflowOptions} from 'projen/lib/github'
import type {Job} from 'projen/lib/github/workflows-model'
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
  readonly runsOn?: Array<string>

  /**
   * The workflow name
   * @default 'test'
   */
  readonly name?: string

  /**
   * The root directory of the rust project.
   *
   * This directory is expected to contain the manifest file.
   *
   * @default "."
   */
  readonly rootdir?: string

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
 * Input parameters to the cargo action.
 * @see https://github.com/actions-rs/cargo#inputs
 */
interface CargoActionParams {
  /**
   * Cargo command to run, ex. check or build
   */
  command: string

  /**
   * Rust toolchain name to use
   */
  toolchain?: string

  /**
   * Arguments for the cargo command
   */
  args?: string

  /**
   * Environment variables for the cargo command
   */
  env?: Record<string, string>
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
    const {rootdir} = options
    const manifestPath = rootdir ? `--manifest-path=${rootdir}/Cargo.toml` : undefined

    this.on({
      pullRequest: {paths, types: ['opened', 'synchronize']},
      push: {paths, branches},
    })

    const cargoJob = ({command, args, env, toolchain = 'nightly'}: CargoActionParams): Job =>
      job(
        [
          {uses: 'actions/checkout@v3'},
          {
            name: 'Install latest nightly',
            id: 'toolchain',
            uses: 'actions-rs/toolchain@v1',
            with: {toolchain, components: 'rustfmt, clippy'},
          },
          {
            uses: 'actions/cache@v3',
            with: {
              path: [
                '~/.cargo/bin/',
                '~/.cargo/registry/index/',
                '~/.cargo/registry/cache/',
                '~/.cargo/git/db/',
                'target/',
              ].join('\n'),
              key: [
                'cargo',
                '${{ runner.os }}',
                '${{ steps.toolchain.outputs.rustc_hash }}',
                "${{ hashFiles('**/Cargo.lock') }}",
                command,
              ].join('-'),
            },
          },
          {
            name: `Run ${command}`,
            uses: 'actions-rs/cargo@v1',
            with: {
              command,
              args: [manifestPath, args].filter(Boolean).join(' ') || undefined,
              toolchain,
            },
            env,
          },
        ],
        options.runsOn,
      )

    this.addJobs({
      clippy: cargoJob({command: 'clippy', args: '--all-targets --all-features -- -D warnings'}),
      check: cargoJob({command: 'check', env: {RUSTFLAGS: '-D unused_crate_dependencies'}}),
      format: cargoJob({command: 'fmt', args: '--check'}),
      test: cargoJob({command: 'test'}),
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

    return new RustTestWorkflow(githubInstance, {})
  }
}
