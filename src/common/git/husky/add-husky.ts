import type {NodeProject} from 'projen/lib/javascript'
import {checkCargo} from './check-cargo'
import {commitMessage} from './commit-message'
import {WithGitHooks} from './with-git-hooks'

export const addHusky = (project: NodeProject, options: WithGitHooks): void => {
  project.addDevDeps('husky')
  project.addTask('prepare', {exec: 'husky install'})
  const huskyRules = options.huskyRules ?? {commitMsg: true}

  Object.entries(huskyRules)
    .filter(([, value]) => value) // Do not handle falsy values, e.g. {checkCargo: undefined, commitMsg: false}
    .forEach(([ruleId]) => {
      switch (ruleId) {
        case 'checkCargo':
          const checkCargoOptions = huskyRules.checkCargo ?? {}
          checkCargo(project, checkCargoOptions)
          break
        case 'commitMsg':
          commitMessage(project)
          break
        default:
          throw new Error(`unexpected husky rule "${ruleId}"`)
      }
    })
}
