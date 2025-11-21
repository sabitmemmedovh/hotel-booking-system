import React from 'react'
import { Link } from 'react-router-dom';
const Header = () => {
  return (
      <header className="bg-white shadow-sm">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Hotel Booking</Link>
        <nav className="space-x-4">
          <Link to="/" className="text-slate-600 hover:text-slate-900">Home</Link>
          <Link to="/booking" className="text-slate-600 hover:text-slate-900">Booking</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
