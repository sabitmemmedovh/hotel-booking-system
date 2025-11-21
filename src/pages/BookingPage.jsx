
import React, { useState, useEffect, useRef } from 'react';
import BookingForm from '../components/BookingForm';
import DailyTable from '../components/DailyTable';
import Summary from '../components/Summary';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { selectIsConfigComplete, selectBooking } from '../features/bookingSlice';
import { useBookingSave } from '../hooks/useBookingSave';
import { useSavedBreakdownsPDF } from '../hooks/useSavedBreakdownsPDF';
import { formatHumanDate } from '../utils/dateUtils';
import { loadBooking } from '../features/bookingSlice';
import { useDispatch } from 'react-redux';



const BookingPage = () => {
    const dispatch = useDispatch();


    const isConfigComplete = useSelector(selectIsConfigComplete);
    const booking = useSelector(selectBooking);

    const [ready, setReady] = useState(false);
    const [opStatus, setOpStatus] = useState('');
    const [exporting, setExporting] = useState(false);
    const [savedBreakdowns, setSavedBreakdowns] = useState([]);
    const statusRef = useRef(null);

    const { saveBooking } = useBookingSave(booking, statusRef, setSavedBreakdowns);
    const { exportBreakdownPDF, deleteBreakdown } = useSavedBreakdownsPDF(setOpStatus, setExporting, setSavedBreakdowns, savedBreakdowns);

    useEffect(() => {
    try {
        const raw = localStorage.getItem('hb_saved_breakdowns');
        if (raw) {
            const parsed = JSON.parse(raw);
            setSavedBreakdowns(Array.isArray(parsed) ? parsed : []);
        }

        const savedBooking = localStorage.getItem('hb_booking');
        if (savedBooking) {
            const parsedBooking = JSON.parse(savedBooking);
            dispatch(loadBooking(parsedBooking));
        }

    } catch (err) {
        console.error("Failed to load local data", err);
    }

    setReady(true);
}, []);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('hb_saved_breakdowns');
            if (raw) {
                const parsed = JSON.parse(raw);
                console.log('Loaded breakdowns:', parsed);
                setSavedBreakdowns(Array.isArray(parsed) ? parsed : []);
            }
        } catch (e) {
            console.error('Failed to parse breakdowns', e);
        }
        setReady(true);
    }, []);

    if (!ready) return <Loading message="Loading booking system..." />;

    return (
        <main className="container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">1. Configuration</h2>
                        <BookingForm />
                    </div>

                    {isConfigComplete && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4">2. Daily Configuration</h2>
                            <DailyTable />
                        </div>
                    )}
                </div>

                <aside>
                    <div className="bg-white p-6 rounded-lg shadow sticky top-6">
                        <h2 className="text-lg font-semibold mb-4">3. Summary & Price</h2>

                        <Summary />

                        <div className="mt-4 space-y-2">
                            <button
                                className="w-full px-3 py-2 bg-sky-600 text-white rounded text-sm font-medium hover:bg-sky-700 transition"
                                onClick={() => saveBooking()}
                            >
                                Save Booking
                            </button>

                            {opStatus && (
                                <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                                    {opStatus}
                                </div>
                            )}

                            <div ref={statusRef} style={{ display: 'none' }} />

                            <div className="mt-6 border-t pt-4">
                                <h4 className="text-sm font-semibold mb-3">Saved Breakdowns</h4>

                                {savedBreakdowns.length === 0 ? (
                                    <div className="text-xs text-slate-500 italic">No saved breakdowns</div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {savedBreakdowns.map((sb) => (
                                            <div key={sb.id} className="bg-slate-50 p-3 rounded border border-slate-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="text-sm font-medium text-slate-700">
                                                        {new Date(sb.createdAt).toLocaleString()}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="px-2 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700 transition disabled:opacity-50"
                                                            onClick={() => exportBreakdownPDF(sb)}
                                                            disabled={exporting}
                                                        >
                                                            Export
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs border border-red-300 hover:bg-red-200 transition"
                                                            onClick={() => deleteBreakdown(sb.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="text-xs text-slate-600 space-y-1">
                                                    <div className="font-semibold text-slate-800 mb-1">{sb.destination}</div>
                                                    {sb.items.map((it, i) => (
                                                        <div key={i} className="flex justify-between text-slate-700">
                                                            <span>{formatHumanDate(it.date)}</span>
                                                            <span>
                                                                {it.hotel ? `${it.hotel} ` : ''}{it.lunch ? `+ Lunch ` : ''}{it.dinner ? `+ Dinner ` : ''}
                                                                <strong>${it.total}</strong>
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <div className="border-t pt-1 font-bold text-slate-900">
                                                        Grand: ${sb.grand || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    )
}

export default BookingPage
