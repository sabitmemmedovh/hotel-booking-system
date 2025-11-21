import React, { forwardRef } from 'react';


const Select = forwardRef(function Select(
  { value, onChange, disabled, options = [], placeholder = 'Select', className = '', name },
  ref
) {
  return (
    <select
      name={name}
      value={value ?? ''}
      onChange={onChange}
      disabled={disabled}
      ref={ref} 
      className={
        className ||
        'w-full px-2 py-1.5 rounded border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500'
      }
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id ?? opt.value} value={opt.id ?? opt.value}>
          {opt.label ?? opt.name ?? String(opt)}
        </option>
      ))}
    </select>
  );
});

export default Select;
