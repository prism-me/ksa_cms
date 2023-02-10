import React from "react";
import "./FirstTimeFatherList.scss";
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

const CustomHeader = (props) => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="add-new">
        <Button.Ripple
          color="primary"
          onClick={() => props.history.push("/first-time-father/form")}
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

class FirstTimeFatherList extends React.Component {
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
                src={
                  process.env.REACT_APP_IMAGE_BASE_URL +
                  row.widget_content.featured_img
                }
                alt={row.widget_content.featured_img}
              />
            </div>
            <div className="user-info text-truncate ml-xl-50 ml-0">
              <span
                title={row.widget_content.title}
                className="d-block text-bold-500 text-truncate mb-0"
              >
                {row.widget_content.title}
              </span>
            </div>
          </div>
        ),
      },

      {
        name: "Short Description",
        selector: "short_description",
        sortable: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            {row.widget_content.short_description}
          </p>
        ),
      },

      {
        name: "Actions",
        selector: "_id",
        sortable: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            <FaEye size={20} className="action-icon-details" />
            <MdEdit
              size={20}
              style={{
                color: "#e65550 ",
              }}
              // onClick={() =>
              //   this.props.history.push(`/products/edit/${row._id}`)
              // }
              className="action-icon-edit"
            />
            <MdDelete size={20} className="action-icon-delete" />
          </p>
        ),
      },
    ],

    data: [],
    filteredData: [],
    value: "",
  };
  componentDidMount() {
    API.get("/widgets?page=all")
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch();
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

  render() {
    let { data, columns, value, filteredData } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>First Time Father List</CardTitle>
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

export default FirstTimeFatherList;
