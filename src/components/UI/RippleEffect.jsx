import { useEffect } from 'react';
import styles from './UI.module.css';

const RippleEffect = () => {
  useEffect(() => {
    const buttons = document.querySelectorAll('.ripple-trigger');
    
    const createRipple = (event) => {
      const button = event.currentTarget;
      
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      
      const rect = button.getBoundingClientRect();
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - radius}px`;
      circle.style.top = `${event.clientY - rect.top - radius}px`;
      circle.classList.add(styles.ripple);
      
      const ripple = button.querySelector(`.${styles.ripple}`);
      if (ripple) {
        ripple.remove();
      }
      
      button.appendChild(circle);
      
      // Remove the ripple after animation completes
      setTimeout(() => {
        if (circle.parentElement === button) {
          button.removeChild(circle);
        }
      }, 600); // Match animation duration
    };
    
    buttons.forEach(button => {
      button.addEventListener('click', createRipple);
    });
    
    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', createRipple);
      });
    };
  }, []);
  
  return null;
};

export default RippleEffect;
