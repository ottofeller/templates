import type {NodeProject} from 'projen/lib/javascript'

/**
 * Adds VsCode settings and recommended extensions to the project, unless vscode is disabled.
 *
 * NOTE: It can either explicitly disabled with the option `vscode: false`,
 * or automatically for projects that have a parent, so that only the root project has the settings.
 */
export const addVsCode = (project: NodeProject) => {
  if (!project.vscode) {
    return
  }

  const {extensions, settings} = project.vscode

  settings.addSettings({
    '[dockerfile]': {'editor.defaultFormatter': 'ms-azuretools.vscode-docker'},
    'eslint.options': {cache: true, reportUnusedDisableDirectives: 'error'},
    'eslint.useESLintClass': true,
    'json.schemaDownload.enable': true,
    'path-autocomplete.extensionOnImport': true,
    'typescript.tsdk': 'node_modules/typescript/lib',
  })

  extensions.addRecommendations(
    /* eslint-disable @cspell/spellchecker -- these words are used once, so no need to add them to the dictionary */
    'amazonwebservices.aws-toolkit-vscode',
    'bradlc.vscode-tailwindcss',
    'dbaeumer.vscode-eslint',
    'esbenp.prettier-vscode',
    'exodiusstudios.comment-anchors',
    'github.copilot',
    'github.vscode-pull-request-github',
    'graphql.vscode-graphql',
    'mikestead.dotenv',
    'mohsen1.prettify-json',
    'ms-azuretools.vscode-docker',
    'orta.vscode-jest',
    'Quidgest.vscode-velocity',
    'streetsidesoftware.code-spell-checker',
    /* eslint-enable @cspell/spellchecker */
  )

  extensions.addUnwantedRecommendations(
    /* eslint-disable @cspell/spellchecker -- these words are used once, so no need to add them to the dictionary */
    'DavidAnson.vscode-markdownlint',
    'GoogleCloudTools.cloudcode',
    'ms-kubernetes-tools.vscode-kubernetes-tools',
    /* eslint-enable @cspell/spellchecker */
  )
}
