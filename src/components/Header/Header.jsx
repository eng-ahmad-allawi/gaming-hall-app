import { useContext } from 'react';
import RateInput from './RateInput';
import RateDisplay from './RateDisplay';
import { RateContext } from '../../context/RateContext';

const Header = () => {
  const { hourlyRate } = useContext(RateContext);

  return (
    <header className="main-header">
      <div className="container">
        <div className="logo">صالة الألعاب</div>
        <div id="rate-section">
          {!hourlyRate ? <RateInput /> : <RateDisplay />}
        </div>
      </div>
    </header>
  );
};

export default Header;
