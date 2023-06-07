import type {Project} from 'projen'
import {JsonFile} from 'projen'
import type {NodeProject} from 'projen/lib/javascript'
import {deepMerge} from 'projen/lib/util'
import {WithVSCode} from './with-vscode'

/**
 * VSCode settings for a project.
 */
export class VsCodeSettings extends JsonFile {
  private static readonly _FILENAME = '.vscode/settings.json'

  /**
   * Looks for VSCode settings in the given project.
   */
  public static of(project: Project): VsCodeSettings | undefined {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Assume the file is of desired shape if exists
    return project.tryFindObjectFile(VsCodeSettings._FILENAME) as VsCodeSettings | undefined
  }

  constructor(project: NodeProject, private readonly settings: Record<string, unknown> = {}) {
    super(project, VsCodeSettings._FILENAME, {
      obj: () => this.settings,
      marker: true,
      newline: true,
    })
  }

  /**
   * Merges existing settings with the given object.
   */
  add(settings: Record<string, unknown>) {
    deepMerge([this.settings, settings], true)
  }

  /**
   * Adds VsCodeSettings and a JSON file with recommended extensions to the project,
   * unless the options object has a `hasVscode=false` property.
   */
  static addToProject(project: NodeProject, options?: WithVSCode) {
    const hasVscode = options?.hasVscode ?? true

    if (!hasVscode) {
      return
    }

    // Settings file
    new VsCodeSettings(project, {
      '[dockerfile]': {'editor.defaultFormatter': 'ms-azuretools.vscode-docker'},
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
}
