/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import InstantReportCards from '../InstantReportCards/InstantReportCards';
import './Livestats.css';
import CardLoader from '../InstantReportCards/InstantCardLoader';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import CardError from '../InstantReportCards/cardError';

class Livestats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyprops: null,
      controrgs: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: '',
        barChartValue: []
      },
      forks: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: '',
        barChartValue: []
      },
      peopleStarred: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: '',
        barChartValue: []
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
  componentWillReceiveProps(nextProps, prevProps) {
    if (JSON.stringify(this.state.copyprops) !== JSON.stringify(nextProps.selectedFilterData) && nextProps.selectedFilterData.from !== '') {
      this.callApiTriggerFunction(nextProps.selectedFilterData);
      this.setState({ copyprops: { ...nextProps.selectedFilterData } });
    } else {
      this.setState({ copyprops: { ...nextProps.selectedFilterData } });
    }
  }

  callApiTriggerFunction = (params) => {
    const reassignObj = {
      count: '',
      apiCallStatus: false,
      showErrorMessage: '',
      barChartVal: []
    };
    this.setState({ forks: reassignObj, controrgs: reassignObj, peopleStarred: reassignObj });
    // process for response visitors
    const totalcommits = {
      ...params,
      since: params.from,
      until: params.upto
    };
    delete totalcommits.from;
    delete totalcommits.upto;
    this.responseDataProcess('TOTAL_COMMITS', totalcommits, 'controrgs');
    this.responseDataProcess('PEOPLE_STARRED', params, 'peopleStarred');
    this.responseDataProcess('FORKS', params, 'forks');
  };

  handleAPICallLive = () => {
    if (this.state.controrgs.apiCallStatus && this.state.peopleStarred.apiCallStatus) {
      this.props.handleAPICall('liveStats');
    }
  };

  responseDataProcess = (url, params, stateName) => {
    const stateVal = this.state;
    const responseProcess = this.api.callApiServiceMethod(url, params);
    responseProcess.then((data) => {
      let count = '';
      let error = '';
      let status = false;
      if (data.status === 'success' && data.statusCode === '200') {
        count = stateName === 'controrgs' ? data.data.contributionOrg.count : data.data.count;
        status = true;
      } else {
        error = data.data;
      }
      switch (stateName) {
        case 'forks':
          const forksdata = stateVal.forks;
          forksdata.count = count;
          forksdata.apiCallStatus = true;
          forksdata.showErrorMessage = error;
          forksdata.barChartValue = status ? data.data.statistic : '';
          this.setState({ forks: forksdata });
          this.handleAPICallLive();
          break;
        case 'controrgs':
          const controrg = stateVal.controrgs;
          controrg.count = count;
          controrg.apiCallStatus = true;
          controrg.showErrorMessage = error;
          controrg.barChartValue = status ? data.data.contributionOrg.statistic : '';
          this.setState({ controrgs: controrg });
          this.handleAPICallLive();
          break;
        case 'peopleStarred':
          const people = stateVal.peopleStarred;
          people.count = count;
          people.apiCallStatus = true;
          people.showErrorMessage = error;
          people.barChartValue = status ? data.data.statistic : '';
          this.setState({ peopleStarred: people });
          this.handleAPICallLive();
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
      <Row className="livestatelay">
        <Col sm={12}>
          {!stateVal.peopleStarred.apiCallStatus ? (
            <CardLoader />
          ) : stateVal.peopleStarred.showErrorMessage === '' ? (
            <InstantReportCards
              percentage="+3.45 % less than month"
              header="Starred"
              count={stateVal.peopleStarred.count}
              colorImage="card4"
              dataShow={stateVal.peopleStarred.barChartValue}
              daysCount=""
              showModelProps={this.handleModalCall}
              infomessage=""
            />
          ) : (
            <CardError errorMessage={stateVal.peopleStarred.showErrorMessage} />
          )}
        </Col>
        <Col sm={12}>
          {!stateVal.forks.apiCallStatus ? (
            <CardLoader />
          ) : stateVal.forks.showErrorMessage === '' ? (
            <InstantReportCards
              percentage="+3.45 % less than month"
              header="Forks"
              count={stateVal.forks.count}
              colorImage="card2"
              dataShow={stateVal.forks.barChartValue}
              daysCount=""
              showModelProps={this.handleModalCall}
              infomessage=""
            />
          ) : (
            <CardError errorMessage={stateVal.forks.showErrorMessage} />
          )}
        </Col>
        <Col sm={12}>
          {!stateVal.controrgs.apiCallStatus ? (
            <CardLoader />
          ) : stateVal.controrgs.showErrorMessage === '' ? (
            <InstantReportCards
              percentage="+3.45 % less than month"
              header="Contributing Organization"
              count={stateVal.controrgs.count}
              colorImage="card5"
              dataShow={stateVal.controrgs.barChartValue}
              daysCount=""
              showModelProps={this.handleModalCall}
              infomessage=""
            />
          ) : (
            <CardError errorMessage={stateVal.controrgs.showErrorMessage} />
          )}
        </Col>
        <Col sm={12}>
          {/* <div className="livestat">
          <div> 
            <span>Live Status</span>
            <span>Refres</span>
          </div>
          <div> 
            <span>Icon</span>
            <span>12900 comments</span>
            <span>Awaiting Response</span>
          </div>
          <div> 
            <span>Icon</span>
            <span>156 Pull Request</span>
            <span>Pending</span>
          </div>
        </div> */}
        </Col>
      </Row>
    );
  }
}

export default Livestats;
