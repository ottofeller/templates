type DictionaryDefinition = {
  name: string
  path: string
}

type LanguageSettings = {
  /**
   * VSCode languageId. i.e. typescript, java, go, cpp, javascript, markdown, latex
   * will match against any file type.
   */
  languageId: string

  /**
   * Language locale. i.e. en-US, de-AT, or ru. * will match all locales.
   * Multiple locales can be specified like: "en, en-US" to match both English and English US.
   */
  locale: string

  /** To exclude patterns, add them to "ignoreRegExpList" */
  ignoreRegExpList: Array<string>

  /** List of dictionaries to enable by name in `dictionaryDefinitions` */
  dictionaries: Array<string>

  /**
   * Dictionary definitions can also be supplied here.
   * They are only used iff "languageId" and "locale" match.
   */
  dictionaryDefinitions: Array<DictionaryDefinition>
}

/** @see https://cspell.org/configuration/#cspelljson-sections */
type CSpellConfig = {
  /** Currently always 0.2 - controls how the settings in the configuration file behave. */
  version: string

  /** NOTE: Not standard. */
  enabled?: boolean

  /**
   * This specifies the language locale to use in choosing the general dictionary.
   * For example: "language": "en-GB" tells cspell to use British English instead of US English.
   */
  language: string

  /** A list of words to be considered correct. */
  words?: Array<string>

  /** A list of words to be always considered incorrect */
  flagWords?: Array<string>

  /** A list of words to be ignored (even if they are in the flagWords). */
  ignoreWords?: Array<string>

  /**
   * A list of globs to specify which files are to be ignored.
   *
   * @example
   * "ignorePaths": ["node_modules/**"]
   * // will cause cspell to ignore anything in the node_modules directory.
   */
  ignorePaths?: Array<string>

  /** @default 100 */
  maxNumberOfProblems?: number

  /**
   * The minimum length of a word before it is checked.
   * @default 4
   */
  minWordLength?: number

  /**
   * Set to true to allow compound words by default.
   * @default false
   */
  allowCompoundWords?: boolean

  /** A list of the names of the dictionaries to use. */
  dictionaries?: Array<string>

  /**
   * This list defines any custom dictionaries to use.
   * This is how you can include other languages like Spanish.
   *
   * @example
   * "language": "en",
   * // Dictionaries "spanish", "ruby", and "corp-terms" will always be checked.
   * // Including "spanish" in the list of dictionaries means both Spanish and English
   * // words will be considered correct.
   * "dictionaries": ["spanish", "ruby", "corp-terms", "fonts"],
   * // Define each dictionary:
   * //  - Relative paths are relative to the config file.
   * //  - URLs will be retrieved via HTTP GET
   * "dictionaryDefinitions": [
   *   {"name": "spanish", "path": "./spanish-words.txt"},
   *   {"name": "ruby", "path": "./ruby.txt"},
   *   {"name": "corp-terms", "path": "https://shared-company-repository/cspell-terms.txt"},
   * ],
   */
  dictionaryDefinitions?: Array<DictionaryDefinition>

  /** A list of patterns to be ignored */
  ignoreRegExpList?: Array<string>

  /** (Advanced) limits the text checked to be only that matching the expressions in the list.*/
  includeRegExpList?: Array<string>

  /**
   * This allows you to define named patterns to be used with ignoreRegExpList and includeRegExpList.
   *
   * @example
   * "patterns": [
   *   {
   *     "name": "comment-single-line",
   *     "pattern": "/#.*"
   *   },
   *   {
   *     "name": "comment-multi-line",
   *     "pattern": "/(?:\\/\\*[\\s\\S]*?\\*\\/)/g"
   *   },
   * // You can also combine multiple named patterns into one single named pattern
   *   {
   *     "name": "comments",
   *     "pattern": ["comment-single-line", "comment-multi-line"]
   *   }
   * ],
   * "ignoreRegExpList": ["comments"]
   */
  patterns?: Array<string>

  /** This allow for per programming language configuration settings. */
  languageSettings?: LanguageSettings

  /** NOTE: Not standard */
  enabledLanguageIds?: Array<string>
}

export const cSpellConfig: CSpellConfig = {
  version: '0.2',
  enabled: true,
  language: 'en',
  allowCompoundWords: true,
  dictionaries: ['typescript', 'node', 'npm', 'html', 'css'],
  enabledLanguageIds: ['typescript', 'typescriptreact', 'javascript', 'markdown', 'yaml', 'json'],
  ignorePaths: [
    '.gitignore',
    '__tests__',
    'CoreFeatures',
    'Dockerfile',
    'generated',
    'hasura',
    'node_modules',
    '*.webp',
    '*.tsbuildinfo',
    '*.json',
    '*.config.js',
    '*.yaml',
    '*.py',
    '*.cfg',
    '*.graphql',
    '*.sum',
    '**/parameters/**/*',
  ],
  words: [
    'cicd',
    'dangerules',
    'devs',
    'hasura',
    'ilike',
    'nextjs',
    'ofmt',
    'pkey',
    'projen',
    'projenrc',
    'Println',
    'testid',
    'timestamptz',
    'webm',
  ],
}
