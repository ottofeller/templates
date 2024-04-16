import * as fs from 'fs'
import * as path from 'path'
import type {SampleReadmeProps} from 'projen'

export const getReadmeOptions = (projectTitle: string): SampleReadmeProps => {
  const sampleReadmePath = path.join(__dirname, '../../..', 'src/common/readme/assets/README.md')
  const contents = fs.readFileSync(sampleReadmePath, 'utf-8').replace('{{PROJECT_TITLE}}', projectTitle)
  return {contents}
}
