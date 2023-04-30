/* eslint-disable import/no-relative-parent-imports -- JSII project rewrites tsconfig thus always overriding introduced aliases */
import * as fs from 'fs'
import {format} from 'prettier'
import {Project, TextFile, TextFileOptions} from 'projen'
import {prettierConfig} from '../lint/configs/prettier'
import {MaybePlural} from '../MaybePlural'

/**
 * Options for template string replacement within an `AssetFile`.
 */
export interface AssetFileTemplate {
  /**
   * A string within template to search for. This string will be replaced with your content.
   */
  readonly templateString: string

  /**
   * The string that will put into the template in place of `templateString`.
   */
  readonly replacement: string
}

/**
 * Options for `AssetFile`.
 */
export interface AssetFileOptions extends TextFileOptions {
  /**
   * Absolute path to a file to copy the contents from (does not need to be a text file).
   */
  readonly sourcePath: string

  /**
   * Absolute path to a file to copy the contents from (does not need to be a text file).
   */
  readonly template?: MaybePlural<AssetFileTemplate>
}

/**
 * An asset file.
 */
export class AssetFile extends TextFile {
  /**
   * Defines an asset file.
   *
   * @param project The project
   * @param filePath File path
   * @param options Options
   */
  constructor(project: Project, filePath: string, options: AssetFileOptions) {
    // ANCHOR Replace template strings
    let lines = fs.readFileSync(options.sourcePath, 'utf-8').split('\n')

    if (options.template) {
      const {template} = options
      const templateArray = Array.isArray(template) ? template : [template]

      lines = templateArray.reduce<Array<string>>(
        (content, {templateString, replacement}: AssetFileTemplate) =>
          content.map((line) => (line.includes(templateString) ? line.replace(templateString, replacement) : line)),
        lines,
      )

      if (/\.(j|t)sx?$/.test(filePath)) {
        lines = format(lines.join('\n'), prettierConfig).split('\n')
      }
    }

    // ANCHOR Create the file
    super(project, filePath, {...options, lines})
  }
}
