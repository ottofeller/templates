import {readdirSync} from 'fs'
import type {API, FileInfo, Options} from 'jscodeshift'

const srcContents = readdirSync('src').map((path) => path.replace(/\.[^.]*$/, ''))

export default function transformer(file: FileInfo, api: API, options: Options) {
  const j = api.jscodeshift.withParser('tsx')
  const root = j(file.source)
  let hasChanges = false

  // Before: import {Home} from 'Home'
  // After:  import {Home} from 'src/Home'
  root
    .find(j.ImportDeclaration, ({source}) =>
      srcContents.some((path) => typeof source.value === 'string' && source.value.startsWith(path)),
    )
    .forEach(({node}) => {
      hasChanges = true
      node.source = j.stringLiteral(`src/${node.source.value}`)
    })

  return hasChanges ? root.toSource(options) : file.source
}
