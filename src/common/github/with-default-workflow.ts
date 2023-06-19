export interface WithDefaultWorkflow {
  /**
   * Include a default GitHub pull request template.
   *
   * @default true
   */
  readonly hasDefaultGithubWorkflows?: boolean

  /**
   * Enables/disables the lighthouse integration
   *
   * @default true
   */
  readonly isLighthouseEnabled?: boolean
}
