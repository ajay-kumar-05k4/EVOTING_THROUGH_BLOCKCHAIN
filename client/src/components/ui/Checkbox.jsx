import PropTypes from 'prop-types';

export const Checkbox = ({ checked, onCheckedChange, className }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={className}
    />
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onCheckedChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

