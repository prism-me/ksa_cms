import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "reactstrap";
import { Star, Search } from "react-feather";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { API } from "./../../../../http/API";
import "./CategoryList.scss";
import { useHistory } from "react-router-dom";
import axios from "axios";

const CustomHeader = (props) => {
  let history = useHistory();
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="add-new">
        <Button.Ripple
          color="primary"
          onClick={() => history.push(`/category/form`)}
        >
          Add New
        </Button.Ripple>
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

export default class CategoryList extends Component {
  //!---------------state----------
  state = {
    columns: [
      {
        name: "Name",
        selector: "name",
        sortable: true,
        minWidth: "200px",
        cell: (row) => (
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
            <div className="user-img ml-xl-0 ml-2">
              <img
                className="img-fluid rounded-circle"
                height="36"
                width="36"
                src={row.featured_img}
                alt={row.name}
              />
            </div>
            <div className="user-info text-truncate ml-xl-50 ml-0">
              <span
                title={row.name}
                className="d-block text-bold-500 text-truncate mb-0"
              >
                {row.name}
              </span>
              <small title={row.email}>{row.email}</small>
            </div>
          </div>
        ),
      },

      {
        name: "Actions",
        selector: "_id",
        sortable: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            {/* <FaEye size={20} className="action-icon-details" /> */}
            <MdEdit
              size={20}
              onClick={() =>
                this.props.history.push(`/category/edit/${row.route}`)
              }
              className="action-icon-edit"
            />
            <MdDelete
              size={20}
              className="action-icon-delete"
              onClick={() => {
                if (window.confirm("Are you sure to delete this item?")) {
                  this.handleDelete(row.route);
                }
              }}
            />
          </p>
        ),
      },
    ],

    data: [],
    filteredData: [],
    value: "",
  };
  //!---------Handle Get API-------
  handleGetAPi = () => {
    API.get(`/categories?page=all`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          this.setState({ data: response.data });
        }
      })
      .catch((err) => console.log(err));
  };
  //!--------Handle Delete---------
  handleDelete = (route) => {
    
    API.delete(`/categories/${route}`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          this.handleGetApi();
        }
      })
      .catch((err) => console.log(err));
  };

  //!-----------API Call-----
  componentDidMount() {
    this.handleGetAPi();
  }
  //!-----------Handle Filter------
  handleFilter = (e) => {
    let value = e.target.value;
    let data = this.state.data;
    let filteredData = this.state.filteredData;
    this.setState({ value });

    if (value.length) {
      filteredData = data.filter((item) => {
        let startsWithCondition =
          item.name?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.date?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.size?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.short_description
            ?.toLowerCase()
            .startsWith(value?.toLowerCase()) ||
          item.long_description
            ?.toLowerCase()
            .startsWith(value?.toLowerCase()) ||
          item.category?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.material?.toLowerCase().startsWith(value?.toLowerCase());
        let includesCondition =
          item.name?.toLowerCase().includes(value?.toLowerCase()) ||
          item.date?.toLowerCase().includes(value?.toLowerCase()) ||
          item.size?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.short_description
            ?.toLowerCase()
            .startsWith(value?.toLowerCase()) ||
          item.long_description
            ?.toLowerCase()
            .startsWith(value?.toLowerCase()) ||
          item.category?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.material?.toLowerCase().includes(value?.toLowerCase());

        if (startsWithCondition) {
          return startsWithCondition;
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition;
        } else return null;
      });
      this.setState({ filteredData });
    }
  };

  //!-----------------------
  render() {
    let { data, columns, value, filteredData } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
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
              <CustomHeader value={value} handleFilter={this.handleFilter} />
            }
          />
        </CardBody>
      </Card>
    );
  }
}
