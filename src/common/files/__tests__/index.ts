import * as path from 'path'
import {format, Options} from 'prettier'
import {NodeProject, NodeProjectOptions} from 'projen/lib/javascript'
import {synthSnapshot} from 'projen/lib/util/synth'
import {AssetFile} from '../AssetFile'

jest.mock('prettier')

describe('AssetFile util', () => {
  const sourcePath = path.join(__dirname, 'asset.txt')
  const template = {templateString: '{{REPLACE ME}}', replacement: 'updated'}

  test('copies a file from specified path', () => {
    const project = new TestProject()
    new AssetFile(project, 'asset.txt', {sourcePath})
    const snapshot = synthSnapshot(project)
    const asset = snapshot['asset.txt']
    expect(asset).toBeDefined()
    expect(asset).toEqual('test asset {{REPLACE ME}}\n')
  })

  test('allows template string replacement', () => {
    const project = new TestProject()
    new AssetFile(project, 'asset.txt', {sourcePath, template})
    const snapshot = synthSnapshot(project)
    const asset = snapshot['asset.txt']
    expect(asset).toBeDefined()
    expect(asset).toEqual('test asset updated\n')
  })

  test('formats JS/TS code with prettier after template replacement', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TS is not aware of the Jest mock, thus casting is needed
    const mockedFormat = format as unknown as jest.Mock<string, [string, Options]>
    mockedFormat.mockReturnValue('formatted content')
    const project = new TestProject()
    new AssetFile(project, 'asset.ts', {sourcePath, template})
    synthSnapshot(project)
    expect(mockedFormat).toBeCalledTimes(1)
    expect(mockedFormat).toBeCalledWith('test asset updated\n', expect.any(Object))
  })
})

class TestProject extends NodeProject {
  constructor(options: Partial<NodeProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-project',
      defaultReleaseBranch: 'main',
    })
  }
}
