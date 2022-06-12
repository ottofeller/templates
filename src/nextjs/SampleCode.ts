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
    const [, dir, file] = path.match(/(.*)\/(.*\..*)$/) || []
    new SampleDir(project, `${project.srcdir}${dir ? `/${dir}` : ''}`, {files: {[file || path]: code}})
  }
}

/**
 * Source code for the index page.
 */
export const indexPage = `import Link from 'next/link'
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

/**
 * Source code for the index page.
 */
export const indexPageTest = `import {MockedProvider} from '@apollo/client/testing'
import {render, screen} from '@testing-library/react'
import {act} from 'react-dom/test-utils'
import Home from '../index'

jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: () => new Promise((resolve) => resolve('')),
    route: '/',
    query: {id: 1},
  }),
}))

describe('Home page', () => {
  it('shows title', async () => {
    render(
      <MockedProvider addTypename={false}>
        <Home cookies={{}} />
      </MockedProvider>,
    )

    await act(async () => {
      // Wait for a query;
      await new Promise((resolve) => setTimeout(resolve))
    })

    expect(screen.getByText('It works!')).toBeTruthy()
  })
})
`

/**
 * Source code for the Users GraphQL query.
 */
export const usersGraphqlQuery = `import gql from 'graphql-tag'

export const Users = gql\`
  query Users {
    user {
      id
      firstName
      lastName
    }
  }
\`
`

/**
 * Source code for the Users GraphQL query.
 */
 export const usersListGraphqlQuery = usersGraphqlQuery.replace(/Users/g, 'UsersList')
