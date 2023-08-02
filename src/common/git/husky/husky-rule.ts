import type {CheckCargoOptions} from './check-cargo-options'

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
