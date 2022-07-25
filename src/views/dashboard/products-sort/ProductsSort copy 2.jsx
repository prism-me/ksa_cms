import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import MaterialButton from "@material-ui/core/Button";
import { Card, CardHeader, CardBody } from "reactstrap";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { API } from "../../../http/API";
import { DragHandleOutlined } from "@material-ui/icons";
import { Paper } from "@material-ui/core";
import lodash from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function ProductsSort() {
  const classes = useStyles();

  const [dragId, setDragId] = useState();
  const [subCategoryDragId, setSubCategoryDragId] = useState();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});

  // !------Pages Api Call---------
  useEffect(() => {
    API.get(`/categories?page=all`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setCategories(
            response.data
              ?.filter((x) => !x.parent_id)
              ?.map((x, index) => {
                return {
                  _id: x._id,
                  name: x.name,
                  order: x.order || index + 1,
                  temp_id: x.temp_id || index + 1,
                  children: x.children?.map((y, ind) => {
                    return {
                      _id: y._id,
                      name: y.name,
                      order: y.order || ind + 1,
                      temp_id: y.temp_id || ind + 1,
                    };
                  }),
                };
              })
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    API.get(`/products?page=all`)
      .then((response) => {
        let groupedProducts = lodash.groupBy(
          response.data?.map((x, index) => {
            return {
              _id: x._id,
              name: x.name,
              category: x.category,
              featured_img: x.featured_img,
              order: x.order || index + 1,
              temp_id: x.order || index + 1,
            };
          }),
          "category"
        );
        setGroupedProducts(groupedProducts);
        if (response.status === 200 || response.status === 201) {
          setProducts(
            response.data.map((x, index) => {
              return {
                _id: x._id,
                name: x.name,
                category: x.category,
                featured_img: x.featured_img,
                order: x.order || index + 1,
                temp_id: x.order || index + 1,
              };
            })
          );
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  // const handleDrop = (ev) => {
  //   const dragBox = products.find((box) => box.temp_id == dragId);
  //   const dropBox = products.find((box) => box.temp_id == ev.currentTarget.id);

  //   const dragBoxOrder = dragBox.order;
  //   const dropBoxOrder = dropBox.order;

  //   if (dragBoxOrder == dropBoxOrder) {
  //     return;
  //   }

  //   const updatedProducts = products.map((box) => {
  //     if (box.temp_id == dragId) {
  //       box.order = dropBoxOrder;
  //     }
  //     if (box.temp_id == ev.currentTarget.id) {
  //       box.order = dragBoxOrder;
  //     }
  //     return box;
  //   });

  //   setProducts(updatedProducts);
  // };

  const handleDrop = (ev, objKey) => {
    let updatedGroupedProducts = { ...groupedProducts };

    const dragBox = updatedGroupedProducts[objKey].find(
      (box) => box.temp_id == dragId
    );
    const dropBox = updatedGroupedProducts[objKey].find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    if (dragBoxOrder == dropBoxOrder) {
      return;
    }
    const updatedProducts = updatedGroupedProducts[objKey].map((box) => {
      if (box.temp_id == dragId) {
        box.order = dropBoxOrder;
      }
      if (box.temp_id == ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });

    updatedGroupedProducts[objKey] = updatedProducts;

    setGroupedProducts(updatedGroupedProducts);
  };

  const handleSubmit = () => {
    API.post(`/product_sorting`, products)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          console.log("Submit response", response);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Products Sorting</h4>
          </CardHeader>
          <CardBody className="">
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  className={classes.heading}
                  style={{ marginBottom: 0 }}
                >
                  Category Wise Products
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2"></h4> */}
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                  </Grid> */}
                  {Object.entries(groupedProducts)?.map(
                    ([key, value], objIndex) => {
                      return (
                        <Grid item sm={12}>
                          <div className="py-1">
                            <h4 style={{ color: "#e65550", fontWeight: "600" }}>
                              {categories.find((x) => x._id === key).name}
                            </h4>
                            <hr />
                          </div>
                          <Grid container spacing={1}>
                            {value
                              ?.sort((a, b) => a.order - b.order)
                              .map((x, index) => (
                                <React.Fragment>
                                  <Grid item xs={3} sm={3}>
                                    <Paper
                                      className="px-2 py-3 header-menu-list-item"
                                      key={x.temp_id}
                                      id={x.temp_id}
                                      draggable
                                      onDragStart={handleDrag}
                                      onDrop={(ev) => handleDrop(ev, key)}
                                      onDragOver={(ev) => ev.preventDefault()}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "150px",
                                      }}
                                    >
                                      <Grid container spacing={1}>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={2}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <DragHandleOutlined
                                            style={{ cursor: "pointer" }}
                                            color="disabled"
                                          />
                                        </Grid>

                                        <Grid item xs={12} sm={10}>
                                          <div
                                            style={{
                                              width: "100%",
                                              height: "120px",
                                            }}
                                          >
                                            <img
                                              src={x.featured_img}
                                              alt=""
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "contain",
                                              }}
                                            />
                                          </div>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          style={{ position: "relative" }}
                                        >
                                          <small
                                            className="mb-0"
                                            style={{
                                              position: "absolute",
                                              bottom: 0,
                                              left: 0,
                                              width: "100%",
                                              textAlign: "center",
                                              background: "rgba(0,0,0,0.5)",
                                              color: "#fff",
                                              padding: "0.5rem",
                                            }}
                                          >
                                            {x.name.substring(0, 60)}
                                          </small>
                                        </Grid>
                                      </Grid>
                                    </Paper>
                                  </Grid>
                                </React.Fragment>
                              ))}
                          </Grid>
                          <hr />
                        </Grid>
                      );
                    }
                  )}

                  <Grid
                    item
                    xs={12}
                    style={{
                      alignItems: "flex-end",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <MaterialButton
                      onClick={() => handleSubmit("menuItems")}
                      color="primary"
                      variant="contained"
                    >
                      Update Section
                    </MaterialButton>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
