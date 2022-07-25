import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Badge, Col, Row } from "reactstrap";
import ReactStars from "react-rating-stars-component";

const ReviewDetails = (props) => {
  let { user, product, rating, comments } = props.review;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Review Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Row>
            <Col sm={4}>
              <h6>User Name:</h6>
            </Col>
            <Col>
              <p>{user?.name}</p>
            </Col>
            <Col xs={4} sm={3}>
              <Badge color="success">Approve</Badge>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Product Name:</h6>
            </Col>
            <Col>
              <p>{product?.name}</p>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <h6>Stars</h6>
            </Col>
            <Col>
              <div className="d-flex align-items-center">
                <ReactStars
                  count={5}
                  value={rating || 5}
                  onChange={() => {}}
                  size={25}
                  activeColor="gold"
                  color="#eaeaea"
                  edit={false}
                  isHalf
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="mt-2">
          <h6>Comment:</h6>
          <p>{comments}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewDetails;
