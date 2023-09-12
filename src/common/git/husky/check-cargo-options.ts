import type {WithIgnoreBranches} from './with-ignore-branches'

export interface CheckCargoOptions extends WithIgnoreBranches {
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
