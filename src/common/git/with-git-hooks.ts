export interface WithGitHooks {
  /**
   * Include husky for git hook management.
   *
   * @default false
   */
  readonly hasGitHooks?: boolean

  /**
   * Include a default git hook that checks commit message.
   *
   * @default true
   */
  readonly hasDefaultCommitHook?: boolean
}
