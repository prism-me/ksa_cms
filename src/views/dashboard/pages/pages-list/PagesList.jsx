import React from "react";
import "./PagesList.scss";
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

class PagesList extends React.Component {
  state = {
    columns: [
      {
        name: "Title",
        selector: "title",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.title}</p>,
      },
      {
        name: "Route",
        selector: "route",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.route}</p>,
      },
      {
        name: "CMS Route",
        selector: "cms_route",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.cms_route}</p>,
      },
      {
        name: "Slug",
        selector: "slug",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.slug}</p>,
      },

      {
        name: "Description",
        selector: "description",
        sortable: true,
        cell: (row) => <p className="text-bold-500 mb-0">{row.description}</p>,
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
              style={{
                color: "#e65550 ",
              }}
              onClick={() => {
                this.props.history.push(`/pages/form/edit/${row.route}`);
              }}
              className="action-icon-edit"
            />
            <MdDelete
              size={20}
              onClick={() => {
                if (window.confirm("Are you sure to delete this item?")) {
                  this.handleDelete(row.route);
                }
              }}
              className="action-icon-delete"
            />
          </p>
        ),
      },
    ],

    data: [],
    filteredData: [],
    value: "",
  };
  handleGetApi = () => {
    API.get("/pages")
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch();
  };

  //!--------Handle Delete---------
  handleDelete = (id) => {
    
    API.delete(`/pages/${id}`)
      .then((response) => {
        
        if (response.status === 200 || response.status === 201) {
          this.handleGetApi();
        }
      })
      .catch((err) => console.log(err));
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
          item.title?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.route?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.cms_route?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.slug?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.size?.toLowerCase().startsWith(value?.toLowerCase());
        let includesCondition =
          item.title?.toLowerCase().includes(value?.toLowerCase()) ||
          item.route?.toLowerCase().includes(value?.toLowerCase()) ||
          item.cms_route?.toLowerCase().includes(value?.toLowerCase()) ||
          item.slug?.toLowerCase().includes(value?.toLowerCase()) ||
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
          <CardTitle>Pages List</CardTitle>
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

export default PagesList;
