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
import "./FirstTimeFather.scss";
import { API } from "../../../http/API";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../gallery-modal/GalleryModal";
import { DeleteOutlined } from "@material-ui/icons";
import { connect } from "react-redux";


const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  widget_name: "first-time-father",
  page_id: 0,
  widget_type: "first-time-father",
  widget_content: {
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    father: [
      {
        title: "",
        short_description: "",
        featured_img: "",
      },
    ],
    arabic: {
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
      father: [
        {
          title: "",
          short_description: "",
          featured_img: "",
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


const FirstTimeFather = (props) => {
  const { id } = useParams();
  const [firstTimeFather, setFirstTimeFather] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  //!------------Gallery--------
  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:8db4219e-3012-4027-ac2e-60ec65e9ca84",
  });

  useEffect(() => {
    getGalleryImages();
  }, []);

  var albumBucketName = "pigeon-gallery";
  var s3 = new AWS.S3({
    apiVersion: "2011-12-05",
    params: { Bucket: albumBucketName },
  });

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
        let updatedFather = { ...firstTimeFather };
        updatedFather.widget_content.father[currentIndex].featured_img =
          imagesData[index].avatar;
        setFirstTimeFather(updatedFather);

        setThumbnailPreview(imagesData[index].avatar);
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

  //!----------Call Page Api---------------
  useEffect(() => {
    API.get(`pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find(
            (x) => x.slug === "first-time-father"
          );
          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              if (
                !res.data.widget_content &&
                !res.data[res.data.length - 1].widget_content
              ) {
                res.data.widget_content = initialObj.widget_content;
              }
              if (!res.data[res.data.length - 1].widget_content.arabic) {
                res.data[res.data.length - 1].widget_content.arabic =
                  initialObj.widget_content.arabic;
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
                res.data?.[res.data.length - 1]?.widget_content;

              setFirstTimeFather({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!-------handle onChange-------
  const handleOnChange = (e, index) => {
    let updatedValue = { ...firstTimeFather };
    let update = updatedValue.widget_content.father;
    update[index][e.target.name] = e.target.value;
    updatedValue.widget_content.father = update;
    setFirstTimeFather(updatedValue);
  };
  //!----------handle CK Editor onChnage------
  const handleEditor = (index, value, property) => {
    let updatedValue = { ...firstTimeFather };
    let updatedData = updatedValue.widget_content.father;
    updatedData[index][property] = value;
    updatedValue.widget_content.father = updatedData;
    setFirstTimeFather(updatedValue);
  };
  //! ________Handle Meta_Details onChange______-
  const handleMetaOnChange = (e) => {
    let updatedData = { ...firstTimeFather };
    updatedData.widget_content.meta_details[e.target.name] = e.target.value;
    setFirstTimeFather(updatedData);
  };

  //!----------ADD New Section------
  const addVariation = () => {
    let updatedValue = { ...firstTimeFather };
    updatedValue.widget_content.father.push({
      title: "",
      short_description: "",
      featured_img: "",
    });
    setFirstTimeFather(updatedValue);
  };

  //!Remove section------
  const removeVariation = (index) => {
    let updatedValue = { ...firstTimeFather };
    let updatedSection = updatedValue.widget_content.father.filter(
      (x, i) => i !== index
    );
    updatedValue.widget_content.father = updatedSection;
    setFirstTimeFather(updatedValue);
  };
  //! **********************************************
  //? *************Arabic Function*****************
  //! **********************************************

  //-------handle onChange-------
  const handleArabicOnChange = (e, index) => {
    let updatedValue = { ...firstTimeFather };
    let update = updatedValue.widget_content.arabic.father;
    update[index][e.target.name] = e.target.value;
    updatedValue.widget_content.arabic.father = update;
    setFirstTimeFather(updatedValue);
  };
  //----------handle CK Editor onChnage------
  const handleArabicEditor = (index, value, property) => {
    let updatedValue = { ...firstTimeFather };
    let updatedData = updatedValue.widget_content.arabic.father;
    updatedData[index][property] = value;
    updatedValue.widget_content.arabic.father = updatedData;
    setFirstTimeFather(updatedValue);
  };
  //! ________Handle Meta_Details onChange______-
  const handleArabicMetaOnChange = (e) => {
    let updatedData = { ...firstTimeFather };
    updatedData.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setFirstTimeFather(updatedData);
  };

  //----------Add New Section------
  const addArabicSection = () => {
    let updatedValue = { ...firstTimeFather };
    updatedValue.widget_content.arabic.father.push({
      title: "",
      short_description: "",
      // featured_img: "",
    });
    setFirstTimeFather(updatedValue);
  };

  // ---------Remove section------
  const removeArabicSection = (index) => {
    let updatedValue = { ...firstTimeFather };
    let updatedSection = updatedValue.widget_content.arabic.father.filter(
      (x, i) => i !== index
    );
    updatedValue.widget_content.arabic.father = updatedSection;
    setFirstTimeFather(updatedValue);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    const updatedData = { ...firstTimeFather, page_id: pageData._id };
    updatedData.widget_content.father.forEach((x, index) => {
      updatedData.widget_content.arabic.father[index].featured_img =
        x.featured_img;
    });
    console.log("Response from submit", updatedData);
    API.post(`/widgets`, updatedData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          alert("Data updated successfully");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card className="father-add-form">
        <CardHeader>
          <CardTitle>First Time Father Form</CardTitle>
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
                {/* //!--------------------------------------? */}

                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  firstTimeFather?.widget_content?.father?.map((x, index) => (
                    <div className="variation-row-wrapper mb-2" key={index}>
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader
                            id={`item-${index}`}
                            className="accordion-header"
                          >
                            <CardTitle className="lead collapse-title collapsed">
                              Section # {index + 1}
                            </CardTitle>
                          </CardHeader>
                          <UncontrolledCollapse toggler={`item-${index}`}>
                            <CardBody>
                              <FormGroup className="">
                                <Label for="title">Title</Label>
                                <Field
                                  name="title"
                                  id="title"
                                  // onChange={handleFields}
                                  onChange={(e) => handleOnChange(e, index)}
                                  value={x.title}
                                  className={`form-control`}
                                />
                              </FormGroup>

                              <Row>
                                <Col sm={9}>
                                  <div>
                                    <Label for="short_description">
                                      Description
                                    </Label>
                                    <CKEditor
                                      onBeforeLoad={(CKEDITOR) =>
                                        (CKEDITOR.disableAutoInline = true)
                                      }
                                      data={x.short_description}
                                      // onChange={(e) =>
                                      //   setFirstTimeFather({
                                      //     ...firstTimeFather,
                                      //     widget_content: {
                                      //       ...firstTimeFather.widget_content,
                                      //       short_description: e.editor.getData(),
                                      //     },
                                      //   })
                                      // }
                                      onChange={(e) => {
                                        handleEditor(
                                          index,
                                          e.editor.getData(),
                                          "short_description"
                                        );
                                      }}
                                    />
                                  </div>
                                </Col>
                                <Col sm={3}>
                                  <FormGroup className="">
                                    <Label for="featured_img">
                                      Featured Image
                                    </Label>
                                    <div className="clearfix" />
                                    <div className="img-preview-wrapper">
                                      {x.featured_img !== "" && (
                                        <img src={x.featured_img} alt="" />
                                      )}
                                    </div>
                                    <Button.Ripple
                                      color="primary"
                                      className="p-1"
                                      onClick={() => {
                                        setIsSingle(true);
                                        setIsBanner(false);
                                        setModalShow(true);
                                        setCurrentIndex(index);
                                      }}
                                    >
                                      Add Featured Image
                                    </Button.Ripple>
                                  </FormGroup>
                                </Col>
                              </Row>

                              <Col sm={12}>
                                <div
                                  style={{ height: "100%", cursor: "pointer" }}
                                  className="d-flex align-items-center justify-content-end"
                                >
                                  <DeleteOutlined
                                    color="secondary"
                                    onClick={() => removeVariation(index)}
                                  />
                                </div>
                              </Col>
                              {/* </Row> */}
                            </CardBody>
                          </UncontrolledCollapse>
                        </Card>
                      </div>
                    </div>
                  ))}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Button.Ripple
                    onClick={addVariation}
                    color="danger"
                    type="button"
                    className="mt-0"
                    size="sm"
                  >
                    Add New Section
                  </Button.Ripple>
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
                          firstTimeFather?.widget_content?.meta_details?.title
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
                          firstTimeFather?.widget_content?.meta_details
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
                          firstTimeFather?.widget_content?.meta_details
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
      {/* //! *******************************************
        //? ****************Abrabic Version************
       //! ******************************************** */}
      <Card className="arabic-father-form">
        {props.dataLog.login.loggedInUser.role !== 'seo' &&
          <CardHeader>
            <CardTitle>Arabic First Time Father Form</CardTitle>
          </CardHeader>
        }
        <CardBody>
          <Formik
            initialValues={{
              required: "",
            }}
            validationSchema={formSchema}
          >
            {({ errors, touched }) => (
              <Form>
                {/* //!--------------------------------------? */}

                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  firstTimeFather?.widget_content?.arabic?.father?.map(
                    (x, index) => (
                      <div className="variation-row-wrapper mb-2" key={index}>
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader
                              id={`item-${index}`}
                              className="accordion-header"
                            >
                              <CardTitle className="lead collapse-title collapsed">
                                Section # {index + 1}
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler={`item-${index}`}>
                              <CardBody>
                                <FormGroup className="">
                                  <Label for="title">Title</Label>
                                  <Field
                                    name="title"
                                    id="title"
                                    // onChange={handleFields}
                                    onChange={(e) =>
                                      handleArabicOnChange(e, index)
                                    }
                                    value={x.title}
                                    className={`form-control`}
                                  />
                                </FormGroup>

                                <Row>
                                  <Col sm={12}>
                                    <div>
                                      <Label for="short_description">
                                        Description
                                      </Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.short_description}
                                        onChange={(e) => {
                                          handleArabicEditor(
                                            index,
                                            e.editor.getData(),
                                            "short_description"
                                          );
                                        }}
                                      />
                                    </div>
                                  </Col>
                                </Row>

                                <Col sm={12}>
                                  <div
                                    style={{ height: "100%", cursor: "pointer" }}
                                    className="d-flex align-items-center justify-content-end"
                                  >
                                    <DeleteOutlined
                                      color="secondary"
                                      onClick={() => removeArabicSection(index)}
                                    />
                                  </div>
                                </Col>
                              </CardBody>
                            </UncontrolledCollapse>
                          </Card>
                        </div>
                      </div>
                    )
                  )}

                {/* //!-------------------------------------- */}
                <div className="submit-btn-wrap">
                  <Button.Ripple
                    onClick={handleSubmit}
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button.Ripple>
                </div>
                <br />
                <br />
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Button.Ripple
                    onClick={addArabicSection}
                    color="danger"
                    type="button"
                    className="mt-0"
                    size="sm"
                  >
                    Add New Section
                  </Button.Ripple>
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
                          firstTimeFather?.widget_content?.arabic?.meta_details
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
                          firstTimeFather?.widget_content?.arabic?.meta_details
                            ?.description
                        }
                      />
                    </div>
                    <div>
                      <Label for="description" className="my-1">
                        Schema Markup
                      </Label>
                      <Input
                        type="textarea"
                        name="schema_markup"
                        id="schema_markup"
                        rows="3"
                        onChange={handleArabicMetaOnChange}
                        value={
                          firstTimeFather?.widget_content?.arabic?.meta_details
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
    </>
  );
};

// export default FirstTimeFather;
export default connect(mapStateToProps)(FirstTimeFather);

