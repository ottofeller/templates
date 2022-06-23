import type {Project} from 'projen'
import {JsonFile} from 'projen'
import type {NodeProject} from 'projen/lib/javascript'
import {deepMerge} from 'projen/lib/util'

export class VsCodeSettings extends JsonFile {
  // @ts-ignore -- Even though "typecheck" does not complain, the "compile" task emits a TS18019 error and fails.
  static readonly #fileName = '.vscode/settings.json'

  public static of(project: Project): VsCodeSettings | undefined {
    return project.tryFindObjectFile(VsCodeSettings.#fileName) as VsCodeSettings | undefined
  }

  constructor(project: NodeProject, private readonly settings: Record<string, unknown> = {}) {
    super(project, VsCodeSettings.#fileName, {
      obj: () => this.settings,
      marker: true,
      newline: true,
    })
  }

  add(settings: Record<string, unknown>) {
    deepMerge([this.settings, settings], true)
  }
}

export function configureVSCode(project: NodeProject) {
  // Settings file
  new VsCodeSettings(project, {
    '[dockerfile]': {
      'editor.defaultFormatter': 'ms-azuretools.vscode-docker',
    },
    'typescript.tsdk': 'node_modules/typescript/lib',
    'path-autocomplete.extensionOnImport': true,
    'json.schemaDownload.enable': true,
  })

  // Recommended extensions
  new JsonFile(project, '.vscode/extensions.json', {
    newline: true,
    obj: {
      recommendations: [
        'exodiusstudios.comment-anchors',
        'mikestead.dotenv',
        'dbaeumer.vscode-eslint',
        'mohsen1.prettify-json',
        'github.copilot',
        'graphql.vscode-graphql',
        'bradlc.vscode-tailwindcss',
        'esbenp.prettier-vscode',
        'github.vscode-pull-request-github',
        'streetsidesoftware.code-spell-checker',
        'orta.vscode-jest',
        'amazonwebservices.aws-toolkit-vscode',
        'ms-azuretools.vscode-docker',
        'Quidgest.vscode-velocity',
      ],
      unwantedRecommendations: [
        'DavidAnson.vscode-markdownlint',
        'GoogleCloudTools.cloudcode',
        'ms-kubernetes-tools.vscode-kubernetes-tools',
      ],
    },
  })
}
