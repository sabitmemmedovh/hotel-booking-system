import React, { useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { countries, boardTypes } from '../data/data';
import Select from './Select';
import { useSelector, useDispatch } from 'react-redux';
import { setConfig, reset, selectBookingConfig } from '../features/bookingSlice';
import { bookingConfigSchema } from '../utils/validation';

const BookingForm = () => {
    const config = useSelector(selectBookingConfig);
    const dispatch = useDispatch();
    const {
        control,
        formState: { errors },
        reset: resetForm,
        watch,
    } = useForm({
        resolver: yupResolver(bookingConfigSchema),
        mode: 'onChange',
        defaultValues: config,
    });
    useEffect(() => {
        const subscription = watch((data) => {
            const updated = {
                citizenship: data.citizenship || '',
                startDate: data.startDate || '',
                days: data.days ? Number(data.days) : '',
                destination: data.destination || '',
                boardType: data.boardType || 'FB',
            };
            dispatch(setConfig(updated));
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);
    const handleReset = useCallback(() => {
        dispatch(reset());
        resetForm({
            citizenship: '',
            startDate: '',
            days: '',
            destination: '',
            boardType: 'FB',
        });
    }, [dispatch, resetForm]);
    return (
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Citizenship</label>
                <Controller
                    name="citizenship"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={countries.map(c => ({ id: c.name, label: c.name }))}
                            placeholder="Select your country"
                            className={`w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition ${errors.citizenship
                                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                : 'border-slate-300 focus:ring-sky-500'
                                }`}
                        />
                    )}
                />
                {errors.citizenship && <p className="text-xs text-red-600 mt-1">⚠ {errors.citizenship.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="date"
                                className={`w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition ${errors.startDate
                                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                    : 'border-slate-300 focus:ring-sky-500'
                                    }`}
                            />
                        )}
                    />
                    {errors.startDate && <p className="text-xs text-red-600 mt-1">⚠ {errors.startDate.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Days</label>
                    <Controller
                        name="days"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="number"
                                placeholder="Between 1-30"
                                className={`w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition ${errors.days
                                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                    : 'border-slate-300 focus:ring-sky-500'
                                    }`}
                            />
                        )}
                    />
                    {errors.days && <p className="text-xs text-red-600 mt-1">⚠ {errors.days.message}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                <Controller
                    name="destination"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            options={countries.map(c => ({ id: c.name, label: c.name }))}
                            placeholder="Select destination"
                            className={`w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition ${errors.destination
                                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                : 'border-slate-300 focus:ring-sky-500'
                                }`}
                        />
                    )}
                />
                {errors.destination && <p className="text-xs text-red-600 mt-1">⚠ {errors.destination.message}</p>}
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Board Type</label>
                <Controller
                    name="boardType"
                    control={control}
                    render={({ field }) => (
                        <div className="space-y-2">
                            {boardTypes.map(board => (
                                <label
                                    key={board.code}
                                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded transition"
                                >
                                    <input
                                        type="radio"
                                        value={board.code}
                                        checked={field.value === board.code}
                                        onChange={() => field.onChange(board.code)}
                                        className="w-4 h-4 accent-sky-600"
                                    />
                                    <span className="text-sm text-slate-700 font-medium">{board.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                />
                {errors.boardType && <p className="text-xs text-red-600 mt-2">⚠ {errors.boardType.message}</p>}
            </div>
            <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition"
            >
                Reset Form
            </button>
        </form>
    )
}

export default BookingForm
