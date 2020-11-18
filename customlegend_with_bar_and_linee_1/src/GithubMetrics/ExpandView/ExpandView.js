/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import { Modal, Row, Col, Container, Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import DateRangePickerExpand from 'react-bootstrap-daterangepicker';
import { Picky } from 'react-picky';
import moment from 'moment';
import saveSvgAsPng from 'save-svg-as-png';
import donwload from '../../assets/download.png';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import './ExpandView.css';
// import LineChart from './LineChart';
import LineCharts from './LineCharts';
import AreaChart from './AreaChart';
import BarChart from './BarChart';
import CommonChartLoader from '../AveragePRAge/commonChartsLoader';
import 'bootstrap-daterangepicker/daterangepicker.css';

class ExpandView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setModelShow: false,
      repoList: [],
      copyRepo: null,
      copyDateVal: null,
      selectedHeaderValue: 'Visitors',
      chartValues: {
        repoNameGroup: '',
        repoNameData: '',
        datePush: '',
        headerType:'',
        colorsData: ''
      },
      filterDropDown: ['Custom', 'Day', 'Week', 'Month', 'Year', 'All'],
      // colorsCode:['#4986D9','#4DCB96','#929AAA','#7260DB','#ECB441','#4EBDD1','#D0599C','#3F99C5','#D38A6F','#A74EBD'],
      chartType: 'Line Chart',
      // chartTypeArray: ['Line Chart', 'Bar Chart', 'Area Chart'],
      chartTypeArray: ['Line Chart', 'Bar Chart'],
      selectedFilterItems: {
        repoName: '',
        from: '',
        upto: '',
        filtertype: 'Month'
      },
      selectedDateRangeValue: 'Month',
      headerName: ['Visitors', 'Visits', 'Actions Taken','Watchers','Starred','Forks','Contributing Organization','Clones','Commits', 'Contributors','Issues','Pull Request','Downloads'],
      arrayValue: [],
      allRangeDateOrg: '',
      intinalEndDate: moment().format('MM/DD/YYYY'),
      intinalStartDate: moment().format('MM/DD/YYYY'),
      maxEndDate: moment().format('MM/DD/YYYY'),
      showFilter: false,
      showButton: false,
      showErrorMessage: '',
      showChart: false,
      totalCount: 0
    };
    this.api = new ApiServiceCall();
  }

  componentDidMount() {
    const { props } = this;
    let repoarrayData = [];
    // if (props.selectedRepoArray.length > 10) {
    //   repoarrayData = props.selectedRepoArray.slice(0, 1);
    // } else {
    //   repoarrayData = props.selectedRepoArray;
    // }
    repoarrayData = props.selectedRepoArray;
    this.setState({
      allRangeDateOrg: props.orgDate,
      setModelShow: !this.state.setModelShow,
      arrayValue: [...repoarrayData],
      repoList: props.repoData
    });
    this.triggerDefaultCall(props.selectedData, repoarrayData);
  }

  triggerDefaultCall = (selectedProps, repoarrayData) => {
    const allRepoParam = [];
    repoarrayData.forEach((element) => {
      allRepoParam.push(element.name);
    });
    const selected = {
      ...selectedProps
    };
    selected.repoName = allRepoParam.toString();
    this.setState({
      selectedFilterItems: selected,
      copyDateVal: { ...selected },
      copyRepo: selected.repoName,
      selectedHeaderValue: this.props.clickHeader,
      selectedDateRangeValue: selected.filtertype,
      chartType:this.props.clickHeader === 'Downloads' ? 'Bar Chart':this.state.chartType
    });
    if (selected.filtertype === 'Custom' && selected.from !=='') {
      this.setState({
        intinalStartDate: moment(this.api.changeOrgDateFormat(selected.from)).format('MM/DD/YYYY'),
        intinalEndDate: moment(this.api.changeOrgDateFormat(selected.upto)).format('MM/DD/YYYY')
      });
    }
    this.callApiTriggerFunction(this.props.clickHeader, selected);
  };

  setModelShow = () => {
    this.setState({ setModelShow: !this.state.setModelShow });
    this.props.oncloseFun();
  };

  onSelectionApplied = () => {
    this.setState({ showFilter: true });
    const stateVal = this.state;
    if (stateVal.arrayValue.length > 0) {
      const filterRepo = stateVal.selectedFilterItems;
      const reponame = [];
      stateVal.arrayValue.forEach((element) => {
        reponame.push(element.name);
      });
      if (filterRepo.from === '') {
        filterRepo.from = this.api.changeTimeFormat().utc().format();
        filterRepo.upto = this.api.changeEndTimeFormat().utc().format();
      }
      filterRepo.repoName = reponame.toString();
      if (JSON.stringify(stateVal.copyRepo) !== JSON.stringify(filterRepo.repoName)) {
        this.setState({
          copyDateVal: { ...filterRepo },
          copyRepo: filterRepo.repoName,
          selectedFilterItems: filterRepo,
          showButton: false
        });
        this.callApiTriggerFunction(this.state.selectedHeaderValue, filterRepo);
      }
    }
    document.querySelector('.containerRepo .buttonbgcolor').click();
  };

  setDateRangeFilter = (event, picker) => {
    const filterData = this.state.selectedFilterItems;
    filterData.from = this.api.changeTimeFormat(picker.startDate.format('YYYY-MM-DD')).utc().format();
    filterData.upto = this.api.changeEndTimeFormat(picker.endDate.format('YYYY-MM-DD')).utc().format();
    filterData.filtertype = 'Custom';
    if (JSON.stringify(filterData) !== JSON.stringify(this.state.copyDateVal)) {
      this.setState({
        selectedDateRangeValue: 'Custom',
        selectedFilterItems: filterData,
        copyDateVal: { ...filterData },
        showButton: false,
        intinalStartDate: picker.startDate,
        intinalEndDate: picker.endDate
      });
      this.callApiTriggerFunction(this.state.selectedHeaderValue, filterData);
    }
  };

  callApiTriggerFunction = (urlType, params) => {
    let totalcommits ={};
    let urlName = '';
    switch (urlType) {
      case 'Visitors':
        urlName = 'VISITS';
        break;
      case 'Visits':
        urlName = 'VISITS';
        break;
      case 'Actions Taken':
        urlName = 'ACTION_TAKEN';
        break;
      case 'Watchers':
        urlName = 'WATCHES';
        break;
      case 'Forks':
        urlName = 'FORKS';
        break;
      case 'Starred':
        urlName = 'PEOPLE_STARRED';
        break;
      case 'Contributing Organization':
      case 'Commits':
      case 'Contributors':
        totalcommits = {
          ...params,
          since: params.from,
          until: params.upto
        };
        urlName = 'TOTAL_COMMITS';
        break;
      case 'Issues':
        totalcommits = {
          ...params,
          since: params.from,
          until: params.upto
        };
          urlName = 'TOTAL_ISSUES';
          break;
      case 'Pull Request':
          urlName = 'TOTAL_PR_MERGED';
          break;
      case 'Clones':
          urlName = 'TOTAL_CLONES';
          break;
      case 'Downloads':
        urlName = 'TOTAL_RELEASE_DOWNLOAD';
        break;
        default:
        urlName = 'VISITS';
        break;
    }
    this.setState({ showButton: false, showFilter: true, showChart: false, showErrorMessage: '' });
    if(urlName === 'TOTAL_COMMITS' || urlName === 'TOTAL_ISSUES' ){
      this.responseDataProcess(urlName, totalcommits, urlType);
    }else{
      this.responseDataProcess(urlName, params, urlType);
    }
  };

  responseDataProcess = (urlType, params, urlTypehead) => {
    const responseProcess = this.api.callApiServiceMethod(urlType, params);
    responseProcess.then((data) => {
      if (data.status === 'success' && data.statusCode === '200') {
        let dataPass = '';
        let typepass = '';
        if (urlTypehead === 'Contributing Organization') {
          dataPass = data.data.contributionOrg.expandView;
          typepass = data.data.contributionOrg.type;
        } else if (urlTypehead === 'Commits') {
          dataPass = data.data.commits.expandView;
          typepass = data.data.commits.type;
        } else if (urlTypehead === 'Contributors') {
          dataPass = data.data.contributors.expandView;
          typepass = data.data.contributors.type;
        } else {
          dataPass = data.data.expandView;
          typepass = data.data.type;
        }
        this.processChartData(dataPass,urlTypehead,typepass);
        // this.setState({ showButton: true, showChart: true,responseDataChart:data.data.expandView});
      } else {
        this.setState({ showErrorMessage: data.data, showChart: true, showButton: true });
      }
    });
  };

   processChartData = (expandView,headerType,type) => {
    const stateVal = this.state;
    const datares = expandView;
    const datePush = [];
    const repoNameData = [];
    const repoNameGroup = [];
    let totalCount = 0;
    let dateBeforeFormat = '';
    // remove empty list repo's
    const dataSort = [];
    if (datares.length > 0 && headerType !== 'Downloads') {
      datares.forEach((element, key) => {
        if (element.list.length > 0) {
          element.list.forEach((elementlist, listkey) => {
            dateBeforeFormat = elementlist.date;
            const date = moment(this.api.changeOrgDateFormat(elementlist.date)).format('YYYY-MM-DD');
            datares[key].list[listkey].date = date;
            if (!datePush.includes(date)) {
              datePush.push(date);
            }
            const count = stateVal.selectedHeaderValue === 'Visitors' ? elementlist.uniques : elementlist.count;
            dataSort.push({ repo: element.repo, date, count });
            totalCount += count;
          });
        } else {
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

    if(headerType === 'Downloads' && datares.length>0){
      datares.forEach((element, key) => {
        if(element.list.length>0){
          datePush.push(element.repo);
        }
      });
      let keyIncre = 1;
      datares.forEach((element,key) => {
        if(element.list.length>0){
          element.list.forEach((elementinner,innerkey) => {
            const trimRelaes = elementinner.release === null ? '' : elementinner.release.trim();
            const noname = `<no_name_${keyIncre}>`;
            const relaseName = trimRelaes.length === 0 ? noname : trimRelaes;
            datares[key].list[innerkey].release = relaseName;
            repoNameData.push([relaseName,...datePush]);
            repoNameGroup.push(relaseName);
            keyIncre +=1;
            totalCount += elementinner.count;
          });
        }
      });

      datares.forEach((element) => {
      if(element.list.length>0){
        element.list.forEach((elementinner) => {
          repoNameData.forEach((elementinnerData,repoKey) => {
            const index = elementinnerData.indexOf(elementinner.release);
            const repoIndex = elementinnerData.indexOf(element.repo);
            if(index>=0){
              const len =repoNameData[repoKey].length;
              repoNameData[repoKey].fill(null,1,len);
              repoNameData[repoKey][repoIndex] = elementinner.count;
            }
          });
        });
      }
      });
    }

    const colorsData = {};
    repoNameGroup.forEach((element,key) => {
      // const color = this.state.colorsCode[key];
      const color = `rgb(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)})`;
      colorsData[element] = color;
    });
    let cond = '';
    if (type !== '') {
      const splt = dateBeforeFormat.split('-');
      cond = splt.length > 1 ? 'MONTH' : type;
    }
    
    const chartValues = {
      typeYear: cond,
      repoNameGroup,
      repoNameData,
      datePush,
      headerType,
      colorsData
    };
    this.setState({ totalCount, chartValues, showChart: true, showButton: true });
  };

  setDateRange = (dateRange) => {
    const filterData = this.state.selectedFilterItems;
    if (this.state.selectedDateRangeValue !== dateRange) {
      switch (dateRange) {
        case 'Day':
          filterData.from = this.api.changeTimeFormat().utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          filterData.filtertype = dateRange;
          break;
        case 'Month':
          filterData.from = moment(this.api.changeTimeFormat()).subtract(1, 'months').utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          if (this.api.getNoofDaysBetween(this.api.changeTimeFormat(this.state.allRangeDateOrg).utc().format(), filterData.from) < 0) {
            filterData.from = this.api.changeTimeFormat(this.state.allRangeDateOrg).utc().format();
          }
          filterData.filtertype = dateRange;
          break;
        case 'Year':
          filterData.from = moment(this.api.changeTimeFormat()).subtract(1, 'year').utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          if (this.api.getNoofDaysBetween(this.api.changeTimeFormat(this.state.allRangeDateOrg).utc().format(), filterData.from) < 0) {
            filterData.from = this.api.changeTimeFormat(this.state.allRangeDateOrg).utc().format();
          }
          filterData.filtertype = dateRange;
          break;
        case 'Week':
          filterData.from = moment(this.api.changeTimeFormat()).subtract(1, 'week').utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          if (this.api.getNoofDaysBetween(this.api.changeTimeFormat(this.state.allRangeDateOrg).utc().format(), filterData.from) < 0) {
            filterData.from = this.api.changeTimeFormat(this.state.allRangeDateOrg).utc().format();
          }
          filterData.filtertype = dateRange;
          break;
        case 'Custom':
          filterData.from = '';
          filterData.upto = '';
          filterData.filtertype = dateRange;
          this.setState({ selectedDateRangeValue: dateRange, selectedFilterItems: filterData });
          break;
        default:
          filterData.from = this.api.changeTimeFormat(this.state.allRangeDateOrg).utc().format();
          filterData.upto = this.api.changeEndTimeFormat().utc().format();
          filterData.filtertype = 'All';
          break;
      }
      if (dateRange !== 'Custom') {
        this.setState({
          selectedDateRangeValue: dateRange,
          selectedFilterItems: filterData,
          copyDateVal: { ...filterData },
          showButton: false
        });
        this.callApiTriggerFunction(this.state.selectedHeaderValue, filterData);
      }
    }
  };

  selectMultipleOptionExpand = (value) => {
    // if (value.length <= 10) {
      this.setState({ arrayValue: value, showFilter: false });
    // }
  };

  setHeaderValue = (id) => {
    this.setState({ selectedHeaderValue: id });
    if(id === 'Downloads'){
    this.setState({ chartType: 'Bar Chart' });
    }
    this.callApiTriggerFunction(id, this.state.selectedFilterItems);
  };

  setChartType = (id) => {
    this.setState({ chartType: id });
  };

  download = () => {
    const nodeList = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-chart .c3-chart-line path');
    const nodeList2 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-axis path');
    const nodeList3 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3 .tick line');
    const nodeList4 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-legend-item text');
    const nodeList5 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-texts > .c3-text');
    const nodeList6 = document.getElementById('chartDiv').querySelector('svg').querySelectorAll('.c3-texts > .c3-text.remove');
    const lineGraph = Array.from(nodeList);
    const legendfont = Array.from(nodeList4);
    const cmbine = Array.from(nodeList2).concat(Array.from(nodeList3));
    /* eslint-disable no-param-reassign */
    lineGraph.forEach((element) => {
      element.style.fill = 'none';
    });
    nodeList5.forEach(element => {
      element.style.fill = '#fff';
      element.style.transform = 'translateY(15px)';
    });
    nodeList6.forEach(element => {
      element.style.fillOpacity = '0';
    });
    /* eslint-disable no-param-reassign */
    document.getElementById('chartDiv').querySelector('svg').style.backgroundColor = '#fff';
    document.getElementById('chartDiv').querySelector('svg').style.font = '10px sans-serif';
    if (document.getElementById('chartDiv').querySelector('svg .c3-legend-item text')) {
      document.getElementById('chartDiv').querySelector('svg .c3-legend-item text').style.font = '10px sans-serif';
    }
    /* eslint-disable no-param-reassign */
    cmbine.forEach((element) => {
      element.style.fill = 'none';
      element.style.stroke = 'black';
    });
    legendfont.forEach((element) => {
      element.style.font = '12px sans-serif';
    });
    /* eslint-disable no-param-reassign */
    const svg = document.getElementById('chartDiv').getElementsByTagName('svg')[0];
    saveSvgAsPng.saveSvgAsPng(svg, 'Github_Report.png');
  };

  render() {
    const stateVal = this.state;
    return (
      <>
        <Modal
          className="unique-class"
          show={stateVal.setModelShow}
          onHide={() => this.setModelShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton />
          <Modal.Body>
            <Container>
              <Row>
                <Col sm={12} className="headersection">
                  {!stateVal.showFilter || !stateVal.showButton ? (
                    <ButtonGroup aria-label="Basic example" className="buttonFull">
                      {stateVal.headerName.map((id) => (
                        <Button disabled key={id} onClick={() => this.setHeaderValue(id)} variant={stateVal.selectedHeaderValue === id ? 'underlineBtn' : ''}>
                          {id === 'Contributing Organization' ? 'Contributing Org': id}
                        </Button>
                      ))}
                    </ButtonGroup>
                  ) : (
                    <ButtonGroup aria-label="Basic example" className="buttonFull">
                      {stateVal.headerName.map((id) => (
                        <Button key={id} onClick={() => this.setHeaderValue(id)} variant={stateVal.selectedHeaderValue === id ? 'underlineBtn' : ''}>
                          {id === 'Contributing Organization' ? 'Contributing Org': id}
                        </Button>
                      ))}
                    </ButtonGroup>
                  )}
                </Col>
              </Row>
              <Row className="containerRepo">
                <Col sm={3} className="scrollDivset expanDropDown">
                  <div>
                    <Picky
                      value={stateVal.arrayValue}
                      options={stateVal.repoList}
                      onChange={this.selectMultipleOptionExpand}
                      open={false}
                      valueKey="id"
                      labelKey="name"
                      multiple
                      includeSelectAll
                      includeFilter
                      placeholder="No Repo selected"
                      allSelectedPlaceholder="All Repo selected"
                      manySelectedPlaceholder="You have selected %s Repo"
                      dropdownHeight={300}
                      // clearFilterOnClose
                      filterPlaceholder="Search..."
                      buttonProps={{
                        className: !stateVal.showButton ? 'btndisable buttonbgcolor' : 'buttonbgcolor'
                      }}
                      render={({ isSelected, item, selectValue, labelKey, valueKey }) => {
                        return (
                          <>
                            <span className="customDiv" id={item[valueKey]}>
                              <li
                                className={isSelected ? 'selected' : ''} // required to indicate is selected
                                key={item[valueKey]} // required
                                onClick={() => selectValue(item)}
                              >
                                {/* {stateVal.arrayValue.length >= 10 ? (
                                  <input type="checkbox" checked={isSelected} disabled readOnly />
                                ) : ( */}
                                <input type="checkbox" checked={isSelected} readOnly />
                                {/* )} */}
                                <span style={{ fontSize: '14px' }}>{item[labelKey]}</span>
                              </li>
                            </span>
                            <div className="applyButtonClass">
                              {stateVal.arrayValue.length !== 0 ? (
                                <Button onClick={() => this.onSelectionApplied()}>Apply</Button>
                              ) : (
                                <Button disabled onClick={() => this.onSelectionApplied()}>
                                  Apply
                                </Button>
                              )}
                            </div>
                          </>
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col sm={3} className="alignDiv">
                  <div className="repoCount">
                    <span className="totaHeade">Total Counts : </span>
                    <span className="totaCount">
                      {'  '}
                      {stateVal.totalCount}
                    </span>
                    <span />
                  </div>
                </Col>
                <Col sm={2} className="alignDiv">
                  <div>
                    {!stateVal.showFilter || !stateVal.showButton || stateVal.selectedHeaderValue ==='Downloads' ? (
                      <DropdownButton disabled id="dropdown-basic-button" title={stateVal.chartType} />
                    ) : (
                      <DropdownButton id="dropdown-basic-button" title={stateVal.chartType} onSelect={(evt) => this.setChartType(evt)}>
                        {stateVal.chartTypeArray.map((id) =>
                          stateVal.chartType === id ? (
                            <Dropdown.Item active eventKey={id}>
                              {id}
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item eventKey={id}>{id}</Dropdown.Item>
                          )
                        )}
                      </DropdownButton>
                    )}
                  </div>
                </Col>
                <Col sm={4} className="alignDiv expandRangeView ">
                  <div className="range">
                    <ButtonGroup aria-label="Basic example" className="buttonFull">
                      {stateVal.filterDropDown.map((id) =>
                        !stateVal.showFilter || !stateVal.showButton || stateVal.selectedHeaderValue ==='Downloads' ? (
                          <Button
                            key={id}
                            disabled
                            className="buttonbackground"
                            onClick={() => this.setDateRange(id)}
                            variant={stateVal.selectedDateRangeValue === id ? 'primary' : 'light'}
                          >
                            {id}
                          </Button>
                        ) : id !== 'Custom' ? (
                          <Button
                            key={id}
                            className="buttonbackground"
                            onClick={() => this.setDateRange(id)}
                            variant={stateVal.selectedDateRangeValue === id ? 'primary' : 'light'}
                          >
                            {id}
                          </Button>
                        ) : (
                          <DateRangePickerExpand
                            key={id}
                            onApply={(event, picker) => this.setDateRangeFilter(event, picker)}
                            initialSettings={{
                              minDate: moment(stateVal.allRangeDateOrg).format('MM/DD/YYYY'),
                              startDate: stateVal.intinalStartDate,
                              endDate: stateVal.intinalEndDate,
                              maxDate: stateVal.maxEndDate,
                              showDropdowns: true,
                              parentEl: ".unique-class",
                              opens: "left",
                            }}
                          >
                            <Button key={id} onClick={() => this.setDateRange(id)} variant={stateVal.selectedDateRangeValue === id ? 'primary' : 'light'}>
                              {id}
                            </Button>
                          </DateRangePickerExpand>
                        )
                      )}
                    </ButtonGroup>
                    {!stateVal.showButton ? (
                      <img src={donwload} alt="Paris" width="30" height="28" />
                    ) : (
                      <img className="pointershow" onClick={() => this.download()} src={donwload} alt="Paris" width="30" height="28" />
                    )}
                  </div>
                </Col>
                <Col className="chartDiv" id="chartDiv">
                  <div className="expandDate">
                    <div className="dateRangeHeader ">
                      {stateVal.selectedFilterItems.from !== '' && (
                        <span>
                          <span className="headerRange">Date Range : </span>
                          {stateVal.selectedFilterItems.filtertype !== 'Day' ? (
                            <span className="rangeValue">
                              {moment(stateVal.selectedFilterItems.from).format('ll')}
                              {'  '}
                              -
                              {moment(stateVal.selectedFilterItems.upto).format('ll')}
                              {' '}
                            </span>
                      )
                      : (
                        <span className="rangeValue">
                          {moment(stateVal.selectedFilterItems.from).format('ll')}
                          {'  '}
                        </span>
                    )}
                        </span>
                      )}
                    </div>
                    {/* <div className="noteMessage">
                      <span className="headerRange">Note : </span> 
                      <span className="rangeValue">Repo Selection restricted to maximum of 10 ,to get better view</span>
                    </div> */}
                  </div>
                  {!stateVal.showChart ? (
                    <CommonChartLoader />
                  ) : 
                  stateVal.chartType === 'Line Chart' ? (
                    <LineCharts dataPass={stateVal.chartValues} />
                  ) : stateVal.chartType === 'Bar Chart' ? (
                    <BarChart dataPass={stateVal.chartValues} />
                  ) : (
                    <AreaChart dataPass={stateVal.chartValues} />
                  )}
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default ExpandView;
