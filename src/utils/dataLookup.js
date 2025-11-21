
import { hotels, meals, boardTypes } from '../data/data';



export function getHotels(destination) {
  return hotels[destination] || [];
}

export function getMeals(destination) {
  return meals[destination] || { lunch: [], dinner: [] };
}


export function findHotel(destination, hotelId) {
  if (!hotelId) return null;
  const list = getHotels(destination);
  return list.find(h => h.id === hotelId) || null;
}


export function findMeal(destination, type, mealId) {
  if (!mealId) return null;
  const list = getMeals(destination)[type] || [];
  return list.find(m => m.id === mealId) || null;
}


export function getHBMealBlocker(lunchId, dinnerId) {
  if (lunchId && !dinnerId) return 'dinner';  
  if (dinnerId && !lunchId) return 'lunch';  
  return null; 
}


export function validateMealSelection(boardType, lunchId, dinnerId) {
  if (boardType === 'NB') {
    return { lunchId: null, dinnerId: null };
  }

  if (boardType === 'HB') {
    if (lunchId && dinnerId) {
      return { lunchId, dinnerId: null };
    }
  }

  return { lunchId, dinnerId };
}
