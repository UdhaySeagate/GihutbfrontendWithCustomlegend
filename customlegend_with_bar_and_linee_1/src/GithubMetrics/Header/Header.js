import React, { Component } from 'react';
import './Header.css';
import { Row, Col } from 'react-bootstrap';
import SeagateLogo from '../../assets/seagateLogo.png';
import githubLogo from '../../assets/Github_logo.png';

class Header extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Row className="headerDiv">
        <Col>
          <span>
            <img src={SeagateLogo} alt="increment" />
          </span>
        </Col>
        <Col>
          <span className="alignright">
            <img src={githubLogo} alt="increment" />
          </span>
        </Col>
      </Row>
    );
  }
}

export default Header;
