import Link from 'next/link'
import {memo} from 'react'

export const Home = memo(function Home(props: {cookies?: Record<string, string>}) {
  return (
    <div className="grid min-h-screen place-content-center place-items-center gap-y-4">
      <h2 className="text-2xl">It works!</h2>
      <nav className="grid gap-y-2">
        <Link className="text-blue-500 transition-opacity hover:opacity-75" href="/">
          Home
        </Link>

        <Link className="text-blue-500 transition-opacity hover:opacity-75" href="/post">
          Blog
        </Link>
      </nav>
      with cookies - {props.cookies?.io}
    </div>
  )
})
