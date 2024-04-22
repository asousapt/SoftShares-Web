import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
    return (
    <Container>
        <Row>
        <Col sm={3} md={2} className="bg-light sidebar">
            <Nav className="flex-column">
            <Nav.Link as={NavLink} to="/" exact>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            </Nav>
        </Col>
        <Col sm={9} md={10} className="ml-sm-auto px-4">
            <h2>Main Content</h2>
            <p>This is the main content area.</p>
        </Col>
        </Row>
    </Container>
    );
}

export default Sidebar;
