import * as projen from 'projen'
import {JobStep} from 'projen/lib/github/workflows-model'

export const job = (steps: Array<JobStep>) => ({
  runsOn: ['ubuntu-latest'],
  permissions: {contents: projen.github.workflows.JobPermission.READ},
  steps,
})
