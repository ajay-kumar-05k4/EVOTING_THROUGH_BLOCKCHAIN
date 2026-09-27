import PropTypes from 'prop-types';
import clsx from 'clsx';

export const Card = ({ children, className }) => {
  return (
    <div className={clsx("shadow-md rounded-2xl p-4", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

