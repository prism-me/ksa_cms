import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Badge, Col, Row } from "reactstrap";
import ReactStars from "react-rating-stars-component";

const ContactDetails = (props) => {
  let { name, email, phone, message } = props.contact;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Contact Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row>
            <Col sm={4}>
              <h6>Name:</h6>
            </Col>
            <Col>
              <p>{name}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Email:</h6>
            </Col>
            <Col>
              <p>{email}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Phone#:</h6>
            </Col>
            <Col>
              <p>{phone}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <h6>Message:</h6>
            </Col>
            <Col>
              <p>{message}</p>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactDetails;
