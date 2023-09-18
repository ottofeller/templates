import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerReactComponentProject} from '..'
import {OttofellerComponentOptions} from '../../component-options'

describe('React component template', () => {
  test('sets defaults', () => {
    const project = new TestOttofellerReactComponentProject()
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
  })

  test('allows setting component name', () => {
    const name = 'UniqueComponent'
    const project = new TestOttofellerReactComponentProject({name})
    const snapshot = synthSnapshot(project)
    expect(snapshot['index.tsx']).toMatch(new RegExp(`export const ${name} = memo\\(function ${name}\\(`))
    expect(snapshot['__tests__/index.tsx']).toMatch(new RegExp(`const {container} = render\\(<${name} \\/>\\)`))
  })
})

class TestOttofellerReactComponentProject extends OttofellerReactComponentProject {
  constructor(options: Partial<OttofellerComponentOptions> = {}) {
    super({name: 'TestReactComponent', ...options})
  }
}
