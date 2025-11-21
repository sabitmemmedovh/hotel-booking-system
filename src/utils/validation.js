import * as Yup from 'yup';
import { parseDate } from './dateUtils';

export const bookingConfigSchema = Yup.object().shape({
  citizenship: Yup.string().required('Citizenship required'),
  startDate: Yup.string()
    .required('Start date required')
    .test('valid-date', 'Invalid date format', (value) => {
      if (!value) return false;
      const date = parseDate(value);
      return date instanceof Date && date.getFullYear() > 2000;
    }),
  days: Yup.number()
    .required('Days required')
    .typeError('Must be a number')
    .min(1, 'Minimum 1 day')
    .max(30, 'Maximum 30 days')
    .transform(value => {
      if (value === '' || value === null) return NaN;
      return Number(value);
    }),
  destination: Yup.string().required('Destination required'),
  boardType: Yup.string()
    .required('Board type required')
    .oneOf(['FB', 'HB', 'NB']),
});

export async function validateConfig(config) {
  try {
    await bookingConfigSchema.validate(config);
    return { isValid: true, errors: {} };
  } catch (err) {
    const errors = {};
    if (err && err.inner) {
      err.inner.forEach(fieldError => {
        errors[fieldError.path] = fieldError.message;
      });
    }
    return { isValid: false, errors };
  }
}

export function isConfigComplete(config) {
  if (!config) return false;
  const days = Number(config.days) || 0;
  return Boolean(
    config.citizenship &&
    config.startDate &&
    days > 0 &&
    config.destination &&
    ['FB', 'HB', 'NB'].includes(config.boardType)
  );
}

export function sanitizeConfig(config) {
  if (!config || typeof config !== 'object') config = {};
  return {
    citizenship: config.citizenship || '',
    startDate: config.startDate || '',
    days: Number(config.days) || 0,
    destination: config.destination || '',
    boardType: config.boardType || 'FB',
  };
}
