import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Rakna
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Modern Parking Management System
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

