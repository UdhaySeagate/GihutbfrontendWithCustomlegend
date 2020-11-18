/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import './Averagepr.css';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import CommonChartLoader from './commonChartsLoader';
import ApiServiceCall from '../../serviceCall/apiServiceCall';

class Averagepr extends Component {
  constructor() {
    super();
    this.state = {
      filterDropDownPR: ['Custom', 'Day', 'Week', 'Month', 'Year', 'All'],
      averPRCall: false,
      showChart: false,
      copyDateVal: null,
      typeYear: '',
      showErrorMessage: '',
      averageClosed: [],
      dates: [],
      issueOpenCount: [],
      issueClosedCount: [],
      averageOpen: [],
      copyprops: null,
      averPRRange: 'Month',
      intinalEndDate: moment().format('MM/DD/YYYY'),
      intinalStartDate: moment().format('MM/DD/YYYY'),
      maxEndDate: moment().format('MM/DD/YYYY')
    };
    this.api = new ApiServiceCall();
  }

  componentDidMount() {
    if (JSON.stringify(this.state.copyprops) !== JSON.stringify(this.props.selectedFilterData)) {
      this.callApiTriggerFunction(this.props.selectedFilterData);
      this.setState({ copyprops: { ...this.props.selectedFilterData }, averPRRange: this.props.filterType });
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.state.copyprops) !== JSON.stringify(nextProps.selectedFilterData) && nextProps.selectedFilterData.from !== '') {
      this.callApiTriggerFunction(nextProps.selectedFilterData);
      this.setState({ copyprops: { ...nextProps.selectedFilterData }, averPRRange: nextProps.filterType, averPRCall: false });
      if (nextProps.selectedFilterData.filtertype === 'Custom' && !this.state.averPRCall) {
        this.setState({
          intinalStartDate: moment(this.props.selectedFilterData.from).format('MM/DD/YYYY'),
          intinalEndDate: moment(this.props.selectedFilterData.upto).format('MM/DD/YYYY')
        });
      }
    } else {
      this.setState({ copyprops: { ...nextProps.selectedFilterData } });
    }
  }

  callApiTriggerFunction = (params) => {
    this.setState({ showChart: false, dates: [], averagePR: [], showErrorMessage: '' });
    this.responseDataProcess('TOTAL_PR_MERGED', params);
  };

  responseDataProcess = (url, params) => {
    const responseProcess = this.api.callApiServiceMethod(url, params);
    responseProcess.then((data) => {
      this.props.handleAPICall('averagepr');
      if (data.status === 'success' && data.statusCode === '200') {
        this.processChartData(data.data.closedprchartData, data.data.openprchartData, data.data.avgType);
      } else {
        this.setState({ showErrorMessage: data.data, showChart: true });
      }
    });
  };

  processChartData = (closedreponseData, openresponseData, type) => {
    const datesclosed = [];
    const datesopen = [];
    const dates = [];
    if (closedreponseData.length > 0) {
      // eslint-disable-next-line func-names
      closedreponseData.forEach((element, key) => {
        closedreponseData[key].defaultDate = element.closeddate;
        const date = moment(this.api.changeOrgDateFormat(element.closeddate)).format('YYYY-MM-DD');
        closedreponseData[key].closeddate = date;
        if (!datesclosed.includes(date)) {
          datesclosed.push(date);
        }
        closedreponseData[key].divideCount = 1;
      });
    }

    if (openresponseData.length > 0) {
      openresponseData.forEach((element, key) => {
        openresponseData[key].defaultDate = element.createddate;
        const date = moment(this.api.changeOrgDateFormat(element.createddate)).format('YYYY-MM-DD');
        openresponseData[key].createddate = date;
        openresponseData[key].divideCount = 1;
        if (!datesopen.includes(date)) {
          datesopen.push(date);
        }
      });
    }

    if (datesopen.length >= datesclosed.length) {
      datesopen.forEach((element, key) => {
        if (!datesclosed.includes(element)) {
          datesclosed.splice(key, 0, element);
        }
      });
      if (datesclosed.length > datesopen.length) {
        datesclosed.forEach((element, key) => {
          if (!datesopen.includes(element)) {
            datesopen.splice(key, 0, element);
          }
        });
      }
    }

    /* In case of dateclosed lenght greate thrn date open */
    if (datesclosed.length >= datesopen.length) {
      datesclosed.forEach((element, key) => {
        if (!datesopen.includes(element)) {
          datesopen.splice(key, 0, element);
        }
      });
      if (datesopen.length > datesclosed.length) {
        datesopen.forEach((element, key) => {
          if (!datesclosed.includes(element)) {
            datesclosed.splice(key, 0, element);
          }
        });
      }
    }
    if (datesopen.length !== 0) {
      datesopen.forEach((element, key) => {
        dates[key] = element;
      });
    } else {
      datesclosed.forEach((element, key) => {
        dates[key] = element;
      });
    }
    dates.sort((a, b) => Date.parse(a) / 1000 - Date.parse(b) / 1000);
    const averageClosed = new Array(dates.length).fill(0);
    const issueClosedCount = new Array(dates.length).fill(0);
    const issueOpenCount = new Array(dates.length).fill(0);
    const averageOpen = new Array(dates.length).fill(0);
    const openDivideCount = new Array(dates.length).fill(0);
    const closeDivideCount = new Array(dates.length).fill(0);
    const dateCheck = [...dates];
    closedreponseData.forEach((element) => {
      const indexof = dateCheck.indexOf(element.closeddate);
      if (indexof >= 0) {
        closeDivideCount[indexof] += element.divideCount;
        averageClosed[indexof] += element.avgdays;
        issueClosedCount[indexof] += element.prcount;
      }
    });

    openresponseData.forEach((element) => {
      const indexof = dateCheck.indexOf(element.createddate);
      if (indexof >= 0) {
        openDivideCount[indexof] += element.divideCount;
        averageOpen[indexof] += element.avgdays;
        issueOpenCount[indexof] += element.prcount;
      }
    });

    averageOpen.forEach((element, key) => {
      if (openDivideCount[key] > 1) {
        const divide = element / openDivideCount[key];
        averageOpen[key] = Math.round((divide + Number.EPSILON) * 100) / 100;
      }
    });
    averageClosed.forEach((element, key) => {
      if (closeDivideCount[key] > 1) {
        const divide = element / closeDivideCount[key];
        averageClosed[key] = Math.round((divide + Number.EPSILON) * 100) / 100;
      }
    });
    dates.forEach((element, key) => {
      dates[key] = Date.parse(element) / 1000;
    });

    let cond = '';
    if (type !== '') {
      cond = closedreponseData[0] ? closedreponseData[0].defaultDate : openresponseData[0].defaultDate;
      const splt = cond.split('-');
      cond = splt.length > 1 ? 'MONTH' : type;
    }
    this.setState({
      typeYear: cond,
      showChart: true,
      issueClosedCount,
      issueOpenCount,
      averageClosed,
      averageOpen,
      dates
    });
  };

  setDateRange = (dateRange) => {
    const filterData = { ...this.props.selectedFilterData };
    if (this.state.averPRRange !== dateRange) {
      switch (dateRange) {
        case 'Day':
          filterData.from = this.api.changeTimeFormat().utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          filterData.filtertype = dateRange;
          break;
        case 'Month':
          filterData.from = moment(this.api.changeTimeFormat()).subtract(1, 'months').utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          filterData.filtertype = dateRange;
          break;
        case 'Year':
          filterData.from = moment(this.api.changeTimeFormat()).subtract(1, 'year').utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          filterData.filtertype = dateRange;
          break;
        case 'Week':
          filterData.from = moment(this.api.changeTimeFormat()).subtract(1, 'week').utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          filterData.filtertype = dateRange;
          break;
        case 'Custom':
          this.setState({ averPRRange: dateRange });
          break;
        default:
          filterData.from = this.api.changeTimeFormat(this.props.allDateValOrg).utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          filterData.filtertype = 'All';
          break;
      }
      if (dateRange !== 'Custom') {
        this.setState({ averPRRange: dateRange, showChart: false, copyDateVal: { ...filterData } });
        this.callApiTriggerFunction(filterData);
      }
    }
  };

  setDateRangeFilter = (event, picker) => {
    const filterData = { ...this.props.selectedFilterData };
    filterData.from = this.api.changeTimeFormat(picker.startDate.format('YYYY-MM-DD')).utc().format();
    filterData.upto = this.api.changeEndTimeFormat(picker.endDate.format('YYYY-MM-DD')).utc().format();
    filterData.filtertype = 'Custom';
    if (JSON.stringify(this.state.copyDateVal) !== JSON.stringify(filterData)) {
      this.setState({
        copyDateVal: { ...filterData },
        averPRRange: 'Custom',
        showChart: false,
        intinalStartDate: picker.startDate,
        intinalEndDate: picker.endDate,
        averPRCall: true
      });
      this.callApiTriggerFunction(filterData);
    }
  };

  render() {
    const stateVal = this.state;
    const data = {
      x: 'x',
      columns: [
        ['x', ...stateVal.dates],
        ['Open', ...stateVal.averageOpen],
        ['Closed', ...stateVal.averageClosed]
      ],
      type: 'line',
      colors: {
        Open: '#19CEA3',
        Closed: '#AE5AC3'
      }
    };
    const legend = {
      show: true
    };
    const padding = {
      right: 45,
      left: 45,
      bottom:20
    };
    
    const tooltip = {
      contents(d) {
        let { date, hrs, count, opencount, closcount, openhrs, closedhrs, lableText } = '';
        // data1 - closed data2 - open
        let typeName = d.length > 1 ? 'Multi' : d[0].id;
        if (typeName === 'Multi') {
          if (d[1]) {
            typeName = d[1].value === null ? d[0].id : typeName;
          } else {
            typeName = d[0].value === null ? d[1].id : typeName;
          }
        }
        date = new Date(stateVal.dates[d[0].index] * 1000);
        date =
          stateVal.typeYear === '' ? moment(date).format('ll') : stateVal.typeYear === 'MONTH' ? moment(date).format('MMM YYYY') : moment(date).format('YYYY');
        switch (typeName) {
          case 'Closed':
            hrs = stateVal.averageClosed[d[0].index];
            count = stateVal.issueClosedCount[d[0].index];
            lableText = 'Closed';
            break;
          case 'Open':
            hrs = stateVal.averageOpen[d[0].index];
            count = stateVal.issueOpenCount[d[0].index];
            lableText = 'Open';
            break;
          default:
            opencount = stateVal.issueOpenCount[d[0].index];
            openhrs = stateVal.averageOpen[d[0].index];
            closcount = stateVal.issueClosedCount[d[1].index];
            closedhrs = stateVal.averageClosed[d[1].index];
            break;
        }
        let cont = '';
        if (typeName !== 'Multi') {
          cont = `<div class="toolTip"><span>Date: ${date} </span><span>Avg PR ${lableText} Days : ${hrs} </span><span>PR ${lableText} Count : ${count}</span></div>`;
        } else {
          cont = `<div class="toolTip"><span>Date: ${date} </span><span>Avg PR Open Days : ${openhrs} </span><span>PR Open Count : ${opencount}</span><span>Avg PR Closed Days : ${closedhrs} </span><span>PR Closed Count : ${closcount}</span></div>`;
        }
        return cont;
      }
    };
    const axis = {
      y: {
        min: 0.5,
        label: {
          text: 'Days',
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
        type: 'category',
        tick: {
          // fit:false,
          centered: true,
          // count: stateVal.showCount,
          // format: '%e %b'
          format(e, d) {
            const date = new Date(stateVal.dates[e] * 1000);
            // return date.toDateString().substring(3);
            return stateVal.typeYear === ''
              ? moment(date).format('DD MMM')
              : stateVal.typeYear === 'MONTH'
              ? moment(date).format('MMM YYYY')
              : moment(date).format('YYYY');
            // return moment(date).format('DD MMM YYYY');
          }
        },
        label: {
          text: 'Date Range',
          position: 'outer-center'
        }
      }
    };
    return (
      <div className="averagepr-wrapper">
        <div>
          <Row className="headerdiv">
            <Col className="headerlable">
              <div>Average Chart (PR)</div>
            </Col>
            <Col className="daterangepr">
              <ButtonGroup disabled aria-label="Basic example">
                {stateVal.filterDropDownPR.map((id) =>
                  !stateVal.showChart ? (
                    <Button key={id} variant={stateVal.averPRRange === id ? 'primary' : 'light'} disabled>
                      {id}
                    </Button>
                  ) : id !== 'Custom' ? (
                    <Button key={id} onClick={() => this.setDateRange(id)} variant={stateVal.averPRRange === id ? 'primary' : 'light'}>
                      {id}
                    </Button>
                  ) : (
                    <DateRangePicker
                      key={id}
                      onApply={(event, picker) => this.setDateRangeFilter(event, picker)}
                      initialSettings={{
                        minDate: moment(this.props.allDateValOrg).format('MM/DD/YYYY'),
                        startDate: stateVal.intinalStartDate,
                        endDate: stateVal.intinalEndDate,
                        maxDate: stateVal.maxEndDate,
                        showDropdowns: true
                      }}
                    >
                      <Button key={id} onClick={() => this.setDateRange(id)} variant={stateVal.averPRRange === id ? 'primary' : 'light'}>
                        {id}
                      </Button>
                    </DateRangePicker>
                  )
                )}
              </ButtonGroup>
            </Col>
          </Row>
          <Row className="chartdiv">
            <Col  className="chartdata">
              {!stateVal.showChart ? (
                <CommonChartLoader />
              ) : stateVal.showErrorMessage === '' ? (
                <C3Chart padding={padding} data={data} legend={legend} tooltip={tooltip} axis={axis} />
              ) : (
                <div className="chartLoder">
                  <div className="progressBar">
                    <span className="plstext">Sorry No Data</span>
                    <br />
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Averagepr;
