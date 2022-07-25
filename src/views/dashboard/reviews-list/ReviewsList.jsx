import React from "react";
import "./ReviewsList.scss";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "reactstrap";
import ReactStars from "react-rating-stars-component";

import DataTable from "react-data-table-component";
import { Star, Search } from "react-feather";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { API } from "../../../http/API";
import ReviewDetails from "./review-details/ReviewDetails";
import { Badge } from "react-bootstrap";

const CustomHeader = (props) => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="add-new">
        {/* <Button.Ripple
          color="primary"
          onClick={() => props.history.push("/pages/form")}
        ></Button.Ripple> */}
      </div>
      <div className="position-relative has-icon-left mb-1">
        <Input value={props.value} onChange={(e) => props.handleFilter(e)} />
        <div className="form-control-position">
          <Search size="15" />
        </div>
      </div>
    </div>
  );
};

class ReviewsList extends React.Component {
  state = {
    columns: [
      {
        name: "User Name",
        selector: "user",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.user?.name}</p>,
      },
      {
        name: "Product Name",
        selector: "user",
        sortable: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">{row.product?.name}</p>
        ),
      },

      {
        name: "Status",
        selector: "is_approved",
        sortable: true,
        cell: (row) => (
          <Badge
            variant={row.is_approved ? "success" : "warning"}
            pill
            // className="mr-2"
            // style={{ cursor: "pointer" }}
          >
            {row.is_approved ? "Approved" : "Pending"}
          </Badge>
        ),
      },

      {
        name: "Actions",
        selector: "_id",
        sortable: true,
        cell: (row) => (
          <div className="d-flex justify-content-between">
            <Badge
              variant={row.is_approved ? "danger" : "success"}
              className="mr-2"
              style={{ cursor: "pointer" }}
              onClick={() => this.handleApprove(row)}
            >
              {row.is_approved ? "Reject" : "Approve"}
            </Badge>
            <FaEye
              size={20}
              onClick={() => {
                this.setState({ selectReview: row });
                this.setState({ show: true });
              }}
              className="action-icon-details"
            />

            <MdDelete size={20} className="action-icon-delete" />
          </div>
        ),
      },
    ],

    data: [],
    filteredData: [],
    value: "",
    show: false,
    onHide: false,
    selectReview: "",
  };
  componentDidMount() {
    
    this.getReviewsList();
  }

  getReviewsList = () => {
    API.get("/reviews")
      .then((response) => {
        
        this.setState({ data: response.data });
        // console.log("Review API response", response.data);
      })
      .catch((err) => console.log(err));
  };

  handleApprove = (prevObject) => {
    let newObject = { ...prevObject };
    newObject.is_approved = !prevObject.is_approved;
    const reviewID = newObject._id;
    delete newObject._id;
    API.put(`/reviews/${reviewID}`, newObject)
      .then((response) => {
        
        console.log("Review API response", response.data);
        this.getReviewsList();
      })
      .catch((err) => console.log(err));
  };

  handleFilter = (e) => {
    let value = e.target.value;
    let data = this.state.data;
    let filteredData = this.state.filteredData;
    this.setState({ value });

    if (value.length) {
      filteredData = data.filter((item) => {
        let startsWithCondition =
          item.user?.name.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.comments?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.size?.toLowerCase().startsWith(value?.toLowerCase());
        let includesCondition =
          item.user?.name.toLowerCase().includes(value?.toLowerCase()) ||
          item.product?.name.toLowerCase().includes(value?.toLowerCase()) ||
          item.size?.toLowerCase().startsWith(value?.toLowerCase());

        if (startsWithCondition) {
          return startsWithCondition;
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition;
        } else return null;
      });
      this.setState({ filteredData });
    }
  };

  render() {
    let { data, columns, value, filteredData } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardBody className="rdt_Wrapper">
          <DataTable
            className="dataTable-custom"
            data={value.length ? filteredData : data}
            columns={columns}
            noHeader
            pagination
            subHeader
            subHeaderComponent={
              <CustomHeader
                value={value}
                handleFilter={this.handleFilter}
                {...this.props}
              />
            }
          />
          <ReviewDetails
            show={this.state.show}
            onHide={() => {
              this.setState({ show: false });
            }}
            review={this.state.selectReview}
          />
        </CardBody>
      </Card>
    );
  }
}

export default ReviewsList;
