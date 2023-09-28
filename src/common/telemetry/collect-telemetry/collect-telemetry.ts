import {execSync} from 'child_process'
import * as fs from 'fs'
import fetch from 'node-fetch'
import * as path from 'path'
import {ProjenrcFile} from 'projen'
import type {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import type {IWithTelemetryReportUrl} from '../with-telemetry'
import {cloneWorkflow} from './clone-workflow'
import {diff} from './diff'
import {EscapeHatches, getEscapeHatches} from './get-escape-hatches'

interface TelemetryPayload {
  version?: string
  gitUrls?: Array<string>
  escapeHatches?: {
    files?: EscapeHatches
    overrides?: EscapeHatches
    tasks?: EscapeHatches
  }
  workflows?: {
    deleted?: Array<string>
    new?: Array<object>
    updated?: Array<object>
  }
  errors?: unknown
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
    const version = project.package.tryResolveDependencyVersion('@ottofeller/templates')

    if (version) {
      payload.version = version
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
    const files = getEscapeHatches(projenrcContents, fileHandles)
    const overrideHandles = ['addOverride', 'addDeletionOverride', 'addToArray', 'patch']
    const overrides = getEscapeHatches(projenrcContents, overrideHandles)
    const taskHandles = ['tryFind', 'addTask', 'removeTask', 'addScripts', 'removeScript']
    const tasks = getEscapeHatches(projenrcContents, taskHandles)

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
