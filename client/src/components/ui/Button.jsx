import PropTypes from 'prop-types';
import clsx from 'clsx';

export const Button = ({ children, onClick, variant = 'default', className }) => {
  const styles = clsx(
    "px-4 py-2 rounded-2xl font-semibold focus:outline-none",
    {
      'bg-blue-500 text-white hover:bg-blue-600': variant === 'default',
      'bg-gray-200 text-white hover:bg-[#212124]': variant === 'ghost',
      'bg-white text-black hover:bg-[#fafafae6]': variant === 'confirm',
    },
    className
  );

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'ghost', 'confirm']),
  className: PropTypes.string,
};

