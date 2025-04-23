import styles from './UI.module.css';

const Button = ({ 
  children, 
  onClick, 
  className, 
  disabled = false, 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${className} ripple-trigger`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
