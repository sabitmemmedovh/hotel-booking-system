
import { findHotel, findMeal } from './dataLookup';


export function calculateDayTotal(day, destination) {
  if (!day || !destination) return 0;
  const hotel = findHotel(destination, day.hotelId);
  const lunch = findMeal(destination, 'lunch', day.lunchId);
  const dinner = findMeal(destination, 'dinner', day.dinnerId);

  const hotelPrice = (hotel && typeof hotel.price === 'number') ? hotel.price : 0;
  const lunchPrice = (lunch && typeof lunch.price === 'number') ? lunch.price : 0;
  const dinnerPrice = (dinner && typeof dinner.price === 'number') ? dinner.price : 0;

  return hotelPrice + lunchPrice + dinnerPrice;
}


export function calculateGrandTotal(dailySelections, destination) {
  if (!Array.isArray(dailySelections)) return 0;
  return dailySelections.reduce((sum, d) => sum + calculateDayTotal(d, destination), 0);
}


export function generatePriceBreakdown(dailySelections, destination) {
  if (!Array.isArray(dailySelections) || !destination) return { items: [], grand: 0 };
  const items = dailySelections.map(d => {
    const hotel = findHotel(destination, d.hotelId);
    const lunch = findMeal(destination, 'lunch', d.lunchId);
    const dinner = findMeal(destination, 'dinner', d.dinnerId);
    const total = calculateDayTotal(d, destination);
    return {
      date: d.date,
      hotel: hotel ? hotel.name : null,
      hotelPrice: hotel ? hotel.price : 0,
      lunch: lunch ? lunch.name : null,
      lunchPrice: lunch ? lunch.price : 0,
      dinner: dinner ? dinner.name : null,
      dinnerPrice: dinner ? dinner.price : 0,
      total,
    };
  });
  const grand = items.reduce((sum, it) => sum + (it.total || 0), 0);
  return { items, grand };
}

