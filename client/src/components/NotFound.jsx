import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="gradient-bg-transactions flex min-h-screen flex-col items-center justify-center px-4 text-center text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-gray-300">Page not found.</p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Back to login
      </Link>
    </div>
  )
}

export default NotFound
