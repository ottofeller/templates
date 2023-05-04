/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import * as path from 'path'
import * as projen from 'projen'
import type {OttofellerNextjsProject, OttofellerNextjsProjectOptions} from '.'
import {AssetFile} from '../common'

/**
 * Check options for UI flag and setup the required packages in the project. Add corresponding configs.
 */
export function setupUIPackages(
  project: OttofellerNextjsProject,
  options: OttofellerNextjsProjectOptions,
  assetsDir: string,
) {
  const isUiConfigEnabled = options.isUiConfigEnabled ?? true

  if (!isUiConfigEnabled) {
    return
  }

  project.addDeps('@headlessui/react')

  project.addDevDeps(
    'postcss',
    'tailwindcss',
    'autoprefixer',
    '@tailwindcss/line-clamp',
    '@tailwindcss/container-queries',
    'postcss-nesting',
  )

  new projen.JsonFile(project, 'postcss.config.json', {
    obj: {plugins: {'tailwindcss/nesting': 'postcss-nesting', tailwindcss: {}, autoprefixer: {}}},
    marker: false,
  })

  new AssetFile(project, 'tailwind.config.defaults.ts', {
    sourcePath: path.join(assetsDir, 'tailwind.config.defaults.ts.sample'),
  })

  new projen.SampleFile(project, 'tailwind.config.ts', {sourcePath: path.join(assetsDir, 'tailwind.config.ts.sample')})

  // FIXME This following code is a workaround needed until eslint-plugin-tailwindcss adds typescript support for the config.
  const customConfig = 'tailwind-config.js'
  new projen.SampleFile(project, customConfig, {sourcePath: path.join(assetsDir, customConfig)})
  project.tryFindObjectFile('.eslintrc.json')!.addOverride('settings.tailwindcss.config', customConfig)
}
