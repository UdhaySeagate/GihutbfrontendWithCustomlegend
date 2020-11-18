/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
import React, { Component } from 'react';
import './TotalContributions.css';
import TotalContribution from './TotalContribution';
import ContributionLoader from './TotalContributionLoader';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import ContributorError from './TotalContributorsError';

class TotalContributions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contributors: {
        data: '',
        apiCallStatus: false,
        showErrorMessage: ''
      },
      issues: {
        data: '',
        apiCallStatus: false,
        showErrorMessage: ''
      },
      pullrequest: {
        data: '',
        apiCallStatus: false,
        showErrorMessage: ''
      },
      copyprops:''
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

  handleAPICallCon = () => {
    if (this.state.contributors.apiCallStatus && this.state.issues.apiCallStatus && this.state.pullrequest.apiCallStatus) {
      this.props.handleAPICall('totalCon');
    }
  };

  callApiTriggerFunction = (params) => {
    const reassign = {
      data: '',
      apiCallStatus: false,
      showErrorMessage: ''
    };
    this.setState({ contributors: reassign, issues: reassign, pullrequest: reassign });
    // process for response visitors
    const paramIssCommit = {
      ...params,
      since: params.from,
      until: params.upto
    };
    delete paramIssCommit.from;
    delete paramIssCommit.upto;
    this.responseDataProcess('TOTAL_COMMITS', paramIssCommit, 'contributors');
    this.responseDataProcess('TOTAL_ISSUES', paramIssCommit, 'issues');
    this.responseDataProcess('TOTAL_PR_MERGED', params, 'pullrequest');
  };

  responseDataProcess = (url, params, stateName) => {
    const stateVal = this.state;
    const responseProcess = this.api.callApiServiceMethod(url, params);
    responseProcess.then((data) => {
      let datapass = '';
      let error = '';
      if (data.status === 'success' && data.statusCode === '200') {
        datapass = data.data;
      } else {
        error = data.data;
      }
      switch (stateName) {
        case 'contributors':
          const contributor = stateVal.contributors;
          contributor.data = datapass.contributors;
          contributor.apiCallStatus = true;
          contributor.showErrorMessage = error;
          this.setState({ contributors: contributor });
          this.handleAPICallCon();
          break;
        case 'issues':
          const issue = stateVal.issues;
          issue.data = datapass;
          issue.apiCallStatus = true;
          issue.showErrorMessage = error;
          this.setState({ issues: issue });
          this.handleAPICallCon();
          break;
        case 'pullrequest':
          const pullrequ = stateVal.pullrequest;
          pullrequ.data = datapass;
          pullrequ.apiCallStatus = true;
          pullrequ.showErrorMessage = error;
          this.setState({ pullrequest: pullrequ });
          this.handleAPICallCon();
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
      <div className="totalcontribution">
        <div className={!stateVal.contributors.apiCallStatus || stateVal.contributors.showErrorMessage !== '' ? 'section3 errorBorder' : 'section3 con'}>
          {!stateVal.contributors.apiCallStatus ? (
            <ContributionLoader />
          ) : stateVal.contributors.showErrorMessage === '' ? (
            <TotalContribution displayName="contributors" data={stateVal.contributors.data} showModelProps={this.handleModalCall} />
          ) : (
            <ContributorError errorMessage={stateVal.contributors.showErrorMessage} />
          )}
        </div>
        <div className={!stateVal.issues.apiCallStatus || stateVal.issues.showErrorMessage !== '' ? 'section3 errorBorder' : 'section3 issu'}>
          {!stateVal.issues.apiCallStatus ? (
            <ContributionLoader />
          ) : stateVal.issues.showErrorMessage === '' ? (
            <TotalContribution displayName="issues" data={stateVal.issues.data} showModelProps={this.handleModalCall}  />
          ) : (
            <ContributorError errorMessage={stateVal.issues.showErrorMessage} />
          )}
        </div>
        <div className={!stateVal.pullrequest.apiCallStatus || stateVal.pullrequest.showErrorMessage !== '' ? 'section3 errorBorder' : 'section3 pull'}>
          {!stateVal.pullrequest.apiCallStatus ? (
            <ContributionLoader />
          ) : stateVal.pullrequest.showErrorMessage === '' ? (
            <TotalContribution displayName="pullrequest" data={stateVal.pullrequest.data} showModelProps={this.handleModalCall} />
          ) : (
            <ContributorError errorMessage={stateVal.pullrequest.showErrorMessage} />
          )}
        </div>
      </div>
    );
  }
}
export default TotalContributions;
