import React from 'react';
import './App.css';
import Home from './pages/Home';
import Header from './components/Header';
import BookingPage from './pages/BookingPage';
import NotFound from './pages/NotFound';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
