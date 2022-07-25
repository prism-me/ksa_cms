import React, { Fragment, Suspense, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from "@material-ui/core/Grid";
// import Paper from '@material-ui/core/Paper';

// import Button from "components/CustomButtons/Button.js";
import MaterialButton from "@material-ui/core/Button";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// // import CardAvatar from "components/Card/CardAvatar.js";
// import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";

// import avatar from "assets/img/faces/marc.jpg";
import { TextField, Paper, IconButton } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Snackbar from "@material-ui/core/Snackbar";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { API } from "../../../http/API";
import { CloseOutlined } from "@material-ui/icons";
import {
  Card,
  CardHeader,
  CardTitle,
  CustomInput,
  CardBody,
  Button,
  Label,
  FormGroup,
  Col,
  Row,
  UncontrolledCollapse,
} from "reactstrap";

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

export default function UpdateFooter() {
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);
  const initialObject = {
    first: {
      description: "",
    },
    second: {
      links: [],
    },
    third: {
      phone: "",
      email: "",
      address: "",
    },
    social: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  };

  const [openSnackAlert, setOpenSnackAlert] = useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const [dragId, setDragId] = useState();
  const [footerContent, setFooterContent] = useState({ ...initialObject });
  const [pages, setPages] = useState([]);
  const [pagesFilter, setPagesFilter] = useState([]);

  //   useEffect(() => {
  //     async function getData() {
  //       const menuItems = await getFooterData();
  //       API.get("/pages").then((response) => {
  //         setPages(response.data);
  //         let filteredArray = response.data?.filter(function (array_el) {
  //           return (
  //             menuItems.filter(function (menuItems_el) {
  //               return menuItems_el.text == array_el.post_name;
  //             }).length == 0
  //           );
  //         });
  //         setPagesFilter(filteredArray);
  //         // })
  //       });
  //     }
  //     getData();
  //   }, []);

  const getFooterData = async () => {
    const response = await API.get("/get_widgets/footer");
    if (response.status === 200) {
      const { data } = response;
      const first = data.find((x) => x.widget_name === "first");
      const second = data.find((x) => x.widget_name === "second");
      const third = data.find((x) => x.widget_name === "third");
      const social = data.find((x) => x.widget_name === "social");
      setFooterContent({
        first: first
          ? { id: first.id, ...JSON.parse(first.items) }
          : initialObject.first,
        second: second
          ? { id: second.id, ...JSON.parse(second.items) }
          : initialObject.second,
        third: third
          ? { id: third.id, ...JSON.parse(third.items) }
          : initialObject.third,
        social: social
          ? { id: social.id, ...JSON.parse(social.items) }
          : initialObject.social,
      });
      return second?.links
        ? JSON.parse(second?.links)
        : initialObject.second.links;
    } else {
      return [];
    }
    // })
  };

  const handleInputChange = (e, section) => {
    let updatedFooterContent = { ...footerContent };
    updatedFooterContent[section][e.target.name] = e.target.value;
    setFooterContent(updatedFooterContent);
  };

  const handleLinkChange = (e, index, section) => {
    let updatedFooterContent = { ...footerContent };
    updatedFooterContent[section].links[index][e.target.name] = e.target.value;
    setFooterContent(updatedFooterContent);
  };

  const addNewLink = () => {
    if (footerContent.second.links?.length > 0) {
      setPagesFilter(
        pagesFilter.filter(
          (x) =>
            x.post_name !==
            footerContent.second.links[footerContent.second.links.length - 1]
              ?.text
        )
      );
    }
    setFooterContent({
      ...footerContent,
      second: {
        ...footerContent.second,
        links: [
          ...footerContent.second.links,
          {
            text: "",
            address: "",
            temp_id: footerContent.second.links.length + 1,
            order: footerContent.second.links.length + 1,
            inner_route: "",
          },
        ],
      },
    });
  };

  const handleMenuItemChange = (e, index, route, inner_route) => {
    let updatedItems = [...footerContent.second.links];
    updatedItems[index][e.target.name] = e.target.value;
    updatedItems[index]["inner_route"] = inner_route;
    updatedItems[index]["address"] = route;
    setFooterContent({
      ...footerContent,
      second: { ...footerContent.second, links: updatedItems },
    });
    // setPagesFilter(pagesFilter.filter(x => x.post_name !== e.target.value))
  };

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    const dragBox = footerContent.second.links.find(
      (box) => box.temp_id == dragId
    );
    const dropBox = footerContent.second.links.find(
      (box) => box.temp_id == ev.currentTarget.id
    );

    const dragBoxOrder = dragBox.order;
    const dropBoxOrder = dropBox.order;

    const updatedMenuItems = footerContent.second.links.map((box) => {
      if (box.temp_id == dragId) {
        box.order = dropBoxOrder;
      }
      if (box.temp_id == ev.currentTarget.id) {
        box.order = dragBoxOrder;
      }
      return box;
    });

    setFooterContent({
      ...footerContent,
      second: { ...footerContent.second, links: updatedMenuItems },
    });
  };

  const handleSubmit = (section) => {
    API[footerContent[section]?.id ? "put" : "post"](
      footerContent[section]?.id
        ? `/widget/${footerContent[section]?.id}`
        : `/widget`,
      {
        widget_type: "footer",
        widget_name: section,
        items: footerContent[section],
      }
    )
      .then((response) => {
        if (response.status === 200) {
          // alert(response.data.message);
          setMessageInfo((prev) => [
            ...prev,
            { message: response.data.message, key: new Date().getTime() },
          ]);
          setOpenSnackAlert(true);
          // setFooterContent({ ...initialObject }); //resetting the form
        }
      })
      .catch((err) => alert("Something went wrong"));
  };

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary">
            <h4 className="mb-0">Update Site Footer</h4>
          </CardHeader>

          <CardBody className="">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  First Column - About
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-2">First Column (About)</h4> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="description"
                      name="description"
                      label="About Description"
                      value={footerContent.first.description}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      rowsMax={4}
                      onChange={(e) => handleInputChange(e, "first")}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton
                      onClick={() => handleSubmit("first")}
                      color="primary"
                      variant="contained"
                    >
                      Update Section
                    </MaterialButton>
                  </Grid>
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
                  Second Column - Services
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <h4 className="mt-4"></h4> */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Grid container spacing={2}>
                      {footerContent.second?.links
                        ?.sort((a, b) => a.order - b.order)
                        .map((x, index) => (
                          <React.Fragment key={x.temp_id}>
                            <Grid item xs={12} sm={4}>
                              {pages?.length > 0 && (
                                <Autocomplete
                                  id={`text${x.temp_id}`}
                                  name="text"
                                  options={pagesFilter}
                                  size="small"
                                  value={
                                    pages.find(
                                      (p) =>
                                        p.post_name?.toLowerCase() ===
                                        x.text?.toLowerCase()
                                    ) || { post_name: "" }
                                  }
                                  onChange={(e, newValue) =>
                                    handleMenuItemChange(
                                      {
                                        target: {
                                          value: newValue?.post_name,
                                          name: "text",
                                        },
                                      },
                                      index,
                                      newValue?.route,
                                      pages.find(
                                        (p) =>
                                          p.post_name?.toLowerCase() ===
                                          newValue?.post_name?.toLowerCase()
                                      )?.inner_route
                                    ) || ""
                                  }
                                  getOptionLabel={(option) => option.post_name}
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
                                id={`address${x.temp_id}`}
                                name="address"
                                label="URL"
                                value={
                                  pages.find(
                                    (p) =>
                                      p.post_name?.toLowerCase() ===
                                      x.text?.toLowerCase()
                                  )?.route || ""
                                }
                                variant="outlined"
                                fullWidth
                                disabled
                                onChange={(e) => handleMenuItemChange(e, index)}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <MaterialButton
                                onClick={() =>
                                  setFooterContent({
                                    ...footerContent,
                                    second: {
                                      ...footerContent.second,
                                      links: footerContent.second.links.filter(
                                        (z) => z.temp_id !== x.temp_id
                                      ),
                                    },
                                  })
                                }
                                color="secondary"
                                size="small"
                                variant="outlined"
                                style={{ height: "100%" }}
                              >
                                Delete Link
                              </MaterialButton>
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
                      <Grid item xs={12}>
                        <MaterialButton
                          disabled={footerContent.second.links?.length < 1}
                          onClick={() => handleSubmit("second")}
                          color="primary"
                          variant="contained"
                        >
                          Update Section
                        </MaterialButton>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <p>Drag and Drop the items to Re-Arrange the order</p>
                    {footerContent.second?.links?.length > 0 ? (
                      <Paper>
                        <List component="nav" aria-label="main mailbox folders">
                          {footerContent.second?.links
                            ?.sort((a, b) => a.order - b.order)
                            .map((x) => (
                              <ListItem
                                key={x.text}
                                style={{
                                  borderBottom: "1px solid #ddd",
                                  zIndex: 9999,
                                }}
                                button
                                id={x.temp_id}
                                draggable
                                onDragStart={handleDrag}
                                onDrop={handleDrop}
                                onDragOver={(ev) => ev.preventDefault()}
                              >
                                <ListItemText primary={x.text} />
                              </ListItem>
                            ))}
                        </List>
                      </Paper>
                    ) : (
                      <em>No items added yet</em>
                    )}
                  </Grid>
                </Grid>
                {/* <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MaterialButton
                      variant="outlined"
                      component="span"
                      className={classes.button}
                      size="small"
                      color="primary"
                      onClick={addNewLink}
                    >
                      Add a New Link
                    </MaterialButton>
                  </Grid>
                  {
                    footerContent?.second?.links?.map((x, index) => (
                      <React.Fragment>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            required
                            id={`text${x.id}`}
                            name="text"
                            label="Link Text"
                            value={x.text}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => handleLinkChange(e, index, 'second')}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            required
                            id={`address${x.id}`}
                            name="address"
                            label="Link Address"
                            value={x.address}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => handleLinkChange(e, index, 'second')}
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <MaterialButton onClick={() => setFooterContent({ ...footerContent, second: { ...footerContent.second, links: footerContent.second.links.filter(z => z.id !== x.id) } })} color="secondary" size="small" variant="outlined" style={{ height: '100%' }}>
                            Delete Link
                          </MaterialButton>
                        </Grid>
                      </React.Fragment>
                    ))
                  }
                  <Grid item xs={12} sm={12}>
                    <MaterialButton disabled={footerContent.second.links < 1} onClick={() => handleSubmit("second")} color="primary" variant="contained">
                      Update Section
                  </MaterialButton>
                  </Grid>
                </Grid> */}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography className={classes.heading}>
                  Third Column - Contact Us
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      value={footerContent.third.phone}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "third")}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="email"
                      name="email"
                      label="Email Address"
                      value={footerContent.third.email}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "third")}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="address"
                      name="address"
                      label="Location"
                      value={footerContent.third.address}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "third")}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <MaterialButton
                      onClick={() => handleSubmit("third")}
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
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={openSnackAlert}
        autoHideDuration={3000}
        onClose={() => setOpenSnackAlert(false)}
        onExited={() => setOpenSnackAlert(false)}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <React.Fragment>
            <Button
              color="secondary"
              size="small"
              onClick={() => setOpenSnackAlert(false)}
            >
              OK
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={() => setOpenSnackAlert(false)}
            >
              <CloseOutlined />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
