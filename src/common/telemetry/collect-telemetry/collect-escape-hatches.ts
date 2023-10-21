import type {MaybePlural} from '../../MaybePlural'

export type EscapeHatches = Record<string, MaybePlural<string>>

/**
 * Search for given symbols (provided as a list) in source code.
 * For each found method call reports arguments.
 *
 * @param source Source code content
 * @param methods Methods to report
 *
 * @returns A mapping object between found method calls and the call arguments.
 */
export const collectEscapeHatches = (source: string, methods: Array<string>): EscapeHatches => {
  const regex = new RegExp(`\\.(${methods.join('|')})\\((.*)\\)`, 'g')
  const handles = source.matchAll(regex)

  return Array.from(handles).reduce<EscapeHatches>((acc, [, method, args]) => {
    if (!acc[method]) {
      acc[method] = args
      return acc
    }

    let value = acc[method]

    if (!Array.isArray(value)) {
      value = [value]
    }

    value.push(args)
    acc[method] = value
    return acc
  }, {})
}
