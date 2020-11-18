/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import moment from 'moment';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import CommonChartLoader from '../AveragePRAge/commonChartsLoader';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      charttype: 'Line Chart',
      repoNameData: [],
      repoNameGroup: [],
      datePush: [],
      showChart: false
    };
    this.api = new ApiServiceCall();
  }

  componentDidMount() {
    const { props } = this;
    this.setState({ charttype: props.chartType, repoNameData: [], datePush: [], repoNameGroup: [] });
    this.processChartData();
  }

  /* eslint-disable react/no-deprecated */
  componentWillReceiveProps(nextprops) {
    this.setState({ charttype: nextprops.chartType });
  }

  processChartData = () => {
    const { props } = this;
    const datares = props.responseDataChart;
    const datePush = [];
    const repoNameData = [];
    const repoNameGroup = [];
    // remove empty list repo's
    const dataSort = [];
    if (datares.length > 0) {
      datares.forEach((element, key) => {
        if (element.list.length > 0) {
          element.list.forEach((elementlist, listkey) => {
            const date = moment(this.api.changeOrgDateFormat(elementlist.date)).format('YYYY-MM-DD');
            datares[key].list[listkey].date = date;
            if (!datePush.includes(date)) {
              datePush.push(date);
            }
            dataSort.push({ repo: element.repo, date, count: props.headerName === 'Visitors' ? elementlist.uniques : elementlist.count });
          });
        } else {
          // datares.splice(key,1);
          delete datares[key];
        }
      });
      datePush.sort((a, b) => Date.parse(a) / 1000 - Date.parse(b) / 1000);
      datares.forEach((element) => {
        repoNameData.push([element.repo, ...datePush]);
        repoNameGroup.push(element.repo);
      });

      dataSort.forEach((element) => {
        repoNameData.forEach((repoData, repoKey) => {
          if (repoData[0] === element.repo) {
            const index = repoData.indexOf(element.date);
            repoNameData[repoKey][index] = element.count;
          }
        });
      });

      repoNameData.forEach((element, mainkey) => {
        element.forEach((inner, key) => {
          if (key !== 0 && typeof inner === 'string') {
            repoNameData[mainkey][key] = 0;
          }
        });
      });
    }
    this.setState({ repoNameGroup, repoNameData, datePush, showChart: true });
  };

  heightCheck = () => {
    const { repoNameData } = this.state;
    repoNameData.forEach((element) => {
      const selectorValue = document.querySelectorAll(`.linechart svg  .c3-target-${element[0]} >  .c3-shapes-${element[0]} > path`);
      selectorValue.forEach((elementinner, key) => {
        const ht1 = document.querySelector(`.linechart svg .c3-bar-${key}`).getBBox();
        if (ht1.height < 5) {
          document.querySelector(`.linechart svg .c3-chart-texts  .c3-target-${element[0]} > .c3-texts-${element[0]} .c3-text-${key}`).classList.add('remove');
        }
      });
    });
  };

  render() {
    const stateVal = this.state;
    const data = {
      labels: true,
      x: 'x',
      columns: [['x', ...stateVal.datePush], ...stateVal.repoNameData],
      type: stateVal.charttype === 'Bar Chart' ? 'bar' : stateVal.charttype === 'Area Chart' ? 'area' : 'line',
      groups: [[...stateVal.repoNameGroup]]
    };

    const bar = {
      width: {
        ratio: stateVal.repoNameData.length < 5 ? 0.1 : 0.3 // this makes bar width 50% of length between ticks
      }
    };

    const size = {
      height: 360,
      width: 1080
    };

    const onrendered = () => {
      this.heightCheck();
    };

    const tooltip = {};

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
          format: '%e %b'
        },
        label: {
          text: 'Date Range',
          position: 'outer-center'
        },
        type: 'timeseries'
      }
    };
    const padding = {
      top: 20,
      right: 20,
      bottom: 20
    };
    return (
      <div className={stateVal.charttype !== '' ? `linechart ${stateVal.charttype}` : 'linechart'}>
        {!stateVal.showChart ? (
          <CommonChartLoader />
        ) : stateVal.charttype === 'Bar Chart' ? (
          <C3Chart data={data} axis={axis} size={size} bar={bar} padding={padding} onrendered={onrendered} />
        ) : (
          <C3Chart data={data} axis={axis} size={size} bar={bar} padding={padding} />
        )}
      </div>
    );
  }
}

export default LineChart;
