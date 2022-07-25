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

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

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
              sub_category: x.sub_category,
              featured_img: x.featured_img,
              order: x.order || index + 1,
              temp_id: x.order || index + 1,
              finalOrder:
                x.finalOrder ||
                `${x.category_order?.order || index + 1}${x.sub_category_order?.order || index + 1}${x.order || index + 1}`,
            };
          }),
          "category"
        );
        setGroupedProducts(groupedProducts);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev, objKey) => {
    let updatedGroupedProducts = { ...groupedProducts };

    const dragBox = updatedGroupedProducts[objKey].find(
      (box) => box.temp_id == dragId
    );
    const dropBox = updatedGroupedProducts[objKey].find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    // finding category order of dragged and dropped positions (products)
    const dragCategoryOrder = categories.find((x) => x._id === dragBox.category)
      ?.order;
    const dropCategoryOrder = categories.find((x) => x._id === dropBox.category)
      ?.order;

    // finding sub-category order of dragged and dropped positions (products)
    const dragSubCategoryOrder = categories
      .find((x) => x._id === dragBox.category)
      ?.children?.find((x) => x._id === dragBox.sub_category)?.order;
    const dropSubCategoryOrder = categories
      .find((x) => x._id === dropBox.category)
      ?.children?.find((x) => x._id === dropBox.sub_category)?.order;

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    // calculating 3-digit order for product drag and drop
    const finalDragOrder = `${dragCategoryOrder}${dragSubCategoryOrder}${dragBox.order}`;
    const finalDropOrder = `${dropCategoryOrder}${dropSubCategoryOrder}${dropBox.order}`;

    if (dragBoxOrder == dropBoxOrder) {
      return;
    }
    const updatedProducts = updatedGroupedProducts[objKey].map((box) => {
      if (box.temp_id == dragId) {
        // for relative ordering
        box.order = dropBoxOrder;
        box.finalOrder = finalDropOrder;
        // for absolute ordering
      }
      if (box.temp_id == ev.currentTarget.id) {
        // for relative ordering
        box.order = dragBoxOrder;
        // for absolute ordering
        box.finalOrder = finalDragOrder;
      }
      return box;
    });

    updatedGroupedProducts[objKey] = updatedProducts;

    setGroupedProducts(updatedGroupedProducts);
  };

  const handleSubmit = () => {
    let flattenedGroups = [];

    // because all products are in groups based on categories, we will flatten the object to append all the arrays in a single array
    flattenedGroups = Object.entries(groupedProducts)?.map(([key, value]) => {
      return [...flattenedGroups, ...value];
    });

    // flattening all the items of array to a single array. (so we will again have all the products in to single array with updated data)
    // [[1,2,3],[4,5,6],...] ==> [1,2,3,4,5,6,...]
    var mergedProducts = [].concat.apply([], flattenedGroups);

    // debugger;
    // return;

    API.post(`/product_sorting`, mergedProducts)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert("Products sorting updated");
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
            <h4 className="mb-0">Products Sorting (Category-Wise)</h4>
          </CardHeader>
          <CardBody className="">
            {Object.entries(groupedProducts)?.map(([key, value], objIndex) => {
              return (
                <Accordion
                  expanded={expanded === `panel_${objIndex}`}
                  onChange={handleChange(`panel_${objIndex}`)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <h5 style={{ color: "#e65550", fontWeight: "500" }}>
                      {categories.find((x) => x._id === key).name}
                    </h5>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* <h4 className="mt-2"></h4> */}
                    <Grid container spacing={2}>
                      {/* <Grid item xs={12}></Grid> */}
                      <Grid item sm={12}>
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
              );
            })}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
