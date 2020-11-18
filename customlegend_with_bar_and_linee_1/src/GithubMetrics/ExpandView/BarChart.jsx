/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import * as c3 from "c3";
import 'c3/c3.css';
import * as d3 from 'd3';
import moment from 'moment';
import './BarChart.css';

const BarChart = ({ dataPass }) => {
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
        type: 'bar',
        order:false,
        colors:dataPass.colorsData,
        groups: [[...dataPass.repoNameGroup]],
        labels: {
          format(v, id, i, j) {
            let retn;
            if (v === 0) {
              retn = '';
            } else {
              retn = v;
            }
            return retn;
          }
        }
      },
      size: {
        height: 320
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 20
      },
      legend: {
          show: false
      },
      bar: {
        width: {
          ratio: dataPass.repoNameData.length < 5 ? 0.1 : 0.3 // this makes bar width 50% of length between ticks
        },
        space:0
      },
      axis: {
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
              if(dataPass.headerType === 'Downloads'){
              return dataPass.datePush[e];
              }
              return dataPass.typeYear === ''
              ? moment(dataPass.datePush[e]).format('DD MMM')
              : dataPass.typeYear === 'MONTH'
              ? moment(dataPass.datePush[e]).format('MMM YYYY')
              : moment(dataPass.datePush[e]).format('YYYY');
            }
          },
          label: {
            text: dataPass.headerType === 'Downloads' ? 'Repository Name' : 'Date Range',
            position: 'outer-center'
          },
          type: 'category'
        }
      },
      onrendered: () => {
        dataPass.repoNameData.forEach((element,key) => {
          const selectorValue = document.querySelectorAll(`.chartDiv svg  .c3-chart-bar.c3-target:nth-of-type(${key+1}) >  .c3-shapes > path`);
          selectorValue.forEach((elementinner, innerkey) => {
            const ht1 = document.querySelector(`.chartDiv svg  .c3-chart-bar.c3-target:nth-of-type(${key+1}) > .c3-shapes > .c3-bar-${innerkey}`).getBBox();
            if (ht1.height < 15) {
              document.querySelector(`.chartDiv svg .c3-chart-texts  .c3-chart-text.c3-target:nth-of-type(${key+1}) > .c3-texts > .c3-text-${innerkey}`).classList.add('remove');
            }
          });
        });
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

export default BarChart;
