import React from 'react';
import ContentLoader from 'react-content-loader';

const CardLoader = () => (
  <ContentLoader
    style={{
      ...{
        background: '#fff',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(49, 73, 177, 0.15)'
      }
    }}
    height="100%"
    width="100%"
    speed={1}
    viewBox="0 0 555 220"
  >
    <rect x="15" y="15" rx="4" ry="4" width="400" height="35" />
    <rect x="15" y="50" rx="2" ry="2" width="0" height="0" />
    <rect x="75" y="45" rx="16" ry="16" width="0" height="0" />
    <rect x="15" y="105" rx="3" ry="3" width="0" height="0" />
    <rect x="15" y="75" rx="3" ry="3" width="315" height="25" />
    <rect x="75" y="105" rx="3" ry="3" width="0" height="0" />
    <rect x="135" y="105" rx="3" ry="3" width="0" height="0" />
    <rect x="15" y="135" rx="16" ry="16" width="0" height="0" />
    <rect x="15" y="165" rx="2" ry="2" width="250" height="30" />
    <rect x="215" y="180" rx="2" ry="2" width="0" height="0" />
  </ContentLoader>
);

export default CardLoader;
