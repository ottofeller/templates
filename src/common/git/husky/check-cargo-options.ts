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
