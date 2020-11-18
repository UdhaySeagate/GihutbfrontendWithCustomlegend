/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import './Filter.css';
import { Row, Col, Container, ButtonGroup, Button } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Picky } from 'react-picky';
import Header from '../Header/Header';
import InstantReport from '../InstantReportCards/InstantReport';
import Livestats from '../Livestats/Livestats';
import TotalActions from '../TotalActions/TotalActions';
import TotalContributions from '../TotalContribution/TotalContributions';
import Averagepr from '../AveragePRAge/Averagepr';
// import ResponseLatency from "../ResponseLatency/ResponseLatency";
import AverageIssueAge from '../AverageIssueAge/AverageIssueAge';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import ErrorData from '../commonLoader/ErrorData';
import 'react-picky/dist/picky.css'; // Include CSS
import ExpandView from '../ExpandView/ExpandView';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      copyRepo: null,
      copyDateVal: null,
      filterDropDown: ['Custom', 'Day', 'Week', 'Month', 'Year', 'All'],
      selectedFilterItems: {
        repoName: '',
        from: '',
        upto: '',
        filtertype: 'Month'
      },
      selectedDateRangeValue: 'Month',
      showCharts: false,
      showErrorMessage: '',
      instantStatus: false,
      totalAction: false,
      liveStats: false,
      totalCon: false,
      averagepr: false,
      averageissue: false,
      showButton: false,
      allRangeDateOrg: '',
      intinalEndDate: moment().format('MM/DD/YYYY'),
      intinalStartDate: moment().format('MM/DD/YYYY'),
      maxEndDate: moment().format('MM/DD/YYYY'),
      arrayValue: [],
      showFilter: false,
      showModal: false,
      activeHeader: ''
    };
    this.selectMultipleOption = this.selectMultipleOption.bind(this);

    this.api = new ApiServiceCall();
  }

  componentDidMount() {
    this.getRepoList();
  }

  getRepoList = () => {
    const response = this.api.callApiServiceMethod('REPO_LIST');
    response.then((data) => {
      const repoData = [];
      if (data.status === 'success' && data.statusCode === '200') {
        if (data.data.length > 0) {
          data.data.forEach((element) => {
            repoData.push({ name: element.name, label: element.name, id: element.name, checked: true });
          });
          const responseorg = this.api.callApiServiceMethod('GET_ORG');
          responseorg.then((dataorg) => {
            if (dataorg.status === 'success' && dataorg.statusCode === '200') {
              const allRepoParam = [];
              repoData.forEach((element) => {
                allRepoParam.push(element.name);
              });
              const filterRepo = this.state.selectedFilterItems;
              filterRepo.repoName = allRepoParam.toString();
              filterRepo.from = moment(this.api.changeTimeFormat()).subtract(1, 'months').utc().format();
              filterRepo.upto = this.api.changeEndTimeFormat().utc().format();
              if (this.api.getNoofDaysBetween(this.api.changeTimeFormat(dataorg.data.created).utc().format(), filterRepo.from) < 0) {
                filterRepo.from = this.api.changeTimeFormat(dataorg.data.created).utc().format();
              }
              this.setState({
                arrayValue: repoData,
                allRangeDateOrg: this.api.changeOrgDateFormat(dataorg.data.created),
                repoList: repoData,
                showCharts: true,
                selectedFilterItems: filterRepo,
                copyRepo: filterRepo.repoName,
                showFilter: true,
                copyDateVal: { ...filterRepo }
              });
            } else {
              this.setState({ showErrorMessage: dataorg.data ? dataorg.data : 'Sorry, No org details to show all date range filter', showCharts: true });
            }
          });
        } else {
          this.setState({ showErrorMessage: 'Sorry, No Repo/Project under the organization', showCharts: true });
        }
      } else {
        this.setState({ showErrorMessage: data.data ? data.data : 'Sorry , we are unable to process your request,kindly contact admin', showCharts: true });
      }
    });
  };

  setDateRangeFilter = (event, picker) => {
    const filterData = this.state.selectedFilterItems;
    filterData.from = this.api.changeTimeFormat(picker.startDate.format('YYYY-MM-DD')).utc().format();
    filterData.upto = this.api.changeEndTimeFormat(picker.endDate.format('YYYY-MM-DD')).utc().format();
    filterData.filtertype = 'Custom';
    // eslint-disable-next-line max-len
    if (JSON.stringify(filterData) !== JSON.stringify(this.state.copyDateVal)) {
      this.setState({
        selectedDateRangeValue: 'Custom',
        averagepr: false,
        averageissue: false,
        selectedFilterItems: filterData,
        copyDateVal: { ...filterData },
        instantStatus: false,
        totalAction: false,
        liveStats: false,
        totalCon: false,
        showButton: false,
        intinalStartDate: picker.startDate,
        intinalEndDate: picker.endDate
      });
    }
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
          averagepr: false,
          averageissue: false,
          selectedFilterItems: filterData,
          instantStatus: false,
          totalAction: false,
          copyDateVal: { ...filterData },
          liveStats: false,
          totalCon: false,
          showButton: false
        });
      }
    }
  };

  showExpandView = (clickHeader) => {
    this.setState({ showModal: !this.state.showModal, activeHeader: clickHeader });
  };

  handleAPICallStatus = (state) => {
    switch (state) {
      case 'instantStatus':
        this.setState({ instantStatus: true });
        break;
      case 'totalAction':
        this.setState({ totalAction: true });
        break;
      case 'liveStats':
        this.setState({ liveStats: true });
        break;
      case 'totalCon':
        this.setState({ totalCon: true });
        break;
      case 'averagepr':
        this.setState({ averagepr: true });
        break;
      case 'averageissue':
        this.setState({ averageissue: true });
        break;

      default:
        break;
    }
    if (this.state.averageissue && this.state.averagepr && this.state.totalCon && this.state.liveStats && this.state.totalAction && this.state.instantStatus) {
      this.setState({ showButton: true });
    }
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
          instantStatus: false,
          totalAction: false,
          liveStats: false,
          totalCon: false,
          showButton: false,
          averagepr: false,
          averageissue: false
        });
      }
    }
    document.querySelector('.repoDropDown .buttonbgcolor').click();
  };

  closeExpandView = () => {
    this.showExpandView();
  };

  selectMultipleOption(value) {
    this.setState({ arrayValue: value, showFilter: false });
  }

  render() {
    const stateVal = this.state;
    return (
      <Container fluid>
        {stateVal.showModal && (
          <ExpandView
            selectedRepoArray={stateVal.arrayValue}
            selectedData={stateVal.selectedFilterItems}
            clickHeader={stateVal.activeHeader}
            oncloseFun={this.closeExpandView}
            showModal={stateVal.showModal}
            repoData={stateVal.repoList}
            orgDate={stateVal.allRangeDateOrg}
          />
        )}
        <div>
          {!stateVal.showCharts ? (
            <div className="loaderDiv">
              <Loader type="ThreeDots" color="#00BFFF" height={60} width={50} />
              <div>Please wait ...</div>
            </div>
          ) : stateVal.showErrorMessage === '' ? (
            <div>
              <Header />
              <Row className="filterDiv">
                <Col sm={3} className="repoDropDown scrollDivset ">
                  <div className={!stateVal.showButton ? 'btndisable' : ''}>
                    <Picky
                      value={stateVal.arrayValue}
                      options={stateVal.repoList}
                      onChange={this.selectMultipleOption}
                      open={false}
                      valueKey="id"
                      labelKey="name"
                      multiple
                      includeSelectAll
                      includeFilter
                      placeholder="No Repo selected"
                      allSelectedPlaceholder="All Repo selected"
                      manySelectedPlaceholder="You have selected %s Repo"
                      dropdownHeight={400}
                      // clearFilterOnClose
                      filterPlaceholder="Search..."
                      buttonProps={{
                        className: 'buttonbgcolor'
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
                                {/* required to select item */}
                                <input type="checkbox" checked={isSelected} readOnly />
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
                <Col sm={6}>
                  <div className="dateRangeHeader">
                    {stateVal.selectedFilterItems.from !== '' && (
                      <span>
                        <span className="headerRange">Date Range : </span>
                        {stateVal.selectedFilterItems.filtertype !== 'Day' ? (
                          <span className="rangeValue">
                            {moment(stateVal.selectedFilterItems.from).format('ll')}
                            {' '}
                            -
                            {' '}
                            {moment(stateVal.selectedFilterItems.upto).format('ll')}
                            {' '}
                         
                          </span>
                       )
                      : (
                        <span className="rangeValue">
                          {moment(stateVal.selectedFilterItems.from).format('ll')}
                          {' '}
                         
                        </span>
                    )}
                      </span>
                    )}
                  </div>
                </Col>
                <Col sm={3} className="dateRangeMain">
                  <div className="range">
                    <ButtonGroup aria-label="Basic example" className="buttonFull">
                      {stateVal.filterDropDown.map((id) =>
                        !stateVal.showFilter || !stateVal.showButton ? (
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
                          <DateRangePicker
                            key={id}
                            onApply={(event, picker) => this.setDateRangeFilter(event, picker)}
                            initialSettings={{
                              minDate: moment(stateVal.allRangeDateOrg).format('MM/DD/YYYY'),
                              startDate: stateVal.intinalStartDate,
                              endDate: stateVal.intinalEndDate,
                              maxDate: stateVal.maxEndDate,
                              showDropdowns: true
                            }}
                          >
                            <Button key={id} onClick={() => this.setDateRange(id)} variant={stateVal.selectedDateRangeValue === id ? 'primary' : 'light'}>
                              {id}
                            </Button>
                          </DateRangePicker>
                        )
                      )}
                    </ButtonGroup>
                  </div>
                </Col>
              </Row>
              <InstantReport
                filterType={stateVal.selectedDateRangeValue}
                selectedFilterData={stateVal.selectedFilterItems}
                handleAPICall={this.handleAPICallStatus}
                showModalCall={this.showExpandView}
              />
              <Row className="section2">
                <Col sm={3}>
                  <Livestats showModalCall={this.showExpandView} selectedFilterData={stateVal.selectedFilterItems} handleAPICall={this.handleAPICallStatus} />
                </Col>
                <Col sm={4}>
                  <TotalActions
                    filterType={stateVal.selectedDateRangeValue}
                    selectedFilterData={stateVal.selectedFilterItems}
                    handleAPICall={this.handleAPICallStatus}
                    showModalCall={this.showExpandView}
                  />
                </Col>
                <Col sm={5}>
                  <TotalContributions
                    showModalCall={this.showExpandView}
                    selectedFilterData={stateVal.selectedFilterItems}
                    handleAPICall={this.handleAPICallStatus}
                  />
                </Col>
              </Row>
              <Row className="mainsection3">
                <Col sm={6}>
                  <Averagepr
                    selectedFilterData={stateVal.selectedFilterItems}
                    handleAPICall={this.handleAPICallStatus}
                    filterType={stateVal.selectedDateRangeValue}
                    allDateValOrg={stateVal.allRangeDateOrg}
                  />
                </Col>
                <Col sm={6}>
                  <AverageIssueAge
                    selectedFilterData={stateVal.selectedFilterItems}
                    handleAPICall={this.handleAPICallStatus}
                    filterType={stateVal.selectedDateRangeValue}
                    allDateValOrg={stateVal.allRangeDateOrg}
                  />
                </Col>
              </Row>
              <Row className="mainsection4">
                <Col sm={6}>{/* <ResponseLatency selectedFilterData={stateVal.selectedFilterItems}/> */}</Col>
                <Col sm={6} />
              </Row>
            </div>
          ) : (
            <ErrorData errorMessage={stateVal.showErrorMessage} />
          )}
        </div>
      </Container>
    );
  }
}
export default Filter;
