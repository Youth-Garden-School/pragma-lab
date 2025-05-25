import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-xl">Page not found</h2>
      <Link
        href="/"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      >
        Back to Home
      </Link>
    </div>
  )
}
