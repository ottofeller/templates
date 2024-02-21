import type {HuskyRule} from './husky'

export interface WithGitHooks {
  /**
   * Include husky for git hook management.
   *
   * @default false
   */
  readonly hasGitHooks?: boolean

  /**
   * Defines which rules to include.
   *
   * @default { commitMsg: true }
   */
  readonly huskyRules?: HuskyRule
}
