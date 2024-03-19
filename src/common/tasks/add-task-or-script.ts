import type {TaskOptions} from 'projen'
import type {NodeProject} from 'projen/lib/javascript'

/**
 * Adds a new task to this project. This will fail if the project already has a task with this name.
 *
 * If the project is ejected instead compiles a command and writes it as a script to package.json.
 *
 * @param name — The task name to add
 * @param props — Task properties
 */
export const addTaskOrScript = (project: NodeProject, name: string, props: TaskOptions): void => {
  if (!project.ejected) {
    project.addTask(name, props)
    return
  }

  const execute = props.exec

  const steps = props.steps
    ?.map(({exec, spawn}) => exec ?? (spawn ? `${project.runScriptCommand} ${spawn}` : ''))
    .filter(Boolean)
    .join(' && ')

  project.addScripts({[name]: execute ?? steps ?? ''})
}
