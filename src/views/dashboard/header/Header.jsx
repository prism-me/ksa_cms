import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import MaterialButton from "@material-ui/core/Button";
import {
  Card,
  CardHeader,
  CustomInput,
  CardBody,
  Label,
  FormGroup,
} from "reactstrap";
import { TextField, Paper } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { API } from "../../../http/API";
import {
  AddCircleOutline,
  CloseOutlined,
  DragHandleOutlined,
} from "@material-ui/icons";

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

export default function UpdateHeader() {
  const classes = useStyles();
  const initialObject = {
    menuItems: [],
    menuId: null,
    contactId: null,
    contact: {
      phone: "",
      email: "",
      address: "",
    },

    page_id: "",
    widget_name: "header",
    widget_type: "header",
    widget_content: {},
  };
  const [dragId, setDragId] = useState();
  const [submenuDragId, setSubmenuDragId] = useState();
  const [headerContent, setHeaderContent] = useState({ ...initialObject });
  const [pages, setPages] = useState([]);
  const [pagesFilter, setPagesFilter] = useState([]);
  const [currentPage, setCurrentPage] = useState([]);

  //!--------------------------
  const [pageData, setPageData] = useState();

  //!------Pages Api Call---------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find((x) => x.slug === "header");
          setPageData(response.data);
          setCurrentPage(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              let widget_content =
                res.data?.[res.data.length - 1]?.widget_content;
              widget_content.menuItems = widget_content.menuItems?.map(
                (x, index) => {
                  return {
                    ...x,
                    order: x.order || index + 1,
                    temp_id: x.temp_id || index + 1,
                  };
                }
              );

              setHeaderContent({ ...initialObject, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleMenuItemChange = (e, route, index, inner_route) => {
    let updatedItems = [...headerContent.menuItems];
    updatedItems[index][e.target.name] = e.target.value;
    updatedItems[index]["address"] = route;
    updatedItems[index]["inner_route"] = inner_route;
    setHeaderContent({ ...headerContent, menuItems: updatedItems });
    // setPagesFilter(pagesFilter.filter(x => x.post_name !== e.target.value))
  };

  const handleSubMenuItemChange = (e, route, index, ind, inner_route) => {
    let updatedHeaderContent = { ...headerContent };
    let updatedSubMenu = [...updatedHeaderContent.menuItems[index].subMenu];

    if (updatedSubMenu.find((x) => x.text === e.target.value)?.text) {
      alert("Submenu item already added. Please select different");
      return;
    }

    updatedSubMenu[ind][e.target.name] = e.target.value;
    updatedSubMenu[ind]["address"] = route;
    updatedSubMenu[ind]["inner_route"] = inner_route;
    updatedSubMenu[ind]["base_url"] = inner_route;

    updatedHeaderContent.menuItems[index].subMenu = updatedSubMenu;
    setHeaderContent(updatedHeaderContent);
    // setPagesFilter(pagesFilter.filter(x => x.post_name !== e.target.value))
  };

  const handleContactItemChange = (e) => {
    let updatedContact = { ...headerContent.contact };
    updatedContact[e.target.name] = e.target.value;
    setHeaderContent({ ...headerContent, contact: updatedContact });
  };

  const addNewLink = () => {
    let updatedHeaderContent = { ...headerContent };
    let updatedData = [...updatedHeaderContent.widget_content.menuItems];
    let updateMenu = [
      ...updatedData,
      {
        text: "",
        address: "",
        order: updatedData.length + 1,
        temp_id: updatedData.length + 1,
      },
    ];
    updatedHeaderContent.widget_content.menuItems = updateMenu;

    setHeaderContent(updatedHeaderContent);
  };

  const addSubmenu = (index) => {
    setHeaderContent({
      ...headerContent,
      menuItems: [
        ...headerContent.menuItems,
        {
          text: "",
          address: "",
          temp_id: headerContent.menuItems.length + 1,
          order: headerContent.menuItems.length + 1,
          inner_route: "",
        },
      ],
    });

    let updatedHeaderContent = { ...headerContent };

    let subMenu = updatedHeaderContent.menuItems[index].subMenu || [];

    updatedHeaderContent.menuItems[index].subMenu = [
      ...subMenu,
      {
        text: "",
        address: "",
        base_url: "",
        temp_id: subMenu.length + 1,
        order: subMenu.length + 1,
        inner_route: "",
      },
    ];

    setHeaderContent(updatedHeaderContent);
  };

  const deleteSubmenuLink = (index, ind) => {
    let updatedHeaderContent = { ...headerContent };
    let updatedSubMenu = updatedHeaderContent.menuItems[index].subMenu?.filter(
      (x, i) => i !== ind
    );
    updatedHeaderContent.menuItems[index].subMenu = updatedSubMenu;
    setHeaderContent(updatedHeaderContent);
  };

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    const dragBox = headerContent.widget_content.menuItems.find(
      (box) => box.temp_id == dragId
    );
    const dropBox = headerContent.widget_content.menuItems.find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    if (dragBoxOrder == dropBoxOrder) {
      return;
    }

    const updatedMenuItems = headerContent.widget_content.menuItems.map(
      (box) => {
        if (box.temp_id == dragId) {
          box.order = dropBoxOrder;
        }
        if (box.temp_id == ev.currentTarget.id) {
          box.order = dragBoxOrder;
        }
        return box;
      }
    );

    setHeaderContent({
      ...headerContent,
      widget_content: {
        ...headerContent.widget_content,
        menuItems: updatedMenuItems,
      },
    });
  };

  const handleSubMenuDrag = (ev) => {
    setSubmenuDragId(ev.currentTarget.id);
  };

  const handleSubMenuDrop = (ev, index) => {
    const dragBox = headerContent.menuItems[index]?.subMenu?.find(
      (box) => box.temp_id == submenuDragId
    );
    const dropBox = headerContent.menuItems[index]?.subMenu?.find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const updatedSubMenuItems = headerContent.menuItems[index]?.subMenu?.map(
      (box) => {
        if (box.temp_id == submenuDragId) {
          box.order = dropBoxOrder;
        }
        if (box.temp_id == ev.currentTarget.id) {
          box.order = dragBoxOrder;
        }
        return box;
      }
    );
    let updatedHeaderContent = { ...headerContent };
    updatedHeaderContent.menuItems[index].subMenu = updatedSubMenuItems;

    setHeaderContent(updatedHeaderContent);
  };

  const handleSelect = (e, index, name) => {
    let updateValue = { ...headerContent };
    let updateList = [...updateValue.widget_content.menuItems];
    updateList[index][name] = e.target.value;
    updateList[index]["address"] = e.target.value;
    updateValue.widget_content.menuItems = updateList;
    setHeaderContent(updateValue);
  };

  const handleRemove = (index) => {
    let updateValue = { ...headerContent };
    let updateRoute = updateValue.widget_content.menuItems.filter(
      (x, i) => i !== index
    );
    updateValue.widget_content.menuItems = updateRoute;
    setHeaderContent(updateValue);
  };

  const handleSubmit = (section) => {
    let updatedData = { ...headerContent, page_id: currentPage._id };
    API.post(`/widgets`, updatedData)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert("Header Menu Updated");
          console.log("Submit response", response);
        }
      })
      .catch((err) => console.log(err));
    // console.log(updatedData);
    // let updatedHeaderContent = {
    //   ...headerContent,
    //   menuItems: headerContent.menuItems.filter((x) => x.text !== ""),
    // };
    // let id =
    //   section === "menuItems"
    //     ? updatedHeaderContent.menuId
    //     : updatedHeaderContent.contactId;
    // API[id ? "put" : "post"](id ? `/widget/${id}` : `/widget`, {
    //   widget_type: "header",
    //   widget_name: section,
    //   items: updatedHeaderContent[section],
    // })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       alert(response.data.message);
    //       // window.location.reload();
    //       // setHeaderContent({ ...initialObject }); //resetting the form
    //     }
    //   })
    //   .catch((err) => alert("Something went wrong"));
  };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Update Site Header</h4>
          </CardHeader>
          <CardBody className="">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Menu Items (Drawer Menu)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2"></h4> */}
                <Grid container spacing={2}>
                  {/* <Grid item xs={12}>
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <Grid container spacing={2}>
                      {headerContent?.widget_content?.menuItems
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
                                <Grid
                                  container
                                  spacing={1}
                                  className="d-flex align-items-center"
                                >
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

                                  <Grid item xs={12} sm={3}>
                                    <FormGroup>
                                      <Label for="text">Select Route</Label>
                                      <CustomInput
                                        type="select"
                                        name="text"
                                        id="text"
                                        value={x.text}
                                        onChange={(e) => {
                                          handleSelect(e, index, "text");
                                        }}
                                      >
                                        <option value="all">
                                          Select Route
                                        </option>

                                        {pageData?.map((x) => (
                                          <React.Fragment key={x._id}>
                                            <option value={x.route}>
                                              {x.title}
                                            </option>
                                          </React.Fragment>
                                        ))}
                                      </CustomInput>
                                    </FormGroup>
                                  </Grid>
                                  <Grid item xs={12} sm={3}>
                                    <TextField
                                      required
                                      id={`address${x.temp_id}`}
                                      name="address"
                                      label="URL"
                                      value={
                                        x.text
                                        // pages.find(
                                        //   (p) =>
                                        //     p.post_name?.toLowerCase() ===
                                        //     x.text?.toLowerCase()
                                        // )?.route || ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                      onChange={(e) => {
                                        handleSelect(e, index, "address");
                                      }}
                                      // size="small"
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={3}>
                                    <TextField
                                      required
                                      id={`arabic${x.temp_id}`}
                                      name="title"
                                      label="Arabic"
                                      value={
                                        pageData.find(
                                          (p) =>
                                            p.route?.toLowerCase() ===
                                            x.address?.toLowerCase()
                                        )?.arabic?.title || ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                      // size="small"
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={2}>
                                    <MaterialButton
                                      onClick={
                                        () => handleRemove(index)
                                        // setHeaderContent({
                                        //   ...headerContent,
                                        //   menuItems:
                                        //     headerContent.menuItems.filter(
                                        //       (z) => z.temp_id !== x.temp_id
                                        //     ),
                                        // })
                                      }
                                      color="secondary"
                                      size="small"
                                      variant="outlined"
                                      // style={{ height: "100%" }}
                                    >
                                      Delete Link
                                    </MaterialButton>
                                  </Grid>
                                </Grid>

                                {/* ************************* */}
                                {/* SUBMENU LOGIC STARTS HERE */}
                                {/* ************************* */}
                                <div
                                  className={
                                    x.subMenu?.length > 0 ? "" : "d-none"
                                  }
                                  style={{
                                    border: "1px dashed #3f50b5",
                                    borderRadius: "4px",
                                    margin: "1rem 0",
                                    padding: "1rem",
                                  }}
                                >
                                  <Typography color="primary" variant="caption">
                                    SUBMENU
                                  </Typography>
                                  {x.subMenu
                                    ?.sort((a, b) => a.order - b.order)
                                    .map((y, ind) => (
                                      <Paper
                                        className="px-2 py-2 mt-2 header-menu-list-item"
                                        key={y.temp_id}
                                        id={y.temp_id}
                                        draggable
                                        onDragStart={handleSubMenuDrag}
                                        onDrop={(ev) =>
                                          handleSubMenuDrop(ev, index)
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
                                            {pages?.length > 0 && (
                                              <Autocomplete
                                                id={`text${y.temp_id}`}
                                                name="text"
                                                options={pages}
                                                size="small"
                                                value={
                                                  pages.find(
                                                    (p) =>
                                                      p.post_name?.toLowerCase() ===
                                                      y.text?.toLowerCase()
                                                  ) || { post_name: "" }
                                                }
                                                onChange={(e, newValue) =>
                                                  handleSubMenuItemChange(
                                                    {
                                                      target: {
                                                        value:
                                                          newValue?.post_name,
                                                        name: "text",
                                                      },
                                                    },
                                                    newValue.route,
                                                    index,
                                                    ind,
                                                    pages.find(
                                                      (p) =>
                                                        p.post_name?.toLowerCase() ===
                                                        newValue?.post_name?.toLowerCase()
                                                    )?.inner_route
                                                  ) || ""
                                                }
                                                getOptionLabel={(option) =>
                                                  option.post_name
                                                }
                                                // style={{ width: 300 }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    required
                                                    {...params}
                                                    label="Select Link Text"
                                                    variant="outlined"
                                                  />
                                                )}
                                              />
                                            )}
                                          </Grid>
                                          <Grid item xs={12} sm={4}>
                                            <TextField
                                              required
                                              id={`address${y.temp_id}`}
                                              name="address"
                                              label="URL"
                                              value={
                                                pages.find(
                                                  (p) =>
                                                    p.post_name?.toLowerCase() ===
                                                    y.text?.toLowerCase()
                                                )?.route || ""
                                              }
                                              variant="outlined"
                                              fullWidth
                                              disabled
                                              onChange={(e) =>
                                                handleSubMenuItemChange(e, ind)
                                              }
                                              size="small"
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            sm={1}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            <CloseOutlined
                                              onClick={() =>
                                                deleteSubmenuLink(index, ind)
                                              }
                                              color="secondary"
                                              fontSize="small"
                                              variant="outlined"
                                              style={{ cursor: "pointer" }}
                                            />
                                          </Grid>

                                          {/* <Grid item xs={12} sm={1} style={{ display: 'flex', alignItems: 'center' }}>
                                        <AddCircleOutline style={{ cursor: 'pointer' }} onClick={() => addSubmenu(ind)} color="primary" />
                                      </Grid> */}
                                        </Grid>
                                      </Paper>
                                    ))}
                                </div>
                                {/* ************************* */}
                                {/* SUBMENU LOGIC ENDS HERE */}
                                {/* ************************* */}
                              </Paper>
                            </Grid>
                          </React.Fragment>
                        ))}

                      <Grid item xs={12}>
                        <MaterialButton
                          variant="outlined"
                          component="span"
                          className={"mb-3"}
                          // size="small"
                          color="primary"
                          onClick={addNewLink}
                        >
                          Add a New Link
                        </MaterialButton>
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
                          disabled={
                            headerContent?.widget_content?.menuItems?.length < 1
                          }
                          onClick={() => handleSubmit("menuItems")}
                          color="primary"
                          variant="contained"
                        >
                          Update Section
                        </MaterialButton>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid item xs={12} sm={4}>
                    <p>Drag and Drop the items to Re-Arrange the order</p>
                    {
                      headerContent.menuItems?.length > 0 ?

                        <Paper>
                          <List component="nav" aria-label="main mailbox folders">
                            {
                              headerContent?.menuItems?.sort((a, b) => a.order - b.order).map(x => (
                                <ListItem key={x.text} style={{ borderBottom: '1px solid #ddd', zIndex: 9999 }} button id={x.temp_id} draggable onDragStart={handleDrag} onDrop={handleDrop} onDragOver={(ev) => ev.preventDefault()} >
                                  <ListItemText primary={x.text} />
                                </ListItem>
                              ))
                            }
                          </List>
                        </Paper>
                        :
                        <em>No items added yet</em>
                    }
                  </Grid> */}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>
                  Header Contact Links
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2"></h4> */}
                <Grid container spacing={2}>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      value={headerContent.contact.phone}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="email"
                      name="email"
                      label="Email Address"
                      value={headerContent.contact.email}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="address"
                      name="address"
                      label="Location"
                      value={headerContent.contact.address}
                      variant="outlined"
                      fullWidth
                      onChange={handleContactItemChange}
                      size="small"
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <MaterialButton
                      onClick={() => handleSubmit("contact")}
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
