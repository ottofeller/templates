import {synthSnapshot} from 'projen/lib/util/synth'
import {OttofellerBackendTestProject, OttofellerBackendTestProjectOptions} from '..'

describe('Backend-test template', () => {
  test('sets defaults', () => {
    const project = new TestBackendTestProject({hasGitHooks: true})
    const snapshot = synthSnapshot(project)
    expect(snapshot).toMatchSnapshot()
  })

  describe('has GraphQL', () => {
    test('enabled by default', () => {
      const project = new TestBackendTestProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).toHaveProperty('@apollo/client')
      expect(snapshot['package.json'].dependencies).toHaveProperty('graphql')
      expect(snapshot['package.json'].scripts).toHaveProperty('gql-to-ts')
      expect(snapshot['codegen.ts']).toBeDefined()
    })

    test('disabled with an option', () => {
      const project = new TestBackendTestProject({isGraphqlEnabled: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].dependencies).not.toHaveProperty('@apollo/client')
      expect(snapshot['package.json'].dependencies).not.toHaveProperty('graphql')
      expect(snapshot['package.json'].scripts).not.toHaveProperty('gql-to-ts')
      expect(snapshot['codegen.ts']).not.toBeDefined()
    })
  })

  describe('has AwsDynamoDb', () => {
    test('enabled by default', () => {
      const project = new TestBackendTestProject()
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).toHaveProperty('@aws-sdk/client-dynamodb')
      expect(snapshot['package.json'].devDependencies).toHaveProperty('@aws-sdk/lib-dynamodb')
    })

    test('disabled with an option', () => {
      const project = new TestBackendTestProject({isAWSDynamoDBEnabled: false})
      const snapshot = synthSnapshot(project)
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('@aws-sdk/client-dynamodb')
      expect(snapshot['package.json'].devDependencies).not.toHaveProperty('@aws-sdk/lib-dynamodb')
    })
  })
})

class TestBackendTestProject extends OttofellerBackendTestProject {
  constructor(options: Partial<OttofellerBackendTestProjectOptions> = {}) {
    super({
      ...options,
      name: 'test-backend-test-project',
      defaultReleaseBranch: 'main',
    })
  }
}
