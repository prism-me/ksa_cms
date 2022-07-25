import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Button,
  Label,
  Col,
  Row,
  UncontrolledCollapse,
  Input,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./Mission.scss";

import CKEditor from "ckeditor4-react";
import { API } from "../../../../http/API";
import { initial } from "lodash";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});
const initialObj = {
  widget_name: "mission-vision",
  page_id: 0,
  widget_type: "mission-vision",
  widget_content: {
    sectionOne: {
      title: "",
      content: "",
    },
    sectionTwo: {
      title: "",
      content: "",
    },
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },

    arabic: {
      sectionOne: {
        title: "",
        content: "",
      },
      sectionTwo: {
        title: "",
        content: "",
      },
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
    },
  },
};

const mapStateToProps = (props) => {
  return {
    dataLog: props.auth,
  };
};


const Mission = (props) => {
  const { id } = useParams();
  const [missionData, setMissionData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();

  //!------------Pages Api Call------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find(
            (x) => x.slug === "mission-vision"
          );
          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              if (
                !res.data?.widget_content &&
                !res.data[res.data.length - 1].widget_content
              ) {
                res.data.widget_content = initialObj.widget_content;
              }
              if (
                !res.data[res.data.length - 1].widget_content.meta_details
                  .schema_markup
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.meta_details.schema_markup =
                  initialObj.widget_content.meta_details.schema_markup;
              }
              if (
                !res.data[res.data.length - 1].widget_content.arabic
                  .meta_details.schema_markup
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.meta_details.schema_markup =
                  initialObj.widget_content.arabic.meta_details.schema_markup;
              }

              let widget_content =
                res.data?.[res.data.length - 1].widget_content;

              // console.log("All widgets response", widget_content);
              setMissionData({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!-----------Handle Mission OnChnage ---------
  const handleMissionOnChange = (e) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.sectionOne;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.sectionOne = update;
    setMissionData(updatedValue);
  };
  //!-----------Handle Mission Editor ---------
  const handleMissionEditor = (value) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.sectionOne;
    update.content = value;
    updatedValue.widget_content.sectionOne = update;
    setMissionData(updatedValue);
  };
  //!-----------Handle vision OnChnage ---------
  const handlevisionOnChange = (e) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.sectionTwo;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.sectionTwo = update;
    setMissionData(updatedValue);
  };
  //!-----------Handle vision Editor ---------
  const handlevisionEditor = (value) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.sectionTwo;
    update.content = value;
    updatedValue.widget_content.sectionTwo = update;
    setMissionData(updatedValue);
  };
  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...missionData };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setMissionData(updatedValue);
  };
  //! ****************************************************
  //? ***************Arabic Function*******************
  //! ****************************************************
  //!-----------Handle Mission OnChnage ---------
  const handleArabicMissionOnChange = (e) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.arabic.sectionOne;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.arabic.sectionOne = update;
    setMissionData(updatedValue);
  };
  //!-----------Handle Mission Editor ---------
  const handleArabicMissionEditor = (value) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.arabic.sectionOne;
    update.content = value;
    updatedValue.widget_content.arabic.sectionOne = update;
    setMissionData(updatedValue);
  };
  //!-----------Handle vision OnChnage ---------
  const handleArabicvisionOnChange = (e) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.arabic.sectionTwo;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.arabic.sectionTwo = update;
    setMissionData(updatedValue);
  };
  //!-----------Handle vision Editor ---------
  const handleArabicvisionEditor = (value) => {
    let updatedValue = { ...missionData };
    let update = updatedValue.widget_content.arabic.sectionTwo;
    update.content = value;
    updatedValue.widget_content.arabic.sectionTwo = update;
    setMissionData(updatedValue);
  };
  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...missionData };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setMissionData(updatedValue);
  };

  //! ****************Handle Submit**************
  const handleSubmit = () => {
    let updatedData = { ...missionData, page_id: pageData._id };
    API.post(`/widgets`, updatedData)
      .then((response) => {
        alert("Data updated successfully");
        window.location.reload();
      })
      .catch((err) =>
        alert(
          "Something went wrong, Please check your internet connect and reload page"
        )
      );
  };

  return (
    <div>
      <Card className="mission-form">
        <CardHeader>
          <CardTitle>Mission & Vision Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              required: "",
            }}
            validationSchema={formSchema}
          >
            {({ errors, touched }) => (
              <Form>
                {/* //! **************Mission Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-1">
                          <CardTitle className="lead collapse-title collapsed">
                            Mission
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-1">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handleMissionOnChange}
                                value={
                                  missionData?.widget_content?.sectionOne?.title
                                }
                                className={`form-control`}
                              />
                            </FormGroup>

                            <Row>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">Content</Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      missionData?.widget_content?.sectionOne
                                        ?.content
                                    }
                                    onChange={(e) =>
                                      handleMissionEditor(e.editor.getData())
                                    }
                                  />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                }
                {/* //! **************Vision Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-2">
                          <CardTitle className="lead collapse-title collapsed">
                            Vision
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-2">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handlevisionOnChange}
                                value={
                                  missionData?.widget_content?.sectionTwo?.title
                                }
                                className={`form-control`}
                              />
                            </FormGroup>

                            <Row>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">Content</Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      missionData?.widget_content?.sectionTwo
                                        ?.content
                                    }
                                    onChange={(e) =>
                                      handlevisionEditor(e.editor.getData())
                                    }
                                  />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="submit-btn-wrap">
                    <Button.Ripple
                      onClick={handleSubmit}
                      color="primary"
                      type="submit"
                    >
                      Submit
                    </Button.Ripple>
                  </div>
                }
                <Card className="mt-3">
                  <CardHeader>
                    <CardTitle>Meta Tag Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className="">
                      <Label for="title">Meta Title</Label>
                      <Field
                        name="title"
                        id="title"
                        onChange={handleMetaOnChange}
                        value={missionData?.widget_content?.meta_details?.title}
                        className={`form-control`}
                      />
                    </FormGroup>
                    <div>
                      <Label for="description" className="mb-1">
                        Description
                      </Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        rows="3"
                        onChange={handleMetaOnChange}
                        value={
                          missionData?.widget_content?.meta_details?.description
                        }
                      />
                    </div>
                    <div>
                      <Label for="schema_markup" className="my-1">
                        Schema Markup
                      </Label>
                      <Input
                        type="textarea"
                        name="schema_markup"
                        id="schema_markup"
                        rows="3"
                        onChange={handleMetaOnChange}
                        value={
                          missionData?.widget_content?.meta_details
                            ?.schema_markup
                        }
                      />
                    </div>
                  </CardBody>
                </Card>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>

      {/* //! *************************************
       //? ************Arabic Version**************
        //! ************************************* */}

      <Card className="arabic-mission-form">
        <CardHeader>
          <CardTitle>Arabic Mission & vision Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              required: "",
            }}
            validationSchema={formSchema}
          >
            {({ errors, touched }) => (
              <Form>
                {/* //! _________Mission Section_________*/}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-1">
                          <CardTitle className="lead collapse-title collapsed">
                            Mission
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-1">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handleArabicMissionOnChange}
                                value={
                                  missionData?.widget_content?.arabic?.sectionOne
                                    ?.title
                                }
                                className={`form-control`}
                              />
                            </FormGroup>

                            <Row>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">Content</Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      missionData?.widget_content?.arabic
                                        ?.sectionOne?.content
                                    }
                                    onChange={(e) =>
                                      handleArabicMissionEditor(
                                        e.editor.getData()
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                }
                {/* //! _________vision Section_________ */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-2">
                          <CardTitle className="lead collapse-title collapsed">
                            vision
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-2">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handleArabicvisionOnChange}
                                value={
                                  missionData?.widget_content?.arabic?.sectionTwo
                                    ?.title
                                }
                                className={`form-control`}
                              />
                            </FormGroup>

                            <Row>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">Content</Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      missionData?.widget_content?.arabic
                                        ?.sectionTwo?.content
                                    }
                                    onChange={(e) =>
                                      handleArabicvisionEditor(e.editor.getData())
                                    }
                                  />
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                }
                <Card className="mt-3">
                  <CardHeader>
                    <CardTitle>Meta Tag Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className="">
                      <Label for="title">Meta Title</Label>
                      <Field
                        name="title"
                        id="title"
                        onChange={handleArabicMetaOnChange}
                        value={
                          missionData?.widget_content?.arabic?.meta_details
                            ?.title
                        }
                        className={`form-control`}
                      />
                    </FormGroup>
                    <div>
                      <Label for="description" className="mb-1">
                        Description
                      </Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        rows="3"
                        onChange={handleArabicMetaOnChange}
                        value={
                          missionData?.widget_content?.arabic?.meta_details
                            ?.description
                        }
                      />
                    </div>
                    <div>
                      <Label for="schema_markup" className="my-1">
                        Schema Markup
                      </Label>
                      <Input
                        type="textarea"
                        name="schema_markup"
                        id="schema_markup"
                        rows="3"
                        onChange={handleArabicMetaOnChange}
                        value={
                          missionData?.widget_content?.arabic?.meta_details
                            ?.schema_markup
                        }
                      />
                    </div>
                  </CardBody>
                </Card>

                <div className="submit-btn-wrap">
                  <Button.Ripple
                    onClick={handleSubmit}
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button.Ripple>
                </div>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
};

// export default Mission;
export default connect(mapStateToProps)(Mission);

