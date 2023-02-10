import React from "react";
import "./ProductsList.scss";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Star, Search } from "react-feather";

import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { API } from "../../../../http/API";

const CustomHeader = (props) => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="add-new">
        <Button.Ripple
          color="primary"
          onClick={() => props.history.push("/products/form")}
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

class DataTableCustom extends React.Component {
  state = {
    columns: [
      {
        name: "",
        selector: "featured_img",
        sortable: true,
        // minWidth: "50px",
        maxWidth: "50px",
        cell: (row) => (
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
            <div
              className="user-img ml-xl-0 ml-2"
              style={{ width: "40px", height: "40px", borderRadius: "100%" }}
            >
              <img
                className="img-fluid rounded-circle"
                src={process.env.REACT_APP_IMAGE_BASE_URL + row.featured_img}
                alt={row.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        ),
      },
      {
        name: "Name",
        selector: "name",
        sortable: true,
        minWidth: "400px",
        cell: (row) => (
          <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
            {/* <div className="user-img ml-xl-0 ml-2" style={{width:'50px', height:'50px', borderRadius:'100%'}}>
              <img
                className="img-fluid rounded-circle"
                src={row.banner_images_list}
                alt={row.name}
                style={{width:'100%', height:'100%', objectFit:'cover'}}
              />
            </div> */}
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

      // {
      //   name: "Short Description",
      //   selector: "short_description",
      //   sortable: true,
      //   cell: (row) => (
      //     <p className="text-bold-500 mb-0">
      //       {row.short_description?.substring(0, 50)}...
      //     </p>
      //   ),
      // },

      {
        name: "Category",
        selector: "categories",
        sortable: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">{row.categories?.name}</p>
        ),
      },

      {
        name: "Code",
        selector: "product_code",
        sortable: true,
        maxWidth: "100px",
        cell: (row) => {
          return (
            <div className="d-flex flex-column align-items-center">
              {row.product_code ? (
                <p className="text-center">{row.product_code}</p>
              ) : (
                <p className="text-center">
                  {row.variations?.map((x) => (
                    <span>{`${x.code},`}</span>
                  ))}
                </p>
              )}
              {/* <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <Star size="20" className="text-warning" />
                </li>
                <li className="list-inline-item">
                  <Star size="20" className="text-warning" />
                </li>
                <li className="list-inline-item">
                  <Star
                    size="20"
                    className={
                      row.rating > 4 || row.rating === "average"
                        ? "text-warning"
                        : "text-muted"
                    }
                  />
                </li>
                <li className="list-inline-item">
                  <Star
                    size="20"
                    className={
                      row.rating > 4 ? "text-warning" : "text-muted"
                    }
                  />
                </li>
                <li className="list-inline-item">
                  <Star
                    size="20"
                    className={
                      row.rating > 4 ? "text-warning" : "text-muted"
                    }
                  />
                </li>
              </ul> */}
            </div>
          );
        },
      },
      {
        name: "Actions",
        selector: "_id",
        sortable: true,
        cell: (row) => (
          <p className="text-bold-500 mb-0">
            {/* {row.actions} */}
            {/* <FaEye size={20} className="action-icon-details" /> */}
            <MdEdit
              size={20}
              style={{
                color: "#e65550 ",
              }}
              onClick={
                () => {
                  // const win = window.open(
                  //   `/products/edit/${row.route}`
                  //   // "_blank"
                  // );
                  // win.focus();
                  this.props.history.push(
                    `/products/edit/${encodeURIComponent(row.route)}`
                  );
                }
                // this.props.history.push(`/products/edit/${row._id}`)
              }
              className="action-icon-edit"
            />
            <MdDelete
              size={20}
              className="action-icon-delete"
              // onClick={() => this.handleDelete(this.state.data._id)}
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
  //!------Handle Api---------
  handleGetApi = () => {
    API.get("/products?page=all")
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((err) => console.log(err));
  };
  //!-------Handle Delete------
  handleDelete = (route) => {
    API.delete(`/products/${route}`)
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
          item.name?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.date?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.size?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.product_code?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.variations?.find((x) =>
            x.code?.toLowerCase().startsWith(value?.toLowerCase())
          ) ||
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
          item.product_code?.toLowerCase().startsWith(value?.toLowerCase()) ||
          item.variations?.find((x) =>
            x.code?.toLowerCase().startsWith(value?.toLowerCase())
          ) ||
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
          <CardTitle>Product List</CardTitle>
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

export default DataTableCustom;
