import React from "react";
import "./UserList.scss";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Search } from "react-feather";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { API } from "../../../../http/API";
import axios from "axios";

const CustomHeader = (props) => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="add-new">
        <Button.Ripple
          color="primary"
          onClick={() => props.history.push("/pages/form")}
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

class UsersList extends React.Component {
  state = {
    columns: [
      {
        name: "Name",
        selector: "name",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.name}</p>,
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.email}</p>,
      },
      {
        name: "Is Social",
        selector: "isScial",
        sortable: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            {row.is_social ? "True" : "False"}
          </p>
        ),
      },
    ],

    data: [],
    filteredData: [],
    value: "",
  };

  handleGetApi = () => {
    API.get("/auth/all_users")
      .then((res) => {
        this.setState({ data: res.data });
      })
      .catch((err) =>
        alert("Something went worng, Please check your internet connection")
      );
  };

  componentDidMount() {
    this.handleGetApi();
  }

  handleFilter = (e) => {
    let value = e.target.value;
    let data = this.state.data;
    let filteredData = this.state.filteredData;
    this.setState({ value });

    if (value.length) {
      filteredData = data.filter((item) => {
        let startsWithCondition =
          item.name?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.is_social
            ?.toString()
            .toLowerCase()
            .startsWith(value?.toLowerCase()) ||
          item.email?.toLowerCase().startsWith(value?.toLowerCase());

        let includesCondition =
          item.name?.toLowerCase().includes(value?.toLowerCase()) ||
          item.is_social
            ?.toString()
            .toLowerCase()
            .includes(value?.toLowerCase()) ||
          item.email?.toLowerCase().includes(value?.toLowerCase());

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
          <CardTitle>Users List</CardTitle>
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
        </CardBody>
      </Card>
    );
  }
}

export default UsersList;
