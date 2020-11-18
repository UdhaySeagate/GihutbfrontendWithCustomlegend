import React from 'react';
import card1 from '../../assets/error.png';

const TotalActionError = ({ errorMessage }) => {
  return (
    <div className="totalActionError">
      <div className="errorAlign">
        <img src={card1} width="24px" alt="Percentage" />
      </div>
      <div className="errorAlign text errorFont ">{errorMessage}</div>
    </div>
  );
};

export default TotalActionError;
