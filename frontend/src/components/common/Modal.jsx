import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'sm' }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            setIsVisible(true);
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Match this with transition duration
    };
    const sizes = {
        // Standard sizes (same as before)
        sm: 'w-full max-w-md',      // 448px (28rem)
        md: 'w-full max-w-2xl',     // 672px (42rem)
        lg: 'w-full max-w-4xl',     // 896px (56rem)
        xl: 'w-full max-w-6xl',     // 1152px (72rem)

        // Extra wide sizes
        '2xl': 'w-full max-w-7xl',  // 1280px (80rem)
        '3xl': 'w-full max-w-8xl',  // 1440px (90rem)
        '4xl': 'w-full max-w-9xl',  // 1600px (100rem)
        '5xl': 'w-full max-w-[1800px]', // Custom 1800px

        // Reduced height variations (same widths but with height constraints)
        'sm-h': 'w-full max-w-md max-h-[80vh]',
        'md-h': 'w-full max-w-2xl max-h-[80vh]',
        'lg-h': 'w-full max-w-4xl max-h-[80vh]',
        'xl-h': 'w-full max-w-6xl max-h-[80vh]',
        '2xl-h': 'w-full max-w-7xl max-h-[80vh]',

        // Ultra-wide with scrollable content
        'full-h': 'w-full max-w-[95vw] max-h-[90vh] overflow-y-auto',

        // Square-ish variations
        'square-sm': 'w-full max-w-md max-h-md aspect-square',
        'square-md': 'w-full max-w-xl max-h-xl aspect-square',

        // Custom combinations
        'wide-short': 'w-full max-w-7xl max-h-[60vh]',
        'narrow-tall': 'w-full max-w-md max-h-[90vh]',

        // Full screen with margins
        'full-margin': 'w-full max-w-[95vw] max-h-[95vh] m-4',

        // Viewport percentage sizes
        'vw-80': 'w-[80vw] max-w-[80vw]',
        'vw-90': 'w-[90vw] max-w-[90vw]',
        'vw-95': 'w-[95vw] max-w-[95vw]',
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay with fade animation */}
            <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isVisible ? 'opacity-80' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />

            {/* Modal container with scale and fade animation */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className={`relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-2xl ${sizes[size]
                        } w-full border-4 border-transparent bg-clip-padding 
          before:content-[''] before:absolute before:inset-0 before:z-[-1] before:m-[-4px] 
          before:rounded-xl before:bg-gradient-to-r before:from-blue-500 before:to-purple-600
          transition-all duration-300 ease-out ${isVisible
                            ? 'opacity-100 scale-100 translate-y-0'
                            : 'opacity-0 scale-95 translate-y-4'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with gradient background */}
                    <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-white">{title}</h3>
                            <button
                                onClick={handleClose}
                                className="text-white hover:text-blue-200 transition-colors duration-200"
                                aria-label="Close modal"
                            >
                                <svg
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="p-6 bg-white/90 rounded-b-lg text-gray-900">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};

export default Modal;