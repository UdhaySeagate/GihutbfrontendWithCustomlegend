/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Progress } from 'reactstrap';

const commonContributor = ({ displayName, data, showModelProps }) => {
  const showModel = (header) => {
    showModelProps(header);
  };

  return (
             
    <div className="data1 pointershow" onClick={() => displayName === 'contributors' ?  showModel('Contributors') : displayName === 'issues' ?  showModel('Issues') : showModel('Pull Request')}>
      <div>
        {displayName === 'contributors' && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div >
          <span>{data.total}</span>
          <span className="labelcaption underline">Total Contributors</span>
        </div>
        )}
        {displayName === 'issues' && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div >
          <span>{data.total}</span>
          <span className="labelcaption ">Total Issues</span>
        </div>
        )}
        {displayName === 'pullrequest' && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div >
          <span>{data.totalpr}</span>
          <span className="labelcaption ">Total Pull Requests</span>
        </div>
        )}
        <div className="progressmain">
          {displayName === 'contributors' && (
          <Progress multi className="progreeData">
            <Progress bar className="externalC" value={(data.external * 100) / data.total} />
            <Progress bar className="internalC" value={(data.internal * 100) / data.total} />
          </Progress>
          )}
          {displayName === 'issues' && (
          <Progress multi className="progreeData">
            <Progress bar className="openI" value={(data.open * 100) / data.total} />
            <Progress bar className="closedI" value={(data.close * 100) / data.total} />
          </Progress>
          )}
          {displayName === 'pullrequest' && (
          <Progress multi className="progreeData">
            <Progress bar className="openPR" value={(data.openpr * 100) / data.totalpr} />
            <Progress bar className="closedPR" value={(data.closepr * 100) / data.totalpr} />
          </Progress>
          )}
        </div>
      </div>
      <div className="contrsplit pointershow">
        <Row>
          <Col
            sm={6}
            className={
              displayName === 'contributors' ? 'contributors first externalC' : displayName === 'issues' ? 'issues first openI' : 'pullrequest first openPR'
            }
          >
            {displayName === 'contributors' && (
            <>
              <div className="textValue">{data.external}</div>
              <div className="splitLable ">External Contributors</div>
            </>
            )}
            {displayName === 'issues' && (
            <>
              <div className="textValue">{data.open}</div>
              <div className="splitLable openI">Open Issues</div>
            </>
            )}
            {displayName === 'pullrequest' && (
            <>
              <div className="textValue">
                {data.openpr}
                {' '}
              </div>
              <div className="splitLable">Open Pull Requests</div>
            </>
            )}
          </Col>
          <Col
            sm={6}
            className={displayName === 'contributors' ? 'contributors internalC' : displayName === 'issues' ? 'issues closedI' : 'pullrequest closedPR'}
          >
            {displayName === 'contributors' && (
            <>
              <div className="textValue">{data.internal}</div>
              <div className="splitLable">Internal Contributors</div>
            </>
            )}
            {displayName === 'issues' && (
            <>
              <div className="textValue">{data.close}</div>
              <div className="splitLable">Closed Issues</div>
            </>
            )}
            {displayName === 'pullrequest' && (
            <>
              <div className="textValue">{data.closepr}</div>
              <div className="splitLable closedPR">Merged / Closed Pull Requests</div>
            </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default commonContributor;
