/**
 * Web vitals provided to _app.reportWebVitals by Core Web Vitals plugin developed by Google Chrome team.
 * https://nextjs.org/blog/next-9-4#integrated-web-vitals-reporting
 */
declare const WEB_VITALS: readonly ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB']
declare type SubresourceIntegrityAlgorithm = 'sha256' | 'sha384' | 'sha512'
type ServerRuntime = 'nodejs' | 'experimental-edge' | undefined

export interface Amp {
  readonly optimizer?: any
  readonly validator?: string
  readonly skipValidation?: boolean
}

export interface ModularizeImportItem {
  readonly transform: string
  readonly preventFullImport?: boolean
  readonly skipDefaultConversion?: boolean
}

export interface SwcMinifyDebugOptions {
  readonly compress?: object
  readonly mangle?: object
}

export interface Sri {
  readonly algorithm?: SubresourceIntegrityAlgorithm
}

export interface FontLoaders {
  readonly loader: string
  readonly options?: any
}

export interface Turbotrace {
  readonly logLevel?: 'bug' | 'fatal' | 'error' | 'warning' | 'hint' | 'note' | 'suggestions' | 'info'
  readonly logDetail?: boolean
  readonly logAll?: boolean
  readonly contextDirectory?: string
  readonly processCwd?: string
  readonly maxFiles?: number
}

/**
 * NextJS experimental config copied from v13.0.4
 * @note The experimental features are not stable and can change with the next.js version.
 * @see https://github.com/vercel/next.js/blob/v13.0.4/packages/next/server/config-shared.ts#L81
 */
export interface ExperimentalConfig {
  readonly allowMiddlewareResponseBody?: boolean
  readonly skipMiddlewareUrlNormalize?: boolean
  readonly skipTrailingSlashRedirect?: boolean
  readonly optimisticClientCache?: boolean
  readonly middlewarePrefetch?: 'strict' | 'flexible'
  readonly legacyBrowsers?: boolean
  readonly manualClientBasePath?: boolean
  readonly newNextLinkBehavior?: boolean
  readonly incrementalCacheHandlerPath?: string
  readonly disablePostcssPresetEnv?: boolean
  readonly swcMinify?: boolean
  readonly swcFileReading?: boolean
  readonly cpus?: number
  readonly sharedPool?: boolean
  readonly profiling?: boolean
  readonly proxyTimeout?: number
  readonly isrFlushToDisk?: boolean
  readonly workerThreads?: boolean
  readonly pageEnv?: boolean
  readonly optimizeCss?: boolean | Record<string, unknown>
  readonly nextScriptWorkers?: boolean
  readonly scrollRestoration?: boolean
  readonly externalDir?: boolean
  readonly appDir?: boolean
  readonly amp?: Amp
  readonly disableOptimizedLoading?: boolean
  readonly gzipSize?: boolean
  readonly craCompat?: boolean
  readonly esmExternals?: boolean | 'loose'
  readonly isrMemoryCacheSize?: number
  readonly runtime?: Exclude<ServerRuntime, undefined>
  readonly fullySpecified?: boolean
  readonly urlImports?: any
  readonly outputFileTracingRoot?: string
  readonly modularizeImports?: Record<string, ModularizeImportItem>
  readonly swcTraceProfiling?: boolean
  readonly forceSwcTransforms?: boolean
  /**
   * The option for the minifier of [SWC compiler](https://swc.rs).
   * This option is only for debugging the SWC minifier, and will be removed once the SWC minifier is stable.
   *
   * @see [SWC Minification](https://nextjs.org/docs/advanced-features/compiler#minification)
   */
  readonly swcMinifyDebugOptions?: SwcMinifyDebugOptions
  readonly swcPlugins?: Array<[string, Record<string, unknown>]>
  readonly largePageDataBytes?: number
  /**
   * If set to `false`, webpack won't fall back to polyfill Node.js modules in the browser
   * Full list of old polyfills is accessible here:
   * [webpack/webpack#ModuleNotoundError.js#L13-L42](https://github.com/webpack/webpack/blob/2a0536cf510768111a3a6dceeb14cb79b9f59273/lib/ModuleNotFoundError.js#L13-L42)
   */
  readonly fallbackNodePolyfills?: false
  readonly enableUndici?: boolean
  readonly sri?: Sri
  readonly adjustFontFallbacks?: boolean
  readonly adjustFontFallbacksWithSizeAdjust?: boolean
  readonly serverComponentsExternalPackages?: string[]
  readonly transpilePackages?: string[]
  readonly fontLoaders?: Array<FontLoaders>
  readonly webVitalsAttribution?: Array<typeof WEB_VITALS[number]>
  readonly turbotrace?: Turbotrace
  readonly mdxRs?: boolean
}
