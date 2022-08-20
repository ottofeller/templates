import * as fs from 'fs'
import {Project, TextFile, TextFileOptions} from 'projen'

/**
 * Options for `AssetFile`.
 */
export interface AssetFileOptions extends TextFileOptions {
  /**
   * Absolute path to a file to copy the contents from (does not need to be a text file).
   */
  readonly sourcePath: string
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
    super(project, filePath, {...options, lines: fs.readFileSync(options.sourcePath, 'utf-8').split('\n')})
  }
}
