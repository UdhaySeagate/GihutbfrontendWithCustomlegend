import React, { Component } from 'react';
import './ResponseLatency.css';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';

class ResponseLatency extends Component {
  constructor() {
    super();
    this.state = {
      filterDropDownRL: ['Day', 'Week', 'Month', 'Year', 'All']
    };
  }

  render() {
    const stateVal = this.state;
    const data = {
      x: 'x',
      columns: [
        ['x', '2010-03-04', '2010-03-05', '2010-03-06', '2010-03-07', '2010-03-08', '2010-03-09', '2010-03-10'],
        ['Average Response Latency', 4, 5, 0, 4, 2, 3, 2]
      ],
      type: 'area',
      colors: {
        'Average Response Latency': '#FFE380'
      }
    };
    const axis = {
      y: {
        label: {
          text: 'Issue Avg Time (Hrs)',
          position: 'outer-middle'
        },
        type: 'category'
      },
      x: {
        label: {
          text: 'Date Range',
          position: 'outer-center'
        },
        type: 'category'
      }
    };
    return (
      <div className="averagepr-wrapper">
        <div>
          <Row className="headerdiv">
            <Col sm={6} className="headerlable">
              <div>Response Latency</div>
            </Col>
            <Col sm={6}>
              <ButtonGroup aria-label="Basic example">
                {stateVal.filterDropDownRL.map((id) => (
                  <Button variant={id === 'All' ? 'primary' : 'light'}>{id}</Button>
                ))}
              </ButtonGroup>
            </Col>
          </Row>
          <Row className="chartdiv">
            <Col sm={12} className="chartdata">
              <C3Chart data={data} axis={axis} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ResponseLatency;
