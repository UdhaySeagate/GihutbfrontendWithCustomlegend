/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import './InstantReport.css';
import InstantReportCards from './InstantReportCards';
import CardLoader from './InstantCardLoader';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import CardError from './cardError';

class InstantReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyprops: null,
      watchers: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: '',
        barChartValue: []
      },
      visits: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: '',
        barChartValue: []
      },
      visitors: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: '',
        barChartValue: []
      },
      actionTaken: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: '',
        barChartValue: []
      },
      daysObject: {
        dayscount: '',
        dateString: ''
      }
    };
    this.api = new ApiServiceCall();
  }

  componentDidMount() {
    if (JSON.stringify(this.state.copyprops) !== JSON.stringify(this.props.selectedFilterData)) {
      this.callApiTriggerFunction(this.props.selectedFilterData);
      this.setState({ copyprops: { ...this.props.selectedFilterData } });
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.state.copyprops) !== JSON.stringify(nextProps.selectedFilterData) && nextProps.selectedFilterData.from !== '') {
      this.callApiTriggerFunction(nextProps.selectedFilterData);
      this.setState({ copyprops: { ...nextProps.selectedFilterData } });
    } else {
      this.setState({ copyprops: { ...nextProps.selectedFilterData } });
    }
  }

  handleAPICallInstant = () => {
    if (this.state.visits.apiCallStatus && this.state.actionTaken.apiCallStatus && this.state.watchers.apiCallStatus) {
      this.props.handleAPICall('instantStatus');
    }
  };

  callApiTriggerFunction = (params) => {
    const reassignObj = {
      count: '',
      apiCallStatus: false,
      showErrorMessage: '',
      barChartValue: []
    };
    this.setState({ visitors: reassignObj, actionTaken: reassignObj, visits: reassignObj, watchers: reassignObj });
    this.responseDataProcess('VISITS', params, 'visits');
    this.responseDataProcess('ACTION_TAKEN', params, 'actionTaken');
    this.responseDataProcess('WATCHES', params, 'watchers');
  };

  responseDataProcess = (url, params, stateName) => {
    const stateVal = this.state;
    const responseProcess = this.api.callApiServiceMethod(url, params);
    responseProcess.then((data) => {
      let count = '';
      let error = '';
      let status = false;
      if (data.status === 'success' && data.statusCode === '200') {
        count = stateName === 'visits' ? data.data : data.data.count;
        status = true;
      } else {
        error = data.data;
      }
      switch (stateName) {
        case 'watchers':
          const watcher = stateVal.watchers;
          watcher.count = count;
          watcher.apiCallStatus = true;
          watcher.showErrorMessage = error;
          watcher.barChartValue = status ? data.data.statistic : '';
          this.setState({ watchers: watcher });
          this.handleAPICallInstant();
          break;
        case 'visits':
          const vist = stateVal.visits;
          vist.count = count.visits;
          vist.apiCallStatus = true;
          vist.showErrorMessage = error;
          vist.barChartValue = status ? data.data.visitStatistic : '';
          this.setState({ visits: vist });
          const visitor = {
            ...vist,
            count: count.visitors,
            barChartValue: status ? data.data.visitorsStatistic : ''
          };
          const daysObject = {
            days: '',
            dateString: ''
          };
          if (
            this.props.filterType !== 'Day' &&
            this.props.filterType !== 'Week' &&
            data.data.createdAt !== '' &&
            count.visits !== 0 &&
            data.data.createdAt !== null
          ) {
            if (!this.api.compareDatesisSameorBefore(data.data.createdAt, this.api.changeOrgDateFormat(this.props.selectedFilterData.from))) {
              daysObject.days = this.api.getNoofDaysBetween(data.data.createdAt, this.api.changeOrgDateFormat(this.props.selectedFilterData.upto));
              if (daysObject.days >= 0) {
                daysObject.dateString =
                  daysObject.days === 0
                    ? moment(data.data.createdAt).format('ll')
                    : `${moment(data.data.createdAt).format('ll')} - ${moment(this.api.changeOrgDateFormat(this.props.selectedFilterData.upto)).format('ll')}`; // 'Aug 6,2020 - Aug 18,2020';
                daysObject.days = daysObject.days === 0 ? daysObject.days : daysObject.days + 1;
              } else {
                daysObject.days = '';
              }
            }
          }
          this.setState({ visitors: visitor, daysObject });
          this.handleAPICallInstant();
          break;
        case 'actionTaken':
          const action = stateVal.actionTaken;
          action.apiCallStatus = true;
          action.showErrorMessage = error;
          action.count = count;
          action.barChartValue = status ? data.data.statistic : '';
          this.setState({ actionTaken: action });
          this.handleAPICallInstant();
          break;
        default:
          break;
      }
    });
  };

  handleModalCall = (clickHead) => {
    this.props.showModalCall(clickHead);
  };

  render() {
    const stateVal = this.state;
    return (
      <Row className="instant">
        <Col sm={3}>
          {!stateVal.visitors.apiCallStatus ? (
            <CardLoader />
          ) : stateVal.visitors.showErrorMessage === '' ? (
            <InstantReportCards
              percentage="+3.45 % less than month"
              header="Visitors"
              count={stateVal.visitors.count}
              colorImage="card1"
              dataShow={stateVal.visitors.barChartValue}
              daysCount={stateVal.daysObject}
              showModelProps={this.handleModalCall}
              infomessage="Data is shown from the Database"
            />
          ) : (
            <CardError errorMessage={stateVal.visits.showErrorMessage} />
          )}
        </Col>
        <Col sm={3}>
          {!stateVal.visits.apiCallStatus ? (
            <CardLoader />
          ) : stateVal.visits.showErrorMessage === '' ? (
            <InstantReportCards
              percentage="+3.45 % less than month"
              header="Visits"
              count={stateVal.visits.count}
              colorImage="card6"
              dataShow={stateVal.visits.barChartValue}
              daysCount={stateVal.daysObject}
              showModelProps={this.handleModalCall}
              infomessage="Data is shown from the Database"
            />
          ) : (
            <CardError errorMessage={stateVal.visits.showErrorMessage} />
          )}
        </Col>
        <Col sm={3}>
          {!stateVal.actionTaken.apiCallStatus ? (
            <CardLoader />
          ) : stateVal.actionTaken.showErrorMessage === '' ? (
            <InstantReportCards
              percentage="+3.45 % less than month"
              header="Actions Taken"
              count={stateVal.actionTaken.count}
              colorImage="card3"
              dataShow={stateVal.actionTaken.barChartValue}
              daysCount=""
              showModelProps={this.handleModalCall}
              infomessage=""
            />
          ) : (
            <CardError errorMessage={stateVal.actionTaken.showErrorMessage} />
          )}
        </Col>
        <Col sm={3}>
          {!stateVal.watchers.apiCallStatus ? (
            <CardLoader />
          ) : stateVal.watchers.showErrorMessage === '' ? (
            <InstantReportCards
              percentage="3.45 % less than month"
              header="Watchers"
              count={stateVal.watchers.count}
              colorImage="card7"
              dataShow={stateVal.watchers.barChartValue}
              daysCount=""
              showModelProps={this.handleModalCall}
              infomessage="Data is shown from the Database"
            />
          ) : (
            <CardError errorMessage={stateVal.watchers.showErrorMessage} />
          )}
        </Col>
      </Row>
    );
  }
}
export default InstantReport;
