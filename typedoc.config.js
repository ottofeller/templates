/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['./src/index.ts'],
  excludeExternals: true,
  excludeInternal: true,
  excludeNotDocumentedKinds: ['Module'],
  excludePrivate: true,
  githubPages: false,
  includeVersion: true,
  plugin: ['@sisense/typedoc-plugin-markdown'],
  readme: 'none',
}
