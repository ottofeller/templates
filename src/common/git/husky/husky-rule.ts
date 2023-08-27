import type {CheckCargoOptions} from './check-cargo-options'
import type {CustomRuleOptions} from './custom-rule-options'

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

  /**
   * A custom rule that specifies a git hook
   * and a command to run when the hook triggers.
   *
   * @default undefined
   */
  readonly huskyCustomRules?: Array<CustomRuleOptions>
}
