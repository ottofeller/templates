import {execSync} from 'child_process'
import * as fs from 'fs'
import fetch from 'node-fetch'
import * as path from 'path'
import {ProjenrcFile} from 'projen'
import type {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import type {IWithTelemetryReportUrl} from '../i-with-telemetry-report-url'
import {cloneWorkflow} from './clone-workflow'
import {EscapeHatches, collectEscapeHatches} from './collect-escape-hatches'
import {diff} from './diff'

interface TelemetryPayload {
  /**
   * Template package version used in the project
   */
  templateVersion?: string

  /**
   * Remote URLs set in git for the project repo
   */
  gitUrls?: Array<string>

  /**
   * A collection of escape hatches used to tune the project setup.
   * Projen has some methods to alter the content of generated files.
   * Even though these changes might be required by a project,
   * projen mechanisms might lack versatility and disallow some kind of edits.
   * We try to find such measures in order to improve the template functionality.
   *
   * @see http://projen.io/escape-hatches.html
   */
  escapeHatches?: {
    files?: EscapeHatches
    overrides?: EscapeHatches
    tasks?: EscapeHatches
  }

  /**
   * Github workflows set up in the project.
   * Reports the new workflows added as well as deletion
   * or modification of the default one.
   */
  workflows?: {
    deleted?: Array<string>
    new?: Array<object>
    updated?: Array<object>
  }

  /**
   * Any errors caught collecting other metrics - mostly related to external process calls,
   * such as `execSync`, `readFileSync`, etc.
   */
  errors?: Array<unknown>
}

export const telemetryEnableEnvVar = 'IS_OTTOFELLER_TEMPLATES_TELEMETRY_COLLECTED' as const

export const collectTelemetry = async (project: NodeProject & IWithTelemetryReportUrl) => {
  if (!project.telemetryReportUrl || !process.env[telemetryEnableEnvVar]) {
    return
  }

  project.logger.info('Collect project telemetry')
  const payload: TelemetryPayload = {}
  const errors: Array<unknown> = []

  // ANCHOR template version
  try {
    const templateVersion = project.package.tryResolveDependencyVersion('@ottofeller/templates')

    if (templateVersion) {
      payload.templateVersion = templateVersion
    }
  } catch (e) {
    errors.push(e)
  }

  // ANCHOR git urls
  try {
    const gitUrls = execSync('git remote -v', {encoding: 'utf-8'})
      .split('\n')
      .map((item) => item.split(/\s+/)[1])

    const uniqueGitUrls = Array.from(new Set(gitUrls)).filter(Boolean)

    if (uniqueGitUrls.length > 0) {
      payload.gitUrls = uniqueGitUrls
    }
  } catch (e) {
    errors.push(e)
  }

  // ANCHOR escape hatches
  try {
    const rcFile = ProjenrcFile.of(project)?.filePath

    if (!rcFile) {
      throw 'projenrc file not found'
    }

    const rcFilePath = path.resolve(project.outdir, rcFile)
    const projenrcContents = fs.readFileSync(rcFilePath, 'utf-8')
    const fileHandles = ['tryFindFile', 'tryFindObjectFile', 'tryRemoveFile', 'tryFindWorkflow']
    const files = collectEscapeHatches(projenrcContents, fileHandles)
    const overrideHandles = ['addOverride', 'addDeletionOverride', 'addToArray', 'patch']
    const overrides = collectEscapeHatches(projenrcContents, overrideHandles)
    const taskHandles = ['tryFind', 'addTask', 'removeTask', 'addScripts', 'removeScript']
    const tasks = collectEscapeHatches(projenrcContents, taskHandles)

    if (files || overrides || tasks) {
      payload.escapeHatches = {files, overrides, tasks}
    }
  } catch (e) {
    errors.push(e)
  }

  // ANCHOR github workflows
  try {
    const {github} = project

    if (github) {
      const workflows: TelemetryPayload['workflows'] = {}
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- NodeProject does not provide constructor typings and thus not inferred
      const projectConstructor = project.constructor as new (opt: NodeProjectOptions) => NodeProject
      const defaultProject = new projectConstructor({defaultReleaseBranch: 'main', name: 'default-project'})

      // deleted workflows
      const deletedWorkflows = defaultProject.github!.workflows.filter(
        (workflow) => !github.tryFindWorkflow(workflow.name),
      )

      if (deletedWorkflows.length > 0) {
        workflows.deleted = deletedWorkflows.map((workflow) => workflow.name)
      }

      // new workflows
      const newWorkflows = github.workflows.filter((workflow) => !defaultProject.github!.tryFindWorkflow(workflow.name))

      if (newWorkflows.length > 0) {
        workflows.new = newWorkflows.map(cloneWorkflow)
      }

      // updated workflows
      const updatedWorkflows = defaultProject
        .github!.workflows.map((defaultWorkflow) => [defaultWorkflow, github.tryFindWorkflow(defaultWorkflow.name)])
        .filter(([, updatedWorkflow]) => updatedWorkflow)
        .map(([defaultWorkflow, updatedWorkflow]) => ({
          // NOTE Here we create object clones in order to eliminate all circular refs
          // and leave only the properties essential to GitHub workflows.
          ...diff(cloneWorkflow(defaultWorkflow!), cloneWorkflow(updatedWorkflow!)),
          name: defaultWorkflow!.name,
        }))
        .filter((workflowDiff) => Object.keys(workflowDiff).length > 1)

      if (updatedWorkflows.length > 0) {
        workflows.updated = updatedWorkflows
      }

      if (Object.keys(workflows).length > 0) {
        payload.workflows = workflows
      }
    }
  } catch (e) {
    errors.push(e)
  }

  if (errors.length > 0) {
    payload.errors = errors
  }

  try {
    const body = JSON.stringify(payload)
    project.logger.info('Collected telemetry:', body)
    const {status, statusText} = await fetch(project.telemetryReportUrl!, {method: 'post', body})
    project.logger.info('Telemetry endpoint responded with status', status, statusText)
  } catch (e) {
    project.logger.error('Telemetry serialization or network error', e)
  }
}
