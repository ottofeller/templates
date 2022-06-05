import {DependencyType} from 'projen'
import {OttofellerNextJs} from '..'

test('add dependencies to package and jsx to tsconfig', () => {
  const project = new OttofellerNextJs({
    name: 'test',
    defaultReleaseBranch: 'main',
  })

  expect(project.deps.getDependency('next')).toBeTruthy()
  expect(project.deps.getDependency('jest', DependencyType.BUILD)).toBeTruthy()
  expect(project.tsconfig!.compilerOptions.jsx).toEqual('preserve')
})
