export interface WithIgnoreBranches {
  /**
   * An array of branch names to be excluded from commit message formatting.
   *
   * @default ['main', 'dev']
   */
  readonly ignoreBranches?: Array<string>
}

export const defaultIgnoreBranches = ['main', 'dev']
