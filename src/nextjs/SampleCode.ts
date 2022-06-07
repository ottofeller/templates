import {Component, SampleDir, web} from 'projen'

/**
 * Sample Nextjs page.
 */
export class SampleCode extends Component {
  /**
   *
   * @param project Parent project to add files to.
   * @param path Path to a file to add. The path is relative to the source folder of the project.
   * @param code Code to insert into the file.
   */
  constructor(project: web.NextJsTypeScriptProject, path: string, code: string) {
    super(project)
    new SampleDir(project, project.srcdir, {files: {[path]: code}})
  }
}

/**
 * Source code for the index page.
 */
export const srcCode = `import Link from 'next/link'
import {memo} from 'react'

const Home = memo(function Home(props: {cookies?: Record<string, string>}) {
  return (
    <div className="grid gap-y-4 place-content-center place-items-center min-h-screen">
      <h2 className="text-24">It works!</h2>
      <nav className="grid gap-y-2">
        <Link className="text-2196f3 hover:opacity-75 transition-opacity" href="/">
          Home
        </Link>

        <Link className="text-2196f3 hover:opacity-75 transition-opacity" href="/post">
          Blog
        </Link>
      </nav>
      with cookies - {props.cookies?.io}
    </div>
  )
})

export default Home
`
