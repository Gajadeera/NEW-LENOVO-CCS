import PropTypes from 'prop-types';
import { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline'; // Updated import path
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({
    label,
    selected,
    onChange,
    minDate,
    maxDate,
    placeholderText = 'Select date',
    className = '',
    disabled = false,
    error = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <ReactDatePicker
                    selected={selected}
                    onChange={(date) => {
                        onChange(date);
                        setIsOpen(false);
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText={placeholderText}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 pr-3 py-2 ${error ? 'border-red-500' : 'border'
                        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={disabled}
                    open={isOpen}
                    onInputClick={() => setIsOpen(true)}
                    onClickOutside={() => setIsOpen(false)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

DatePicker.propTypes = {
    label: PropTypes.string,
    selected: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    placeholderText: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
};

export default DatePicker;