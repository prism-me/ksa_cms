import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap";
import "./UserProfile.scss";
import userImg from "../../../assets/img/pages/content-img-4.jpg";
import { connect } from "react-redux";

const mapStateToProps = (props) => {
  return {
    dataLog: props.auth.login,
  };
};

// const accessToken =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvcHJpc21jbG91ZGhvc3RpbmcuY29tXC9waWdlb25fYXBpc192MlwvcHVibGljXC9hcGlcL2F1dGhcL2xvZ2luIiwiaWF0IjoxNjIxNDkyMDU3LCJleHAiOjE2MjE1NDk2NTcsIm5iZiI6MTYyMTQ5MjA1NywianRpIjoiSFhRbFF5VkJWZlR4T0tQciIsInN1YiI6IjYwYTYwMGMwMGUzM2U1MDE3NjYzYjIyMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.3krAQjxtsQkrZY1xHTTqrW8pV3aonHGaCzieDqVOj2U";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { name, email, created_at, role } = this.props.dataLog.loggedInUser;
    let getDate = new Date(created_at);
    let year = getDate.getUTCFullYear();
    let month = getDate.toLocaleString("en-us", { month: "long" });
    let date = getDate.getUTCDate();

    return (
      <Card>
        <CardHeader className="d-flex">
          <CardTitle>User Details:</CardTitle>
        </CardHeader>
        <CardBody className="card-body-wrap">
          <Row>
            <Col>
              <div className="mt-1">
                <Row>
                  <Col>
                    <h6 className="mb-0">Name:</h6>
                  </Col>
                  <Col>
                    <p>{name}</p>
                  </Col>
                </Row>
              </div>

              <div className="mt-1">
                <Row>
                  <Col>
                    <h6 className="mb-0">Email:</h6>
                  </Col>
                  <Col>
                    <p>{email}</p>
                  </Col>
                </Row>
              </div>
              <div className="mt-1">
                <Row>
                  <Col>
                    <h6 className="mb-0">Role:</h6>
                  </Col>
                  <Col>
                    <p>{role === "admin" ? "Admin" : "User"}</p>
                  </Col>
                </Row>
              </div>
              <div className="mt-1">
                <Row>
                  <Col>
                    <h6 className="mb-0">Joined:</h6>
                  </Col>
                  <Col>
                    <p>
                      {year}-{month}-{date}
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col>
              <div className="image-wrap">
                <img src={userImg} alt="admin-img" />
              </div>
            </Col>
          </Row>

          <Button color="primary">Logout</Button>
        </CardBody>
      </Card>
    );
  }
}
export default connect(mapStateToProps)(UserProfile);
