/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
import React, { Component } from 'react';
import './TotalActions.css';
import { Row, Col } from 'react-bootstrap';
import { Tooltip } from 'reactstrap';
import moment from 'moment';
import Download from '../../assets/Downloads.png';
import clones from '../../assets/Clones.png';
import Commits from '../../assets/Commits.png';
import prrequest from '../../assets/PRmerged.png';
import ActionLoader from './TotalActionLoadaer';
import ApiServiceCall from '../../serviceCall/apiServiceCall';
import TotalActionError from './TotalActionError';
import cardIcon from "../../assets/infoicon_container.png";


class TotalActions extends Component {
  constructor() {
    super();
    this.state = {
      copyprops: null,
      totalReleaseDownload: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: ''
      },
      totalClones: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: ''
      },
      totalCommits: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: ''
      },
      totalPRMerge: {
        count: '',
        apiCallStatus: false,
        showErrorMessage: ''
      },
      daysObject: {
        days: '',
        dateString: ''
      },
      tooltipOpenaction: false,
      TooltipExampleinfoaction:false
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

  toggle = () => {
    this.setState({ tooltipOpenaction: !this.state.tooltipOpenaction });
  };

  infotoggle = () => {
    this.setState({ TooltipExampleinfoaction: !this.state.TooltipExampleinfoaction });
  };

  callApiTriggerFunction = (params) => {
    const reassignObj = {
      count: '',
      apiCallStatus: false,
      showErrorMessage: ''
    };
    this.setState({ totalCommits: reassignObj, totalClones: reassignObj, totalPRMerge: reassignObj, totalReleaseDownload: reassignObj });
    // process for response visitors
    const totalcommits = {
      ...params,
      since: params.from,
      until: params.upto
    };
    delete totalcommits.from;
    delete totalcommits.upto;
    this.responseDataProcess('TOTAL_COMMITS', totalcommits, 'totalCommits');
    this.responseDataProcess('TOTAL_CLONES', params, 'totalClones');
    this.responseDataProcess('TOTAL_RELEASE_DOWNLOAD', params, 'totalReleaseDownload');
    this.responseDataProcess('TOTAL_PR_MERGED', params, 'totalPRMerge');
  };

  handleAPICallAction = () => {
    if (
      this.state.totalCommits.apiCallStatus &&
      this.state.totalClones.apiCallStatus &&
      this.state.totalReleaseDownload.apiCallStatus &&
      this.state.totalPRMerge.apiCallStatus
    ) {
      this.props.handleAPICall('totalAction');
    }
  };

  showModel = (header) => {
    this.props.showModalCall(header);
  };

  responseDataProcess = (url, params, stateName) => {
    const stateVal = this.state;
    const responseProcess = this.api.callApiServiceMethod(url, params);
    responseProcess.then((data) => {
      let count = '';
      let error = '';
      if (data.status === 'success' && data.statusCode === '200') {
        count = stateName === 'totalPRMerge' ? data.data.mergedpr : data.data.count;
      } else {
        error = data.data;
      }
      switch (stateName) {
        case 'totalCommits':
          const totalCommit = stateVal.totalCommits;
          totalCommit.count = data.data.commits.count;
          totalCommit.apiCallStatus = true;
          totalCommit.showErrorMessage = error;
          this.setState({ totalCommits: totalCommit });
          this.handleAPICallAction();
          break;
        case 'totalClones':
          const totalClone = stateVal.totalClones;
          totalClone.count = count;
          totalClone.apiCallStatus = true;
          totalClone.showErrorMessage = error;
          const daysObject = {
            days: '',
            dateString: ''
          };
          if (
            this.props.filterType !== 'Day' &&
            this.props.filterType !== 'Week' &&
            data.data.createdAt !== '' &&
            count !== 0 &&
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
          this.setState({ totalClones: totalClone, daysObject });
          this.handleAPICallAction();
          break;
        case 'totalReleaseDownload':
          const totalReleaseDown = stateVal.totalReleaseDownload;
          totalReleaseDown.count = count;
          totalReleaseDown.apiCallStatus = true;
          totalReleaseDown.showErrorMessage = error;
          this.setState({ totalReleaseDownload: totalReleaseDown });
          this.handleAPICallAction();
          break;
        case 'totalPRMerge':
          const totalPRMe = stateVal.totalPRMerge;
          totalPRMe.count = count;
          totalPRMe.apiCallStatus = true;
          totalPRMe.showErrorMessage = error;
          this.setState({ totalPRMerge: totalPRMe });
          this.handleAPICallAction();
          break;
        default:
          break;
      }
    });
  };

  render() {
    const stateVal = this.state;
    return (
      <div className="totalaction">
        <div>
          {!stateVal.totalReleaseDownload.apiCallStatus ? (
            <ActionLoader />
          ) : stateVal.totalReleaseDownload.showErrorMessage === '' ? (
            <Row className="firstDiv pointershow" onClick={() => this.showModel('Downloads')}>
              <Col sm={9}>
                <span>Total Release Downloads</span>
                <span className="countValue">{stateVal.totalReleaseDownload.count}</span>
              </Col>
              <Col sm={3}>
                <span className="imgactions relase">
                  <img src={Download} alt="Release Download" />
                </span>
              </Col>
            </Row>
          ) : (
            <TotalActionError errorMessage={stateVal.totalReleaseDownload.showErrorMessage} />
          )}
        </div>
        <div>
          {!stateVal.totalClones.apiCallStatus ? (
            <ActionLoader />
          ) : stateVal.totalClones.showErrorMessage === '' ? (
            <Row className="pointershow" onClick={() => this.showModel('Clones')}>
              <Col sm={9}>
                <span className="cloneinfocont">
                  <span>
                    Total Clones
                  </span>
                  {' '}
                  <img src={cardIcon} alt="Info" id="TooltipExampleinfoaction" width="16" height="17" />
                </span>
                <Tooltip placement="bottom" isOpen={stateVal.TooltipExampleinfoaction} target="TooltipExampleinfoaction" toggle={this.infotoggle}>
                  <span className="dataShowtooltip">
                    Data is shown from the Database
                  </span>
                </Tooltip>
                <span className="countValue">{stateVal.totalClones.count}</span>
              </Col>
              <Col>
                <span className="imgactions clones">
                  <img src={clones} alt="Total Clones" />
                </span>
              </Col>
              {stateVal.daysObject.days !== '' && (
                <Col>
                  <span>
                    <span id="TooltipExampleaction" className="">
                      {stateVal.daysObject.days !== 0 ? (
                        <span className="daystotalaction pointershow">
                          Last
                          {' '}
                          {stateVal.daysObject.days}
                          {' '}
                          Days
                        </span>
                      ) : (
                        <span className="daystotalaction">One Day</span>
                      )}
                    </span>
                    <Tooltip placement="right" isOpen={stateVal.tooltipOpenaction} target="TooltipExampleaction" toggle={this.toggle}>
                      {stateVal.daysObject.dateString}
                    </Tooltip>
                  </span>
                </Col>
              )}
            </Row>
          ) : (
            <TotalActionError errorMessage={stateVal.totalClones.showErrorMessage} />
          )}
        </div>
        <div>
          {!stateVal.totalCommits.apiCallStatus ? (
            <ActionLoader />
          ) : stateVal.totalCommits.showErrorMessage === '' ? (
            <Row className="pointershow" onClick={() => this.showModel('Commits')}>
              <Col sm={9} >
                <span>
                  Total Commits 
                  {' '}
                  <span className="branch">(Branch : Master)</span>
                </span>
                <span className="countValue">{stateVal.totalCommits.count}</span>
              </Col>
              <Col sm={3}>
                <span className="imgactions commits">
                  <img src={Commits} alt="Total Commits" />
                </span>
              </Col>
            </Row>
          ) : (
            <TotalActionError errorMessage={stateVal.totalCommits.showErrorMessage} />
          )}
        </div>
        <div>
          {!stateVal.totalPRMerge.apiCallStatus ? (
            <ActionLoader />
          ) : stateVal.totalPRMerge.showErrorMessage === '' ? (
            <Row className="lastDiv pointershow"  onClick={() => this.showModel('Pull Request')}>
              <Col sm={9}>
                <span>Total Pull Requests Merged</span>
                <span className="countValue">{stateVal.totalPRMerge.count}</span>
              </Col>
              <Col sm={3}>
                <span className="imgactions merged">
                  <img src={prrequest} alt="Pull Requests" />
                </span>
              </Col>
            </Row>
          ) : (
            <TotalActionError errorMessage={stateVal.totalPRMerge.showErrorMessage} />
          )}
        </div>
      </div>
    );
  }
}

export default TotalActions;
