
export function useBookingSave(booking, statusRef, setSavedBreakdowns) {
  const saveBooking = (callback) => {
    try {
      const { dailySelections, destination } = booking || {};

      const hasSelections = Array.isArray(dailySelections) && dailySelections.some(d => (
        d && (d.hotelId || d.lunchId || d.dinnerId)
      ));

      if (!hasSelections) {
        if (statusRef?.current) statusRef.current.textContent = 'Save failed: no daily selections to save.';
        return;
      }

     
      localStorage.setItem('hb_booking', JSON.stringify(booking));

      
      const full = generatePriceBreakdown(dailySelections, destination || booking.destination);
      const items = Array.isArray(full.items) ? full.items : [];

      const entry = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        destination: destination || booking.destination || '',
        items,
        grand: full.grand || 0,
      };

      
      const raw = localStorage.getItem('hb_saved_breakdowns');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(entry);
      localStorage.setItem('hb_saved_breakdowns', JSON.stringify(arr));


      setSavedBreakdowns(arr);
      if (statusRef?.current) statusRef.current.textContent = 'Booking and breakdown saved locally.';

      if (callback) callback(arr);
    } catch (e) {
      if (statusRef?.current) statusRef.current.textContent = 'Save failed: ' + (e.message || 'unknown error');
    }
  };

  return { saveBooking };
}

import { generatePriceBreakdown } from '../utils/priceCalculation';
