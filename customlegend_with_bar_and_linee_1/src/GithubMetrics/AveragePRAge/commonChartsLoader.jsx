import React from 'react';
import { Line } from 'rc-progress';
import chartloader from '../../assets/Chart-Loading.png';

const CommonChartLoader = () => {
  return (
    <div className="chartLoder">
      <div>
        <img src={chartloader} alt="Paris" width="300" height="232" />
      </div>

      <div className="progressBar">
        <Line percent="70" strokeWidth="2" strokeColor="#2F80ED" />
        <span className="plstext">Please Wait ...</span>
        <br />
      </div>
    </div>
  );
};
export default CommonChartLoader;
