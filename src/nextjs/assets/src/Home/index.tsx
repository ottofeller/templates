import Link from 'next/link'
import {memo} from 'react'

export const Home = memo(function Home(props: {cookies?: Record<string, string>}) {
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
