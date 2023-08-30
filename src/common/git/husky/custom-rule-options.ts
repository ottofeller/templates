export type GitHook = 'commit-msg' | 'pre-commit'

export interface CustomRuleOptions {
  /**
   * A custom command to run in specified hook.
   */
  readonly command: string

  /**
   * Git hook to run the command in.
   */
  readonly trigger: GitHook
}
