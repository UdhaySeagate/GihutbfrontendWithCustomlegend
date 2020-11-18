import React from 'react';
import ContentLoader from 'react-content-loader';
import { Row, Col } from 'react-bootstrap';

const ActionLoader = () => (
  <Row>
    <Col sm={9} className="actionLoaderTop">
      <ContentLoader height={58} width={400} speed={2} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
        <rect x="5" y="50" rx="2" ry="2" width="220" height="10" />
        <rect x="5" y="30" rx="2" ry="2" width="280" height="10" />
      </ContentLoader>
    </Col>
    <Col sm={3} className="actionLoaderTop">
      <ContentLoader height={68} width={100} speed={2} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
        <rect x="5" y="50" rx="2" ry="2" width="0" height="10" />
        <rect x="5" y="30" rx="2" ry="2" width="0" height="10" />
        <circle cx="46" cy="42" r="26" />
      </ContentLoader>
    </Col>
  </Row>
);

export default ActionLoader;
