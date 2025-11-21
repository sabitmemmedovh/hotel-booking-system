import React, { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDailySelections, selectBookingConfig, setDay } from '../features/bookingSlice';
import { getHotels, getMeals, getHBMealBlocker } from '../utils/dataLookup';
import { calculateDayTotal } from '../utils/priceCalculation';
import Select from './Select';
import { formatCurrency } from '../utils/formatters';
import { formatHumanDate } from '../utils/dateUtils';

const DailyTable = () => {
  const dispatch = useDispatch();
  const config = useSelector(selectBookingConfig);
  const dailySelections = useSelector(selectDailySelections);

  const hotelList = useMemo(
    () => getHotels(config.destination),
    [config.destination]
  );
  const mealOptions = useMemo(
    () => getMeals(config.destination),
    [config.destination]
  );
  const handleDayChange = useCallback(
    (dayIndex, fieldName, value) => {
      dispatch(setDay({
        index: dayIndex,
        changes: { [fieldName]: value ? Number(value) : null },
      }));
    },
    [dispatch]
  );
  if (!dailySelections?.length) {
    return (
      <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <p className="font-medium">No days configured yet</p>
        <p className="text-xs mt-1">Set start date and days above to begin</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-200">
            <th className="px-4 py-3 font-semibold text-slate-700 text-left">Date</th>
            <th className="px-4 py-3 font-semibold text-slate-700 text-left">Hotel</th>
            <th className="px-4 py-3 font-semibold text-slate-700 text-left">Lunch</th>
            <th className="px-4 py-3 font-semibold text-slate-700 text-left">Dinner</th>
            <th className="px-4 py-3 font-semibold text-slate-700 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {dailySelections.map((day, dayIndex) => {
            const dayTotal = calculateDayTotal(day, config.destination);
            const isMealDisabledForBoard = config.boardType === 'NB';
            const isLunchDisabledByHB = config.boardType === 'HB' && getHBMealBlocker(day.lunchId, day.dinnerId) === 'lunch';
            const isDinnerDisabledByHB = config.boardType === 'HB' && getHBMealBlocker(day.lunchId, day.dinnerId) === 'dinner';

            return (
              <tr key={`day-${dayIndex}`} className="border-t hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                  {formatHumanDate(day.date)}
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={day.hotelId || ''}
                    onChange={e => handleDayChange(dayIndex, 'hotelId', e.target.value)}
                    options={hotelList.map(h => ({ id: h.id, label: `${h.name} (${formatCurrency(h.price)})` }))}
                    placeholder="Select hotel"
                  />
                </td>
                <td className="px-4 py-3">
                  {isMealDisabledForBoard ? (
                    <div className="text-slate-500 italic text-sm">N/A</div>
                  ) : (
                    <Select
                      value={day.lunchId || ''}
                      onChange={e => handleDayChange(dayIndex, 'lunchId', e.target.value)}
                      disabled={isLunchDisabledByHB}
                      options={mealOptions.lunch.map(m => ({ id: m.id, label: `${m.name} (${formatCurrency(m.price)})` }))}
                      placeholder="No lunch"
                    />
                  )}
                </td>
                <td className="px-4 py-3">
                  {isMealDisabledForBoard ? (
                    <div className="text-slate-500 italic text-sm">N/A</div>
                  ) : (
                    <Select
                      value={day.dinnerId || ''}
                      onChange={e => handleDayChange(dayIndex, 'dinnerId', e.target.value)}
                      disabled={isDinnerDisabledByHB}
                      options={mealOptions.dinner.map(m => ({ id: m.id, label: `${m.name} (${formatCurrency(m.price)})` }))}
                      placeholder="No dinner"
                    />
                  )}
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">
                  {formatCurrency(dayTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default DailyTable;