import PropTypes from 'prop-types';

const Card = ({
    title,
    children,
    actions,
    className = '',
    headerClassName = '',
    bodyClassName = ''
}) => {
    return (
        <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
            {title && (
                <div className={`px-4 py-5 sm:px-6 border-b border-gray-200 ${headerClassName}`}>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                </div>
            )}
            <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>
                {children}
            </div>
            {actions && (
                <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                    {actions}
                </div>
            )}
        </div>
    );
};

Card.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    actions: PropTypes.node,
    className: PropTypes.string,
    headerClassName: PropTypes.string,
    bodyClassName: PropTypes.string,
};

export default Card;