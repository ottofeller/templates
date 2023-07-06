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
   * @default { commitMsg: true }
   */
  readonly huskyRules?: HuskyRule
}

export interface HuskyRule {
  /**
   * Include pre-commit hook with `cargo check` command.
   *
   * @default undefined
   */
  readonly checkCargo?: CheckCargoOptions

  /**
   * Include commit message hook.
   *
   * @default true
   */
  readonly commitMsg?: boolean
}

export interface CheckCargoOptions {
  /**
   * Perform a code formatting step
   *
   * @default true
   */
  readonly isFormatting?: boolean

  /**
   * Path to the cargo
   *
   * @default '.'
   */
  readonly workingDirectory?: string
}
