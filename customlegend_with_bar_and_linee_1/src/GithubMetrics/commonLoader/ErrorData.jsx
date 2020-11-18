import React from 'react';
import card1 from '../../assets/error.png';

const ErrorData = ({ errorMessage }) => {
  return (
    <div className="loaderDiv">
      <div className="errorAlign">
        <img src={card1} height="100%" alt="Percentage" />
      </div>
      <div className="messagePadd">{errorMessage}</div>
    </div>
  );
};

export default ErrorData;
