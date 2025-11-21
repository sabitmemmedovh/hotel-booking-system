import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
     <main className="container py-12">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold mb-2">404 — Not Found</h1>
        <p className="text-slate-600 mb-4">The page you requested does not exist.</p>
        <Link to="/" className="text-sky-600">Go back home</Link>
      </div>
    </main>
  )
}

export default NotFound
