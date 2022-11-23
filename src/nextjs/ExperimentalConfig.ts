/**
 * Web vitals provided to _app.reportWebVitals by Core Web Vitals plugin developed by Google Chrome team.
 * https://nextjs.org/blog/next-9-4#integrated-web-vitals-reporting
 */
declare const WEB_VITALS: readonly ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB']
declare type SubresourceIntegrityAlgorithm = 'sha256' | 'sha384' | 'sha512'
type ServerRuntime = 'nodejs' | 'experimental-edge' | undefined

/**
 * NextJS experimental config copied from v13.0.4
 * @note The experimental features are not stable and can change with the next.js version.
 * @see https://github.com/vercel/next.js/blob/v13.0.4/packages/next/server/config-shared.ts#L81
 */
export interface ExperimentalConfig {
  allowMiddlewareResponseBody?: boolean
  skipMiddlewareUrlNormalize?: boolean
  skipTrailingSlashRedirect?: boolean
  optimisticClientCache?: boolean
  middlewarePrefetch?: 'strict' | 'flexible'
  legacyBrowsers?: boolean
  manualClientBasePath?: boolean
  newNextLinkBehavior?: boolean
  incrementalCacheHandlerPath?: string
  disablePostcssPresetEnv?: boolean
  swcMinify?: boolean
  swcFileReading?: boolean
  cpus?: number
  sharedPool?: boolean
  profiling?: boolean
  proxyTimeout?: number
  isrFlushToDisk?: boolean
  workerThreads?: boolean
  pageEnv?: boolean
  optimizeCss?: boolean | Record<string, unknown>
  nextScriptWorkers?: boolean
  scrollRestoration?: boolean
  externalDir?: boolean
  appDir?: boolean
  amp?: {
    optimizer?: any
    validator?: string
    skipValidation?: boolean
  }
  disableOptimizedLoading?: boolean
  gzipSize?: boolean
  craCompat?: boolean
  esmExternals?: boolean | 'loose'
  isrMemoryCacheSize?: number
  runtime?: Exclude<ServerRuntime, undefined>
  fullySpecified?: boolean
  urlImports?: any
  outputFileTracingRoot?: string
  modularizeImports?: Record<
    string,
    {
      transform: string
      preventFullImport?: boolean
      skipDefaultConversion?: boolean
    }
  >
  swcTraceProfiling?: boolean
  forceSwcTransforms?: boolean
  /**
   * The option for the minifier of [SWC compiler](https://swc.rs).
   * This option is only for debugging the SWC minifier, and will be removed once the SWC minifier is stable.
   *
   * @see [SWC Minification](https://nextjs.org/docs/advanced-features/compiler#minification)
   */
  swcMinifyDebugOptions?: {
    compress?: object
    mangle?: object
  }
  swcPlugins?: Array<[string, Record<string, unknown>]>
  largePageDataBytes?: number
  /**
   * If set to `false`, webpack won't fall back to polyfill Node.js modules in the browser
   * Full list of old polyfills is accessible here:
   * [webpack/webpack#ModuleNotoundError.js#L13-L42](https://github.com/webpack/webpack/blob/2a0536cf510768111a3a6dceeb14cb79b9f59273/lib/ModuleNotFoundError.js#L13-L42)
   */
  fallbackNodePolyfills?: false
  enableUndici?: boolean
  sri?: {
    algorithm?: SubresourceIntegrityAlgorithm
  }
  adjustFontFallbacks?: boolean
  adjustFontFallbacksWithSizeAdjust?: boolean
  serverComponentsExternalPackages?: string[]
  transpilePackages?: string[]
  fontLoaders?: Array<{
    loader: string
    options?: any
  }>
  webVitalsAttribution?: Array<typeof WEB_VITALS[number]>
  turbotrace?: {
    logLevel?: 'bug' | 'fatal' | 'error' | 'warning' | 'hint' | 'note' | 'suggestions' | 'info'
    logDetail?: boolean
    logAll?: boolean
    contextDirectory?: string
    processCwd?: string
    maxFiles?: number
  }
  mdxRs?: boolean
}
