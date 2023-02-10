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
import "./TopMessage.scss";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { Eye, Code, ChevronDown } from "react-feather";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  widget_name: "top-message",
  page_id: 0,
  widget_type: "top-message",
  widget_content: {
    first_title: "",
    second_title: "",
    first_content: "",
    second_content: "",
    image: "",
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    arabic: {
      first_title: "",
      second_title: "",
      first_content: "",
      second_content: "",
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

const TopMessage = (props) => {
  const [topMessage, setTopMessage] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);

  useEffect(() => {
    getGalleryImages();
  }, []);

  //!------------Pages Api Call------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find((x) => x.slug === "top-message");
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

              setTopMessage({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const getGalleryImages = () => {
    API.get(`/uploads`)
      .then((response) => {
        // axios.get(`https://pigeonarabia.com/E_Commerce_APis_v2/public/api/uploads`).then((response) => {
        if (response.status === 200) {
          setImagesData(
            response.data?.map((x) => ({ ...x, isChecked: false }))
          );
        }
      })
      .catch((err) => console.log(err));
  };
  //!-------handleSelect s3 Images-----------
  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle) {
        let updatedImage = { ...topMessage };
        updatedImage.widget_content.image = imagesData[index].avatar;
        setTopMessage(updatedImage);

        // setThumbnailPreview(imagesData.avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      let imagesDataUpdated = imagesData.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            isChecked: true,
          };
        } else {
          return x;
        }
      });
      setImagesData(imagesDataUpdated);
    }
  };

  //________Hanle onChange Field________
  const handleOnChange = (e) => {
    let updatedValue = { ...topMessage };
    let update = updatedValue.widget_content;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content = update;
    setTopMessage(updatedValue);
  };
  //________Hanle onChange Editor________
  const handleEditor = (value, property) => {
    let updatedValue = { ...topMessage };
    let update = updatedValue.widget_content;
    update[property] = value;
    updatedValue.widget_content = update;
    setTopMessage(updatedValue);
  };
  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...topMessage };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setTopMessage(updatedValue);
  };

  //! ***********Handle Arabic Functions***********
  //?________Hanle onChange Field________
  const handleArabicOnChange = (e) => {
    let updatedValue = { ...topMessage };
    let update = updatedValue.widget_content.arabic;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.arabic = update;
    setTopMessage(updatedValue);
  };
  //?________Hanle onChange Editor________
  const handleArabicEditor = (value, property) => {
    let updatedValue = { ...topMessage };
    let update = updatedValue.widget_content.arabic;
    update[property] = value;
    updatedValue.widget_content.arabic = update;
    setTopMessage(updatedValue);
  };
  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...topMessage };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setTopMessage(updatedValue);
  };

  //! ******************Handle Submit*********************
  const handleSubmit = () => {
    let updatedData = { ...topMessage, page_id: pageData._id };
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
      <Card className="pigeon-logo-form">
        <CardHeader>
          <CardTitle>Top Message Form</CardTitle>
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
                {/* //! **************English Section*************** */}
                {props.dataLog.login.loggedInUser.role !== "seo" && (
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-1">
                          <CardTitle className="lead collapse-title collapsed">
                            English Version
                          </CardTitle>
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-1">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="first_title">
                                First Section Title
                              </Label>
                              <Field
                                name="first_title"
                                id="first_title"
                                onChange={handleOnChange}
                                value={topMessage?.widget_content?.first_title}
                                className={`form-control`}
                              />
                            </FormGroup>

                            <Row>
                              <Col sm={9}>
                                <div>
                                  <Label for="content">
                                    First Section Content
                                  </Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      topMessage?.widget_content?.first_content
                                    }
                                    onChange={(e) =>
                                      handleEditor(
                                        e.editor.getData(),
                                        "first_content"
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                              <Col sm={3}>
                                <FormGroup className="">
                                  <Label for="featured_img">Image</Label>
                                  <div className="clearfix" />
                                  <div className="img-preview-wrapper">
                                    {topMessage?.widget_content?.image !==
                                      "" && (
                                      <img
                                        src={
                                          process.env.REACT_APP_IMAGE_BASE_URL +
                                          topMessage?.widget_content?.image
                                        }
                                        alt=""
                                      />
                                    )}
                                  </div>
                                  <Button.Ripple
                                    color="primary"
                                    className="p-1"
                                    onClick={() => {
                                      setIsSingle(true);
                                      setModalShow(true);
                                    }}
                                  >
                                    Add Image
                                  </Button.Ripple>
                                </FormGroup>
                              </Col>
                            </Row>
                            <div className="second-section">
                              <Col sm={12}>
                                <FormGroup className="mb-1">
                                  <Label for="second_title">
                                    Second Section Title
                                  </Label>
                                  <Field
                                    name="second_title"
                                    id="second_title"
                                    onChange={handleOnChange}
                                    value={
                                      topMessage?.widget_content?.second_title
                                    }
                                    className={`form-control`}
                                  />
                                </FormGroup>
                              </Col>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">
                                    Second Section Content
                                  </Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      topMessage?.widget_content?.second_content
                                    }
                                    onChange={(e) =>
                                      handleEditor(
                                        e.editor.getData(),
                                        "second_content"
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                            </div>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                )}
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
                        value={topMessage?.widget_content?.meta_details?.title}
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
                          topMessage?.widget_content?.meta_details?.description
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
                          topMessage?.widget_content?.meta_details
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
        <GalleryModal
          open={modalShow}
          handleClose={() => setModalShow(false)}
          handleImageSelect={handleImageSelect}
          data={imagesData}
          refreshData={() => getGalleryImages()}
        />
      </Card>
      {/* //! **************************************
      //? ***************Arabic Version*************
      //! **************************************** */}
      <Card className="arabic-top-message-form">
        {props.dataLog.login.loggedInUser.role !== "seo" && (
          <CardHeader>
            <CardTitle>Top Arabic Message Form</CardTitle>
          </CardHeader>
        )}
        <CardBody>
          <Formik
            initialValues={{
              required: "",
            }}
            validationSchema={formSchema}
          >
            {({ errors, touched }) => (
              <Form>
                {/* //! **************Arabic Section*************** */}
                {props.dataLog.login.loggedInUser.role !== "seo" && (
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-1">
                          <CardTitle className="lead collapse-title collapsed">
                            Arabic Version
                          </CardTitle>
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-1">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="first_title">
                                First Section Title
                              </Label>
                              <Field
                                name="first_title"
                                id="first_title"
                                onChange={handleArabicOnChange}
                                value={
                                  topMessage?.widget_content?.arabic
                                    ?.first_title
                                }
                                className={`form-control`}
                              />
                            </FormGroup>

                            <Row>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">
                                    First Section Content
                                  </Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      topMessage?.widget_content?.arabic
                                        ?.first_content
                                    }
                                    onChange={(e) =>
                                      handleArabicEditor(
                                        e.editor.getData(),
                                        "first_content"
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                            </Row>
                            <div className="second-section">
                              <Col sm={12}>
                                <FormGroup className="mb-1">
                                  <Label for="second_title">
                                    Second Section Title
                                  </Label>
                                  <Field
                                    name="second_title"
                                    id="second_title"
                                    onChange={handleArabicOnChange}
                                    value={
                                      topMessage?.widget_content?.arabic
                                        ?.second_title
                                    }
                                    className={`form-control`}
                                  />
                                </FormGroup>
                              </Col>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">
                                    Second Section Content
                                  </Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      topMessage?.widget_content?.arabic
                                        ?.second_content
                                    }
                                    onChange={(e) =>
                                      handleArabicEditor(
                                        e.editor.getData(),
                                        "second_content"
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                            </div>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                )}
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
                          topMessage?.widget_content?.arabic?.meta_details
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
                          topMessage?.widget_content?.arabic?.meta_details
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
                          topMessage?.widget_content?.arabic?.meta_details
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

// export default TopMessage;
export default connect(mapStateToProps)(TopMessage);
