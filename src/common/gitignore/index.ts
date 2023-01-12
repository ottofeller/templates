import type {Project} from 'projen'

const DEFAULT_PATTERNS = ['.DS_Store', '.env.local']

export function extendGitignore(project: Project, patterns: Array<string> = DEFAULT_PATTERNS) {
  patterns.forEach(project.addGitIgnore.bind(project))
}
