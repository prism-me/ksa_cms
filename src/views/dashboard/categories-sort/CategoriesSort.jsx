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

export default function CategoriesSort() {
  const classes = useStyles();

  const [dragId, setDragId] = useState();
  const [subCategoryDragId, setSubCategoryDragId] = useState();

  const [categories, setCategories] = useState([]);

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
                  temp_id: x.order || index + 1,
                  children: x.children?.map((y, ind) => {
                    return {
                      _id: y._id,
                      name: y.name,
                      order: y.order || ind + 1,
                      temp_id: y.order || ind + 1,
                    };
                  }),
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

  const handleDrop = (ev) => {
    const dragBox = categories.find((box) => box.temp_id == dragId);
    const dropBox = categories.find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    if (dragBoxOrder == dropBoxOrder) {
      return;
    }

    const updatedCategories = categories.map((box) => {
      if (box.temp_id == dragId) {
        box.order = dropBoxOrder;
      }
      if (box.temp_id == ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });

    setCategories(updatedCategories);
  };

  const handleSubCategoryDrag = (ev) => {
    setSubCategoryDragId(ev.currentTarget.id);
  };

  const handleSubCategoryDrop = (ev, index) => {
    const dragBox = categories[index]?.children?.find(
      (box) => box.temp_id == subCategoryDragId
    );
    const dropBox = categories[index]?.children?.find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const updatedSubCategoryItems = categories[index]?.children?.map((box) => {
      if (box.temp_id == subCategoryDragId) {
        box.order = dropBoxOrder;
      }
      if (box.temp_id == ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });
    let updatedCategories = [...categories];
    updatedCategories[index].children = updatedSubCategoryItems;

    setCategories(updatedCategories);
  };

  const handleSubmit = () => {
    
    API.post(`/category_sorting`, categories)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert("Categories sorting updated")
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
            <h4 className="mb-0">Categories Sorting</h4>
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
                  Categories
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2"></h4> */}
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <Grid container spacing={2}>
                      {categories
                        ?.sort((a, b) => a.order - b.order)
                        .map((x, index) => (
                          <React.Fragment>
                            <Grid item xs={12} sm={12}>
                              <Paper
                                className="px-2 py-3 header-menu-list-item"
                                key={x.temp_id}
                                id={x.temp_id}
                                draggable
                                onDragStart={handleDrag}
                                onDrop={handleDrop}
                                onDragOver={(ev) => ev.preventDefault()}
                              >
                                <Grid container spacing={1}>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={1}
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

                                  <Grid item xs={12} sm={8}>
                                    <h5>{x.name}</h5>
                                  </Grid>
                                </Grid>

                                {/* ************************* */}
                                {/* SUBCATEGORY LOGIC STARTS HERE */}
                                {/* ************************* */}
                                <div
                                  className={
                                    x.children?.length > 0 ? "" : "d-none"
                                  }
                                  style={{
                                    border: "1px dashed #3f50b5",
                                    borderRadius: "4px",
                                    margin: "1rem 0",
                                    padding: "1rem",
                                  }}
                                >
                                  <Typography color="primary" variant="caption">
                                    SUBCATEGORIES
                                  </Typography>
                                  {x.children
                                    ?.sort((a, b) => a.order - b.order)
                                    .map((y, ind) => (
                                      <Paper
                                        className="px-2 py-2 mt-2 header-menu-list-item"
                                        key={y.temp_id}
                                        id={y.temp_id}
                                        draggable
                                        onDragStart={handleSubCategoryDrag}
                                        onDrop={(ev) =>
                                          handleSubCategoryDrop(ev, index)
                                        }
                                        onDragOver={(ev) => ev.preventDefault()}
                                      >
                                        <Grid container spacing={1}>
                                          <Grid
                                            item
                                            xs={12}
                                            sm={1}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          ></Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            sm={1}
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

                                          <Grid item xs={12} sm={4}>
                                            {y.name}
                                          </Grid>
                                        </Grid>
                                      </Paper>
                                    ))}
                                </div>
                                {/* ************************* */}
                                {/* SUBCATEGORY LOGIC ENDS HERE */}
                                {/* ************************* */}
                              </Paper>
                            </Grid>
                          </React.Fragment>
                        ))}

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
