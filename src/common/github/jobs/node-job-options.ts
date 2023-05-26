// import type {PullRequestFromPatchOptions} from 'projen/lib/github'
// import type {NodeProject} from 'projen/lib/javascript'
import type {SetupNodeOptions} from './setup-node'

export interface NodeJobOptions extends SetupNodeOptions {
  /**
   * The command to use to run the script (e.g. `yarn run` or `npm run` depending on the package manager).
   */
  readonly runScriptCommand: string

  /**
   * @param runsOn An array of one or more types of machine to run the job on.
   */
  readonly runsOn?: string[]
}
