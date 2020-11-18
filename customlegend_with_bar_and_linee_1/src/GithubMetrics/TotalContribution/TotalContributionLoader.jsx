import React from 'react';
import ContentLoader from 'react-content-loader';
import { Row, Col } from 'react-bootstrap';

const ContributionLoader = () => (
  <div className="data1">
    <div>
      <ContentLoader height={66.5} width={521} speed={2} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
        <rect x="15" y="50" rx="2" ry="2" width="220" height="10" />
        <rect x="15" y="30" rx="2" ry="2" width="380" height="10" />
      </ContentLoader>
    </div>
    <div className="contrsplit">
      <Row>
        <Col sm={6} className="loadercolor first">
          <ContentLoader height={52} width={221} speed={2} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
            <rect x="35" y="20" rx="2" ry="2" width="120" height="10" />
            <rect x="35" y="20" rx="2" ry="2" width="0" height="0" />
            <rect x="45" y="45" rx="2" ry="2" width="100" height="10" />
          </ContentLoader>
        </Col>
        <Col sm={6} className="loadercolor second">
          <ContentLoader height={52} width={221} speed={2} primaryColor="#d9d9d9" secondaryColor="#ecebeb">
            <rect x="35" y="20" rx="2" ry="2" width="120" height="10" />
            <rect x="35" y="20" rx="2" ry="2" width="0" height="0" />
            <rect x="45" y="45" rx="2" ry="2" width="100" height="10" />
          </ContentLoader>
        </Col>
      </Row>
    </div>
  </div>
);

export default ContributionLoader;
