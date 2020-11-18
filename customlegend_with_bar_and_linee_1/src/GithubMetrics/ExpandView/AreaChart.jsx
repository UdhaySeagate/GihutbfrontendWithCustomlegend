import React from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import moment from 'moment';

const AreaChart = ({ dataPass }) => {
  const data = {
    x: 'x',
    columns: [['x', ...dataPass.datePush], ...dataPass.repoNameData],
    type: 'area'
    // ,
    // colors:dataPass.colorsData
  };

  const size = {
    height: 360
  };

  const padding = {
    top: 20,
    right: 20,
    bottom: 20
  };

  const axis = {
    y: {
      label: {
        text: 'Counts',
        position: 'outer-middle'
      },
      type: 'category'
    },
    x: {
      tick: {
        format(e, d) {
          // const date = new Date(stateVal.dates[e] * 1000);
          // return date.toDateString().substring(3);
          return moment(dataPass.datePush[e]).format('DD MMM');
        }
        // format: '%e %b'
      },
      label: {
        text: 'Date Range',
        position: 'outer-center'
      },
      type: 'category'
    }
  };

  return (
    <div className="">
      <C3Chart data={data} axis={axis} size={size} padding={padding} />
    </div>
  );
};

export default AreaChart;
