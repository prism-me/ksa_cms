import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Label,
  Col,
  Row,
  FormGroup,
  UncontrolledCollapse,
  Input,
} from "reactstrap";
import CKEditor from "ckeditor4-react";
import "./BabyCareForm.scss";
import AWS from "aws-sdk";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { initial } from "lodash";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({});

const initialObj = {
  widget_name: "babycare",
  page_id: 0,
  widget_type: "babycare",
  widget_content: {
    babyCareTitle: "",
    featured_img: "",
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    babyCare: [
      {
        tabName: "0th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "1st Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "2nd Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "3rd Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "4th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "5th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "6th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },

      {
        tabName: "7th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "8th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "9th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "10th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "11th Month",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
      {
        tabName: "1Year and 1M",
        feedingText: "",
        growthText: "",
        caringText: "",
      },
    ],
    arabic: {
      babyCareTitle: "",
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
      babyCare: [
        {
          tabName: "0th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "1st Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "2nd Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "3rd Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "4th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "5th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "6th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },

        {
          tabName: "7th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "8th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "9th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "10th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "11th Month",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
        {
          tabName: "1Year and 1M",
          feedingText: "",
          growthText: "",
          caringText: "",
        },
      ],
    },
  },
};
const mapStateToProps = (props) => {
  return {
    dataLog: props.auth,
  };
};


const BabyCareForm = (props) => {
  const [babycareData, setBabycareData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);

  //!------------Gallery--------
  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:8db4219e-3012-4027-ac2e-60ec65e9ca84",
  });

  useEffect(() => {
    getGalleryImages()
  }, []);
  //!--------------CALL Pages Api-------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let page = response.data.find((x) => x.slug === "baby-care");
          setPageData(page);

          API.get(`/all_widgets/${page._id}`)
            .then((res) => {
              // debugger;
              if (!res.data[res.data.length - 1].widget_content.featured_img) {
                res.data[res.data.length - 1].widget_content.featured_img =
                  initialObj.widget_content.featured_img;
              }
              if (!res.data[res.data.length - 1].widget_content.babyCare) {
                res.data[res.data.length - 1].widget_content.babyCare =
                  initialObj.widget_content.babyCare;
              }
              if (
                !res.data.widget_content &&
                !res.data[res.data.length - 1].widget_content
              ) {
                res.data.widget_content = initialObj.widget_content;
              }

              if (!res.data[res.data.length - 1].widget_content.meta_details) {
                res.data[res.data.length - 1].widget_content.meta_details =
                  initialObj.widget_content.meta_details;
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
                  .meta_details
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.meta_details =
                  initialObj.widget_content.arabic.meta_details;
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
                res.data?.[res.data?.length - 1]?.widget_content;

              setBabycareData({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  
  const getGalleryImages = () => {
    API.get(`/uploads`).then((response) => {
    // axios.get(`https://pigeonarabia.com/E_Commerce_APis_v2/public/api/uploads`).then((response) => {
        if (response.status === 200) {
            setImagesData(response.data?.map((x) => ({ ...x, isChecked: false })));
        }
    }).catch(err => console.log(err));
  };

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && !isBanner) {
        // debugger;
        let updatedImage = { ...babycareData };
        updatedImage.widget_content.featured_img = imagesData[index].avatar;
        setBabycareData(updatedImage);

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

  //!-----------------Handle Description(ckEditor)---------
  const handleBabyFeedingChange = (value, index, property) => {
    let updatedBabycareData = { ...babycareData };
    let updatedData = updatedBabycareData.widget_content;
    updatedData.babyCare[index][property] = value;
    updatedBabycareData.widget_content = updatedData;
    setBabycareData(updatedBabycareData);
  };

  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...babycareData };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setBabycareData(updatedValue);
  };
  //! ******************************************************
  //? *******************Arabic Funtions*******************
  //! ******************************************************
  //--------Handle onChange for sub accordion(ckEditor)---------

  const handleArabicEditor = (value, index, property) => {
    let updatedValue = { ...babycareData };
    let updatedData = updatedValue.widget_content.arabic;
    updatedData.babyCare[index][property] = value;
    updatedValue.widget_content.arabic = updatedData;
    setBabycareData(updatedValue);
  };

  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...babycareData };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setBabycareData(updatedValue);
  };

  //!-------submit--------
  const handleSubmit = () => {
    const updatedData = {
      ...babycareData,
      page_id: pageData._id,
    };
    // debugger;
    API.put("/widgets", updatedData)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert("Data update successfully");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Card className="product-form-wrap">
        <CardHeader>
          <CardTitle>Baby Care Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik initialValues={{}} validationSchema={formSchema}>
            {({ errors, touched }) => (
              <Form>
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="mb-2">
                    <div className="clearfix mb-1" />
                    <div className="variation-row-wrapper mb-2">
                      <Row>
                        <Col sm={9}>
                          <div>
                            <Label for="description">Description</Label>
                            <CKEditor
                              onBeforeLoad={(CKEDITOR) =>
                                (CKEDITOR.disableAutoInline = true)
                              }
                              data={babycareData?.widget_content?.babyCareTitle}
                              onChange={(e) =>
                                setBabycareData({
                                  ...babycareData,
                                  widget_content: {
                                    ...babycareData.widget_content,
                                    babyCareTitle: e.editor.getData(),
                                  },
                                })
                              }
                            />
                          </div>
                        </Col>
                        <Col sm={3}>
                          <FormGroup className="">
                            <Label for="featured_img">Featured Image</Label>
                            <div className="clearfix" />
                            <div className="img-preview-wrapper">
                              {babycareData?.widget_content?.featured_img !==
                                "" && (
                                  <img
                                    src={babycareData?.widget_content?.featured_img}
                                    alt=""
                                  />
                                )}
                            </div>
                            <Button.Ripple
                              color="primary"
                              className="p-1"
                              onClick={() => {
                                setIsSingle(true);
                                setIsBanner(false);
                                setModalShow(true);
                              }}
                            >
                              Add Featured Image
                            </Button.Ripple>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    {babycareData?.widget_content?.babyCare?.map((x, index) => (
                      <div className="variation-row-wrapper mb-2" key={index}>
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader
                              id={`item-${index}`}
                              className="accordion-header"
                            >
                              <CardTitle className="lead collapse-title collapsed">
                                {x.tabName}
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler={`item-${index}`}>
                              <CardBody>
                                <Row>
                                  <Col sm={12}>
                                    <CardTitle>{x.tabName}</CardTitle>
                                    <div>
                                      <Label for="feedingText">
                                        Baby Feeding
                                      </Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.feedingText}
                                        onChange={(e) =>
                                          handleBabyFeedingChange(
                                            e.editor.getData(),
                                            index,
                                            "feedingText"
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label for="growthText">
                                        Baby Development
                                      </Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.growthText}
                                        onChange={(e) =>
                                          handleBabyFeedingChange(
                                            e.editor.getData(),
                                            index,
                                            "growthText"
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label for="caringText">Baby Caring</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.caringText}
                                        onChange={(e) =>
                                          handleBabyFeedingChange(
                                            e.editor.getData(),
                                            index,
                                            "caringText"
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
                    ))}
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
                        value={
                          babycareData?.widget_content?.meta_details?.title
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
                        onChange={handleMetaOnChange}
                        value={
                          babycareData?.widget_content?.meta_details
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
                        onChange={handleMetaOnChange}
                        value={
                          babycareData?.widget_content?.meta_details
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
      {/* //! **********************************************
      //? ******************Arabic Version*****************
      //! ************************************************** */}
      <Card className="arabic-babycare-form-card">
        {props.dataLog.login.loggedInUser.role !== 'seo' &&
          <CardHeader>
            <CardTitle>Arabic Baby Care Form</CardTitle>
          </CardHeader>
        }
        <CardBody>
          <Formik initialValues={{}} validationSchema={formSchema}>
            {({ errors, touched }) => (
              <Form>
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="mb-2">
                    <div className="clearfix mb-1" />
                    <div className="variation-row-wrapper mb-2">
                      <Row>
                        <Col sm={12}>
                          <div>
                            <Label for="description">Description</Label>
                            <CKEditor
                              onBeforeLoad={(CKEDITOR) =>
                                (CKEDITOR.disableAutoInline = true)
                              }
                              data={
                                babycareData?.widget_content?.arabic
                                  ?.babyCareTitle
                              }
                              onChange={(e) =>
                                setBabycareData({
                                  ...babycareData,
                                  widget_content: {
                                    ...babycareData.widget_content,
                                    arabic: {
                                      ...babycareData.widget_content.arabic,
                                      babyCareTitle: e.editor.getData(),
                                    },
                                  },
                                })
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                    {babycareData?.widget_content?.arabic?.babyCare?.map(
                      (x, index) => (
                        <div className="variation-row-wrapper mb-2" key={index}>
                          <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                            <Card>
                              <CardHeader
                                id={`item-${index}`}
                                className="accordion-header"
                              >
                                <CardTitle className="lead collapse-title collapsed">
                                  {x.tabName}
                                </CardTitle>
                              </CardHeader>
                              <UncontrolledCollapse toggler={`item-${index}`}>
                                <CardBody>
                                  <Row>
                                    <Col sm={12}>
                                      <CardTitle>{x.tabName}</CardTitle>
                                      <div>
                                        <Label for="feedingText">
                                          Baby Feeding
                                        </Label>
                                        <CKEditor
                                          onBeforeLoad={(CKEDITOR) =>
                                            (CKEDITOR.disableAutoInline = true)
                                          }
                                          data={x.feedingText}
                                          onChange={(e) =>
                                            handleArabicEditor(
                                              e.editor.getData(),
                                              index,
                                              "feedingText"
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label for="growthText">
                                          Baby Development
                                        </Label>
                                        <CKEditor
                                          onBeforeLoad={(CKEDITOR) =>
                                            (CKEDITOR.disableAutoInline = true)
                                          }
                                          data={x.growthText}
                                          onChange={(e) =>
                                            handleArabicEditor(
                                              e.editor.getData(),
                                              index,
                                              "growthText"
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label for="caringText">
                                          Baby Caring
                                        </Label>
                                        <CKEditor
                                          onBeforeLoad={(CKEDITOR) =>
                                            (CKEDITOR.disableAutoInline = true)
                                          }
                                          data={x.caringText}
                                          onChange={(e) =>
                                            handleArabicEditor(
                                              e.editor.getData(),
                                              index,
                                              "caringText"
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
                      )
                    )}
                  </div>
                }
                <Card className="mt-3">
                  <CardHeader>
                    <CardTitle>Arabic Meta Tag Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className="">
                      <Label for="title">Meta Title</Label>
                      <Field
                        name="title"
                        id="title"
                        onChange={handleArabicMetaOnChange}
                        value={
                          babycareData?.widget_content?.arabic?.meta_details
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
                          babycareData?.widget_content?.arabic?.meta_details
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
                          babycareData?.widget_content?.arabic?.meta_details
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

// export default BabyCareForm;
export default connect(mapStateToProps)(BabyCareForm);

