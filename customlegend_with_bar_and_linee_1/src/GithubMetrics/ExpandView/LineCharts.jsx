/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import * as c3 from "c3";
import 'c3/c3.css';
import * as d3 from 'd3';
import moment from 'moment';

const LineCharts = ({ dataPass }) => {
  const labArr = [...dataPass.repoNameData];
  const labarrinst = [];
  labArr.forEach(data => {
    labarrinst.push(data[0]);
  });
  useEffect(() => {
    const chart = c3.generate({
      bindto: '#d',
      data: {
        x: 'x',
        columns: [['x', ...dataPass.datePush], ...dataPass.repoNameData],
        type: 'line',
        colors:dataPass.colorsData
      },
      size: {
        height: 320
      },
      axis: {
        y: {
          label: {
            text: 'Counts',
            position: 'outer-middle'
          },
          tick: {
            format(d) {
              return Math.round((d + Number.EPSILON) * 100) / 100;
            }
          },
          type: 'category'
        },
        x: {
          tick: {
            format(e, d) {
              if(dataPass.headerType === 'Downloads'){
                return dataPass.datePush[e];
                }
                return dataPass.typeYear === ''
                  ? moment(dataPass.datePush[e]).format('DD MMM')
                  : dataPass.typeYear === 'MONTH'
                  ? moment(dataPass.datePush[e]).format('MMM YYYY')
                  : moment(dataPass.datePush[e]).format('YYYY');
              }
            // format: '%e %b'
          },
          label: {
            text: 'Date Range',
            position: 'outer-center'
          },
          type: 'category'
        }
      },
      padding: {
        right: 20,
        bottom: 20,
        top: 20
      },
      legend: {
          show: false
      },
      onrendered: () => {
        // d3.select here
        // console.log('C3Chart', chart);
        
      }
    });
      d3.select('.plot').insert('div', '.legendss').attr('class', 'legendss').selectAll('button')
      .data([...labarrinst])
      .enter().append('button')
      .attr('data-id', (id) => {
        return id;
      })
      .html( (id) => {
        return id;
      })
      .on('mouseover', (id) => {
        chart.focus(id);
        const element = document.querySelectorAll(`.legendss > button`);
        const elementfade = document.querySelectorAll(`.legendss > button.mystyle`);
        const arrVall = [];
        elementfade.forEach(data => {
          arrVall.push(data.getAttribute('data-id'));
        });
        if (arrVall.indexOf(id) < 0) {
          element.forEach(ele => {
            if(ele.getAttribute('data-id') !== id) {
              ele.classList.add("fadecolor");
            }          
          });
        }
      })
      .on('mouseout', (id) => {
        chart.revert();
        const element = document.querySelectorAll(`.legendss > button`);
        element.forEach(ele => {
            ele.classList.remove("fadecolor");
        });
      })
      .on('click', (id) => {
        chart.toggle(id);
        const element = document.querySelector(`button[data-id='${id}']`);
        element.classList.toggle("mystyle");
        const element1 = document.querySelectorAll(`.legendss > button`);
        element1.forEach(ele => {
            ele.classList.remove("fadecolor");
        });
      }).append('span')
      .each((id) => {
          d3.select(`button[data-id='${id}'] > span`).style('background-color', chart.color(id));
      });
  }, []);


  return (
    <div className="">
      <div className='plot'>
        <div id='d' />
      </div>
    </div>
  );
};

export default LineCharts;
