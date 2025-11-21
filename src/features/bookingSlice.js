import { createSelector } from 'reselect';
import { createSlice } from '@reduxjs/toolkit';
import { generateDateRange } from '../utils/dateUtils';
import { validateMealSelection } from '../utils/dataLookup';
import { sanitizeConfig } from '../utils/validation';
const initialState = {
  citizenship: '',
  startDate: '',
  days: 0,
  destination: '',
  boardType: 'FB',
  dailySelections: [],
};

function createDailySelections(startDate, days) {
  const n = Number(days) || 0;
  if (n <= 0) return [];
  const dates = generateDateRange(startDate, n);
  return dates.map((date) => ({
    date,
    hotelId: null,
    lunchId: null,
    dinnerId: null,
  }));
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
     setConfig(state, action) {
      const config = sanitizeConfig(action.payload);
      state.citizenship = config.citizenship;
      state.startDate = config.startDate;
      state.days = config.days; 
      state.destination = config.destination;
      state.boardType = config.boardType;

     
      state.dailySelections = createDailySelections(state.startDate, state.days);

     
      if (Array.isArray(state.dailySelections)) {
        state.dailySelections = state.dailySelections.map((d) => {
          const corrected = validateMealSelection(state.boardType, d.lunchId, d.dinnerId);
          return { ...d, lunchId: corrected.lunchId ?? null, dinnerId: corrected.dinnerId ?? null };
        });
      }
    },

  
    setDay(state, action) {
      const { index, changes } = action.payload || {};
      if (!Array.isArray(state.dailySelections)) return;
      if (!Number.isInteger(index) || index < 0 || index >= state.dailySelections.length) return;

      const day = state.dailySelections[index];
      const updatedDay = { ...day, ...changes };

      if ('lunchId' in changes || 'dinnerId' in changes) {
        const validated = validateMealSelection(state.boardType, updatedDay.lunchId, updatedDay.dinnerId);
        updatedDay.lunchId = validated.lunchId ?? null;
        updatedDay.dinnerId = validated.dinnerId ?? null;
      }

      state.dailySelections[index] = updatedDay;
    },

    reset() {
      return { ...initialState };
    },

    loadBooking(state, action) {
      const payload = action.payload || {};
      const config = sanitizeConfig(payload);

      state.citizenship = config.citizenship;
      state.startDate = config.startDate;
      state.days = config.days;
      state.destination = config.destination;
      state.boardType = config.boardType;

      if (Array.isArray(payload.dailySelections) && payload.dailySelections.length === Number(state.days)) {
        state.dailySelections = payload.dailySelections.map((d) => {
          const corrected = validateMealSelection(state.boardType, d.lunchId, d.dinnerId);
          return {
            date: d.date || null,
            hotelId: d.hotelId ?? null,
            lunchId: corrected.lunchId ?? null,
            dinnerId: corrected.dinnerId ?? null,
          };
        });
      } else {
        state.dailySelections = createDailySelections(state.startDate, state.days);
      }
    },
  },
});

export const { setConfig, setDay, reset, loadBooking } = bookingSlice.actions;




export const selectBooking = (state) => state.booking;

export const selectBookingConfig = createSelector(
  [selectBooking],
  (booking) => ({
    citizenship: booking.citizenship,
    startDate: booking.startDate,
    days: booking.days,
    destination: booking.destination,
    boardType: booking.boardType,
  })
);

export const selectDailySelections = (state) => state.booking.dailySelections;

export const selectIsConfigComplete = (state) => {
  const { citizenship, startDate, days, destination, boardType } = state.booking;
  return Boolean(citizenship && startDate && Number(days) > 0 && destination && boardType);
};

export default bookingSlice.reducer;
