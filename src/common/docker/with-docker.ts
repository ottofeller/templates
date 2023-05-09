export interface WithDocker {
  /**
   * Include docker-related files such as `.dockerignore`, `Dockerfile`, etc.
   *
   * @default true
   */
  readonly hasDocker?: boolean
}
