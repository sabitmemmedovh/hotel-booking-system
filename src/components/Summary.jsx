import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectBookingConfig, selectDailySelections } from '../features/bookingSlice';
import { generatePriceBreakdown } from '../utils/priceCalculation';
import { formatHumanDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const Summary = () => {
    const config = useSelector(selectBookingConfig) || {};
    const dailySelections = useSelector(selectDailySelections);
    const breakdown = useMemo(() => {
        try {
            const ds = dailySelections || [];
            return generatePriceBreakdown(ds, config.destination);
        } catch (e) {
            return { items: [], grand: 0 };
        }
    }, [dailySelections, config.destination]);
    return (
        <section id="summary-root" className="space-y-4" aria-label="Booking summary">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Configuration</h3>
                {config.citizenship && (
                    <div className="flex justify-between items-center text-sm" role="row">
                        <span className="text-slate-600 font-medium">Citizenship</span>
                        <span className="text-slate-900 font-semibold">{config.citizenship}</span>
                    </div>
                )}
                {config.startDate && (
                    <div className="flex justify-between items-center text-sm" role="row">
                        <span className="text-slate-600 font-medium">Departure</span>
                        <span className="text-slate-900 font-semibold">{formatHumanDate(config.startDate)}</span>
                    </div>
                )}
                {config.days && (
                    <div className="flex justify-between items-center text-sm" role="row">
                        <span className="text-slate-600 font-medium">Duration</span>
                        <span className="text-slate-900 font-semibold">{config.days} day{config.days > 1 ? 's' : ''}</span>
                    </div>
                )}
                {config.destination && (
                    <div className="flex justify-between items-center text-sm" role="row">
                        <span className="text-slate-600 font-medium">Destination</span>
                        <span className="text-slate-900 font-semibold">{config.destination}</span>
                    </div>
                )}
                {config.boardType && (
                    <div className="flex justify-between items-center text-sm" role="row">
                        <span className="text-slate-600 font-medium">Board Type</span>
                        <span className="text-slate-900 font-semibold">{config.boardType}</span>
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Daily Details</h3>
                {breakdown.items.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 italic text-sm">No selections yet</div>
                ) : (
                    <div className="space-y-2">
                        {breakdown.items.map((item, idx) => (
                            <article key={item.date || idx} className="bg-slate-50 rounded p-3 border border-slate-200" aria-labelledby={`day-${item.date}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 id={`day-${item.date}`} className="text-sm font-semibold text-slate-800">
                                        {formatHumanDate(item.date)}
                                    </h4>
                                    <div className="text-lg font-bold text-slate-900">{formatCurrency(item.total)}</div>
                                </div>
                                <div className="space-y-1 text-xs text-slate-600">
                                    {item.hotel ? (
                                        <div className="flex justify-between items-center pl-2 border-l-2 border-slate-300">
                                            <div className="text-slate-600">Hotel</div>
                                            <div className="text-slate-700 font-medium">{item.hotel}</div>
                                            <div className="text-right w-16 font-semibold">{formatCurrency(item.hotelPrice)}</div>
                                        </div>
                                    ) : null}
                                    {item.lunch ? (
                                        <div className="flex justify-between items-center pl-2 border-l-2 border-slate-300">
                                            <div className="text-slate-600">Lunch</div>
                                            <div className="text-slate-700 font-medium">{item.lunch}</div>
                                            <div className="text-right w-16 font-semibold">{formatCurrency(item.lunchPrice)}</div>
                                        </div>
                                    ) : null}
                                    {item.dinner ? (
                                        <div className="flex justify-between items-center pl-2 border-l-2 border-slate-300">
                                            <div className="text-slate-600">Dinner</div>
                                            <div className="text-slate-700 font-medium">{item.dinner}</div>
                                            <div className="text-right w-16 font-semibold">{formatCurrency(item.dinnerPrice)}</div>
                                        </div>
                                    ) : null}
                                    {!item.hotel && !item.lunch && !item.dinner ? (
                                        <div className="text-slate-400 italic">No selections</div>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
            <div className="  border-2 border-sky-200 rounded-lg p-4 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Grand Total</span>
                <span className="text-3xl font-bold text-sky-700">{formatCurrency(breakdown.grand || 0)}</span>
            </div>
        </section>
    );
}

export default Summary;