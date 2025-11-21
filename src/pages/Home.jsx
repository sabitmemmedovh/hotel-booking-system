import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <main className="container py-12">
            <div className="bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">Welcome to the Hotel Booking Demo</h1>
                <p className="text-slate-600 mb-6">Create a booking with daily meal selection rules and price calculation.</p>
                <Link to="/booking" className="inline-block bg-sky-600 text-white px-4 py-2 rounded">Start Booking</Link>
            </div>
        </main>
    )
}

export default Home
