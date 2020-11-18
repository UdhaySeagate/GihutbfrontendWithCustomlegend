import React from 'react';
import card1 from '../../assets/error.png';

const CardError = ({ errorMessage }) => {
  return (
    <div className="carderror">
      <div className="errorAlign">
        <img src={card1} width="24px" alt="Percentage" />
      </div>
      <div className="errorAlign text errorFont ">{errorMessage}</div>
    </div>
  );
};

export default CardError;
