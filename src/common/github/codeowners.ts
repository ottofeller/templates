import {FileBase, FileBaseOptions, IResolver, Project} from 'projen'
import {GitHub, GitHubProject} from 'projen/lib/github'

export interface WithCodeOwners {
  /**
   * A list of objects that define a file pattern and corresponding owners for it.
   */
  readonly codeOwners?: Array<PatternOwners>
}

export interface PatternOwners {
  /**
   * File pattern to add owners to.
   */
  readonly pattern: string

  /**
   * A list of accounts/teams to own the files.
   */
  readonly owners?: Array<string>
}

export interface CodeOwnersOptions extends FileBaseOptions {
  /**
   * A list of objects that define a file pattern and corresponding owners for it.
   */
  readonly codeOwners?: Array<PatternOwners>
}

export class CodeOwners extends FileBase {
  private readonly _codeOwners: Array<PatternOwners>

  constructor(github: GitHub, options: CodeOwnersOptions = {}) {
    super(github.project, 'CODEOWNERS', options)
    this._codeOwners = options.codeOwners ?? []
  }

  public static of(project: Project): CodeOwners | undefined {
    return project.components.find((component): component is CodeOwners => component instanceof CodeOwners)
  }

  /**
   * Optionally creates a workflow within the given project.
   */
  public static addToProject(project: GitHubProject, options: WithCodeOwners) {
    if (!project.github || !options.codeOwners) {
      return
    }

    new CodeOwners(project.github, {codeOwners: options.codeOwners})
  }

  /**
   * Adds owners to a file pattern.
   * Note that the order of owner definitions matters.
   * @param codeOwners owners to add
   */
  public addOwners(...codeOwners: Array<PatternOwners>) {
    this._codeOwners.push(...codeOwners)
  }

  protected synthesizeContent(_: IResolver): string | undefined {
    const lines = [
      ...(this.marker ? [`# ${this.marker}`] : []),
      ...this._codeOwners.map(({owners, pattern}) => `${pattern}${owners ? ` ${owners.join(' ')}` : ''}`),
    ]

    return `${lines.join('\n')}\n`
  }
}
