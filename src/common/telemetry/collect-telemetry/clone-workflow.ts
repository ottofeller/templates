import type {GithubWorkflow} from 'projen/lib/github'

export const cloneWorkflow = (workflow: GithubWorkflow) => {
  const propsToDelete = ['project', 'file', 'github']
  const entries = Object.entries(workflow).filter(([key]) => !propsToDelete.includes(key))
  return Object.fromEntries(entries)
}
