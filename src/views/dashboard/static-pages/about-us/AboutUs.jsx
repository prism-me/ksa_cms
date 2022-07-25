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
import "./AboutUs.scss";
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
  widget_name: "about-us",
  page_id: 0,
  widget_type: "about-us",
  widget_content: {
    sectionOne: {
      title: "",
      banner_image: "",
      featured_image: "",
      content: "",
    },
    sectionTwo: {
      title: "",
      video_url: "",
      video_thumbnail: "",
      content: "",
    },
    sectionThree: {
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
      sectionThree: {
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


const AboutUs = (props) => {
  const { id } = useParams();
  const [aboutUsData, setAboutUsData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState(false);
  const [isBanner, setIsBanner] = useState(false);

  //!------------Gallery--------
  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:8db4219e-3012-4027-ac2e-60ec65e9ca84",
  });

  useEffect(() => {
    getGalleryImages();
  }, []);

  //!------------Pages Api Call------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find(
            (x) => x.slug === "about-us-active"
          );
          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              // debugger;
              if (
                !res.data.widget_content &&
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
              setAboutUsData({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
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

  //!-------handleSelect s3 Images-----------
  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (!isSingle && isBanner) {
        let updatedImage = { ...aboutUsData };
        updatedImage.widget_content.sectionOne.banner_image =
          imagesData[index].avatar;
        setAboutUsData(updatedImage);

        // setThumbnailPreview(imagesData.avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (isSingle && !isBanner) {
        let updatedImage = { ...aboutUsData };
        updatedImage.widget_content.sectionOne.featured_image =
          imagesData[index].avatar;
        setAboutUsData(updatedImage);

        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (setVideoThumbnail && !isBanner && !isSingle) {
        let updatedImage = { ...aboutUsData };
        updatedImage.widget_content.sectionTwo.video_thumbnail =
          imagesData[index].avatar;
        setAboutUsData(updatedImage);

        setTimeout(() => {
          setModalShow(false);
        }, 100);
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

  //! ******************First Section Function********************

  //*************Hanle onChange Field**********
  const handleOnChange = (e) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.sectionOne;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.sectionOne = update;
    setAboutUsData(updatedValue);
  };
  //*************Hanle onChange Editor**********
  const handleEditor = (value) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.sectionOne;
    update.content = value;
    updatedValue.widget_content.sectionOne = update;
    setAboutUsData(updatedValue);
  };
  //! ******************Second Section Function********************

  //*************Hanle onChange Field**********
  const handleOnChangeTwo = (e) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.sectionTwo;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.sectionTwo = update;
    setAboutUsData(updatedValue);
  };
  //*************Hanle onChange Editor**********
  const handleEditorTwo = (value) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.sectionTwo;
    update.content = value;
    updatedValue.widget_content.sectionTwo = update;
    setAboutUsData(updatedValue);
  };
  //! ******************Third Section Function********************

  //*************Hanle onChange Field**********
  const handleOnChangeThree = (e) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.sectionThree;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.sectionThree = update;
    setAboutUsData(updatedValue);
  };
  //*************Hanle onChange Editor**********
  const handleEditorThree = (value) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.sectionThree;
    update.content = value;
    updatedValue.widget_content.sectionThree = update;
    setAboutUsData(updatedValue);
  };
  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...aboutUsData };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setAboutUsData(updatedValue);
  };

  //! ********************************************************
  //? **************Arabic Version********************
  //! ********************************************************

  //!___________Arabic First Section Function____________

  //---------Hanle onChange Field------------
  const handleArabicOnChange = (e) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.arabic.sectionOne;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.arabic.sectionOne = update;
    setAboutUsData(updatedValue);
  };
  //--------------Hanle onChange Editor-----------
  const handleArabicEditor = (value) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.arabic?.sectionOne;
    update.content = value;
    updatedValue.widget_content.arabic.sectionOne = update;
    setAboutUsData(updatedValue);
  };
  //! ____________Arabic Second Section Function____________

  //--------------Hanle onChange Field------------
  const handleArabicOnChangeTwo = (e) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.arabic.sectionTwo;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.arabic.sectionTwo = update;
    setAboutUsData(updatedValue);
  };
  //----------Hanle onChange Editor---------
  const handleArabicEditorTwo = (value) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.arabic.sectionTwo;
    update.content = value;
    updatedValue.widget_content.arabic.sectionTwo = update;
    setAboutUsData(updatedValue);
  };
  //! ___________Arabic Third Section Function____________

  //*************Hanle onChange Field**********
  const handleArabicOnChangeThree = (e) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.arabic.sectionThree;
    update[e.target.name] = e.target.value;
    updatedValue.widget_content.arabic.sectionThree = update;
    setAboutUsData(updatedValue);
  };
  //*************Hanle onChange Editor**********
  const handleArabicEditorThree = (value) => {
    let updatedValue = { ...aboutUsData };
    let update = updatedValue.widget_content.arabic.sectionThree;
    update.content = value;
    updatedValue.widget_content.arabic.sectionThree = update;
    setAboutUsData(updatedValue);
  };
  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...aboutUsData };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setAboutUsData(updatedValue);
  };

  //! ********************Handle Submit******************
  const handleSubmit = () => {
    let updatedData = { ...aboutUsData, page_id: pageData._id };

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
      <Card className="about-us-form">
        <CardHeader>
          <CardTitle>About Us Form</CardTitle>
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
                {/* //! **************First Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-1">
                          <CardTitle className="lead collapse-title collapsed">
                            First Section
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
                                onChange={handleOnChange}
                                value={
                                  aboutUsData?.widget_content?.sectionOne?.title
                                }
                                className={`form-control`}
                              />
                            </FormGroup>
                            <Row>
                              <Col sm={6}>
                                <FormGroup className="">
                                  <Label for="banner_image">Banner Image</Label>
                                  <div className="clearfix" />
                                  <div className="img-preview-wrapper">
                                    {aboutUsData?.widget_content?.sectionOne
                                      ?.banner_image !== "" && (
                                        <img
                                          src={
                                            aboutUsData?.widget_content?.sectionOne
                                              ?.banner_image
                                          }
                                          alt=""
                                        />
                                      )}
                                  </div>
                                  <Button.Ripple
                                    color="primary"
                                    className="p-1"
                                    onClick={() => {
                                      setIsSingle(false);
                                      setIsBanner(true);
                                      setModalShow(true);
                                    }}
                                  >
                                    Add Banner Image
                                  </Button.Ripple>
                                </FormGroup>
                              </Col>
                              <Col sm={6}>
                                <FormGroup className="">
                                  <Label for="featured_img">Featured Image</Label>
                                  <div className="clearfix" />
                                  <div className="img-preview-wrapper">
                                    {aboutUsData?.widget_content?.sectionOne
                                      ?.featured_image !== "" && (
                                        <img
                                          src={
                                            aboutUsData?.widget_content?.sectionOne
                                              ?.featured_image
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
                                      setIsBanner(false);
                                      setModalShow(true);
                                    }}
                                  >
                                    Add Featured Image
                                  </Button.Ripple>
                                </FormGroup>
                              </Col>
                              <Col sm={12}>
                                <div>
                                  <Label for="content">Content</Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      aboutUsData?.widget_content?.sectionOne
                                        ?.content
                                    }
                                    onChange={(e) =>
                                      handleEditor(e.editor.getData())
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
                {/* //! **************Second Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-2">
                          <CardTitle className="lead collapse-title collapsed">
                            Second Section
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
                                onChange={handleOnChangeTwo}
                                value={
                                  aboutUsData?.widget_content?.sectionTwo?.title
                                }
                                className={`form-control`}
                              />
                            </FormGroup>
                            <FormGroup className="mb-1">
                              <Label for="video_url">Video Url</Label>
                              <Field
                                name="video_url"
                                id="video_url"
                                onChange={handleOnChangeTwo}
                                value={
                                  aboutUsData?.widget_content?.sectionTwo
                                    ?.video_url
                                }
                                className={`form-control`}
                              />
                            </FormGroup>
                            <Row>
                              <Col sm={9}>
                                <div>
                                  <Label for="content">Content</Label>
                                  <CKEditor
                                    onBeforeLoad={(CKEDITOR) =>
                                      (CKEDITOR.disableAutoInline = true)
                                    }
                                    data={
                                      aboutUsData?.widget_content?.sectionTwo
                                        ?.content
                                    }
                                    onChange={(e) =>
                                      handleEditorTwo(e.editor.getData())
                                    }
                                  />
                                </div>
                              </Col>
                              <Col sm={3}>
                                <FormGroup className="">
                                  <Label for="video_thumbnail">
                                    Video Thumbnail
                                  </Label>
                                  <div className="clearfix" />
                                  <div className="img-preview-wrapper">
                                    {aboutUsData?.widget_content?.sectionTwo
                                      ?.video_thumbnail !== "" && (
                                        <img
                                          src={
                                            aboutUsData?.widget_content?.sectionTwo
                                              ?.video_thumbnail
                                          }
                                          alt=""
                                        />
                                      )}
                                  </div>
                                  <Button.Ripple
                                    color="primary"
                                    className="p-1"
                                    onClick={() => {
                                      setVideoThumbnail(true);
                                      setIsSingle(false);
                                      setIsBanner(false);
                                      setModalShow(true);
                                    }}
                                  >
                                    Add Video Thumbnail
                                  </Button.Ripple>
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                }
                {/* //! **************Third Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-3">
                          <CardTitle className="lead collapse-title collapsed">
                            Third Section
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-3">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handleOnChangeThree}
                                value={
                                  aboutUsData?.widget_content?.sectionThree?.title
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
                                      aboutUsData?.widget_content?.sectionThree
                                        ?.content
                                    }
                                    onChange={(e) =>
                                      handleEditorThree(e.editor.getData())
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
                        onChange={handleMetaOnChange}
                        value={aboutUsData?.widget_content?.meta_details?.title}
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
                          aboutUsData?.widget_content?.meta_details?.description
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
                          aboutUsData?.widget_content?.meta_details
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
      {/* //! *************************************
      //? **********Arabic Version**************
      //! *************************************** */}
      <Card className="arabic-about-us-form">
        <CardHeader>
          <CardTitle>Arabic About Us Form</CardTitle>
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
                {/* //! **************First Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-4">
                          <CardTitle className="lead collapse-title collapsed">
                            First Section
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-4">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handleArabicOnChange}
                                value={
                                  aboutUsData?.widget_content?.arabic?.sectionOne
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
                                      aboutUsData?.widget_content?.arabic
                                        ?.sectionOne?.content
                                    }
                                    onChange={(e) =>
                                      handleArabicEditor(e.editor.getData())
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
                {/* //! **************Second Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-5">
                          <CardTitle className="lead collapse-title collapsed">
                            Second Section
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-5">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handleArabicOnChangeTwo}
                                value={
                                  aboutUsData?.widget_content?.arabic?.sectionTwo
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
                                      aboutUsData?.widget_content?.arabic
                                        .sectionTwo.content
                                    }
                                    onChange={(e) =>
                                      handleArabicEditorTwo(e.editor.getData())
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
                {/* //! **************Third Section*************** */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-6">
                          <CardTitle className="lead collapse-title collapsed">
                            Third Section
                          </CardTitle>
                          {/* <ChevronDown size={15} className="collapse-icon" /> */}
                        </CardHeader>
                        <UncontrolledCollapse toggler="#item-6">
                          <CardBody>
                            <FormGroup className="mb-1">
                              <Label for="title">Title</Label>
                              <Field
                                name="title"
                                id="title"
                                onChange={handleArabicOnChangeThree}
                                value={
                                  aboutUsData?.widget_content?.arabic
                                    ?.sectionThree?.title
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
                                      aboutUsData?.widget_content?.arabic
                                        ?.sectionThree?.content
                                    }
                                    onChange={(e) =>
                                      handleArabicEditorThree(e.editor.getData())
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
                          aboutUsData?.widget_content?.arabic?.meta_details
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
                          aboutUsData?.widget_content?.arabic?.meta_details
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
                          aboutUsData?.widget_content?.arabic?.meta_details
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
                    {isEdit ? "Edit" : "Submit"}
                  </Button.Ripple>
                </div>
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
    </div>
  );
};

// export default AboutUs;
export default connect(mapStateToProps)(AboutUs);
