import type {GithubWorkflow} from 'projen/lib/github'

/**
 * Get a GithubWorkflow component and create a copy with only essential properties:
 * all internal projen staff is deleted in order to avoid circular references.
 */
export const cloneWorkflow = (workflow: GithubWorkflow): Record<string, unknown> => {
  const propsToDelete = ['project', 'file', 'github']
  const entries = Object.entries(workflow).filter(([key]) => !propsToDelete.includes(key))
  return Object.fromEntries(entries)
}
