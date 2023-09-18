/**
 * Common options for component templates.
 */
export interface OttofellerComponentOptions {
  /**
   * The name of the component.
   *
   * @default $BASEDIR
   * @featured
   */
  readonly name: string

  /**
   * The directory to put component into.
   *
   * Relative to this directory, all files are synthesized.
   *
   * @default "."
   */
  readonly outdir?: string
}
