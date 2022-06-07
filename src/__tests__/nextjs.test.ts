import {DependencyType} from 'projen'
import {OttofellerNextJs} from '..'

describe('OttofellerNextJs project class', () => {
  const project = new OttofellerNextJs({
    name: 'test',
    defaultReleaseBranch: 'main',
  })

  test('adds dependencies to package', () => {
    const deps = ['next', 'react', '@apollo/client', 'tailwindcss']
    deps.forEach((dep) => expect(project.deps.getDependency(dep)).toBeTruthy())

    const devDeps = [
      '@ottofeller/dangerules',
      'danger',
      '@ottofeller/ofmt',
      'graphql',
      'jest',
      'stylelint',
      'typescript',
    ]

    devDeps.forEach((dep) => expect(project.deps.getDependency(dep, DependencyType.BUILD)).toBeTruthy())
  })

  test('adds tsconfig', () => {
    expect(project.tsconfig).toBeTruthy()
    expect(project.tsconfig!.compilerOptions.jsx).toEqual('preserve')
    expect(project.tsconfig!.compilerOptions.experimentalDecorators).toEqual(true)
  })
})
