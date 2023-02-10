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
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./HomeForm.scss";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../gallery-modal/GalleryModal";
import { DeleteOutlined } from "@material-ui/icons";
import { API } from "../../../http/API";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  widget_name: "home-page",
  page_id: 0,
  widget_type: "home-page",
  widget_content: {
    sliderOne: {
      title: "",
      description: "",
      image: "",
    },
    sliderTwo: {
      title: "",
      description: "",
      image: "",
    },
    sliderThree: {
      title: "",
      description: "",
      image: "",
    },
    tagSection: {
      title: "",
      description: "",
    },
    welcomeSection: {
      title: "",
      description: "",
    },
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    promoSection: [
      {
        video_link: "",
        images_detail: {
          title: "",
          content: "",
          background_image: "",
        },
      },
    ],
    arabic: {
      sliderOne: {
        title: "",
        description: "",
      },
      sliderTwo: {
        title: "",
        description: "",
      },
      sliderThree: {
        title: "",
        description: "",
      },
      tagSection: {
        title: "",
        description: "",
      },
      welcomeSection: {
        title: "",
        description: "",
      },
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
      promoSection: [
        {
          images_detail: {
            title: "",
            content: "",
          },
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

const HomeForm = (props) => {
  console.log(
    "props.loggedInUser.role ::::",
    props.dataLog.login.loggedInUser.role
  );
  const [homeData, setHomeData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [isSliderThree, setIsSliderThree] = useState(false);
  const [isSliderTwo, setIsSliderTwo] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPromoImage, setIsPromoImage] = useState(false);

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
      //   debugger;
      if (isSingle && !isSliderTwo) {
        let updatedImage = { ...homeData };
        updatedImage.widget_content.sliderOne.image = imagesData[index].avatar;
        setHomeData(updatedImage);

        // setThumbnailPreview(imagesData.avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (isSliderTwo && !isSingle) {
        let updatedImage = { ...homeData };
        updatedImage.widget_content.sliderTwo.image = imagesData[index].avatar;
        setHomeData(updatedImage);

        // setThumbnailPreview(imagesData.avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }

      if (isSliderThree && !isSliderTwo && !isSingle) {
        let updatedImage = { ...homeData };
        updatedImage.widget_content.sliderThree.image =
          imagesData[index].avatar;
        setHomeData(updatedImage);

        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (isPromoImage && !isSingle && !isSliderTwo && !isSliderThree) {
        let updatedImage = { ...homeData };
        updatedImage.widget_content.promoSection[
          currentIndex
        ].images_detail.background_image = imagesData[index].avatar;
        setHomeData(updatedImage);

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

  //!------------Pages Api Call------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find((x) => x.slug === "home-page");
          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              //   debugger;
              if (
                !res.data[res.data.length - 1].widget_content &&
                !res.data.widget_content
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

              let widget_content = res.data[res.data.length - 1].widget_content;

              //   console.log("All widgets response", widget_content);
              setHomeData({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!*********** Handle Slider One************
  //! __________Handle OnChange__________
  const handleSliderOneOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.sliderOne[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle  Editor__________
  const handleSliderOneEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.sliderOne.description = value;
    setHomeData(updatedValue);
  };
  //! *********** Handle Slider Two************
  //! __________Handle OnChange__________

  const handleSliderTwoOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.sliderTwo[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleSliderTwoEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.sliderTwo.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Slider Three************
  //! __________Handle OnChange__________

  const handleSliderThreeOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.sliderThree[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleSliderThreeEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.sliderThree.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Tag Section************
  //! __________Handle OnChange__________

  const handleTagOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.tagSection[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleTagEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.tagSection.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Welcome Section************
  //! __________Handle OnChange__________

  const handleWelcomeOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.welcomeSection[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleWelcomeEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.welcomeSection.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Promo Section************
  //! __________Handle OnChange__________

  const handlePromoOnChange = (e, index) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.promoSection[index].images_detail[
      e.target.name
    ] = e.target.value;
    setHomeData(updatedValue);
  };
  const handlePromoVideoOnChange = (e, index) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.promoSection[index][e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handlePromoEditor = (value, index) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.promoSection[index].images_detail.content =
      value;
    setHomeData(updatedValue);
  };
  //!----------ADD New Section------
  const addNewSection = () => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.promoSection.push({
      video_link: "",
      images_detail: {
        title: "",
        content: "",
        background_image: "",
      },
    });
    setHomeData(updatedValue);
  };
  //!--------Remove section------
  const removeSection = (index) => {
    let updatedValue = { ...homeData };
    let updatedSection = updatedValue.widget_content.promoSection.filter(
      (x, i) => i !== index
    );
    updatedValue.widget_content.promoSection = updatedSection;
    setHomeData(updatedValue);
  };
  //!--------Hanlde Meta Details OnChange---------
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setHomeData(updatedValue);
  };

  //! *************************************************************
  //? *******************Arabic Section Function*******************
  //! *************************************************************

  //!*********** Handle Slider One************
  //! __________Handle OnChange__________
  const handleArabicSliderOneOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.sliderOne[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle  Editor__________
  const handleArabicSliderOneEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.sliderOne.description = value;
    setHomeData(updatedValue);
  };
  //! *********** Handle Slider Two************
  //! __________Handle OnChange__________

  const handleArabicSliderTwoOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.sliderTwo[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleArabicSliderTwoEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.sliderTwo.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Slider Three************
  //! __________Handle OnChange__________

  const handleArabicSliderThreeOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.sliderThree[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleArabicSliderThreeEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.sliderThree.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Tag Section************
  //! __________Handle OnChange__________

  const handleArabicTagOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.tagSection[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleArabicTagEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.tagSection.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Welcome Section************
  //! __________Handle OnChange__________

  const handleArabicWelcomeOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.welcomeSection[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! __________Handle Editor__________
  const handleArabicWelcomeEditor = (value) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.welcomeSection.description = value;
    setHomeData(updatedValue);
  };
  //!*********** Handle Promo Section************
  //! __________Handle OnChange__________

  const handleArabicPromoOnChange = (e, index) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.promoSection[index].images_detail[
      e.target.name
    ] = e.target.value;
    setHomeData(updatedValue);
  };

  //! __________Handle Editor__________
  const handleArabicPromoEditor = (value, index) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.promoSection[
      index
    ].images_detail.content = value;
    setHomeData(updatedValue);
  };
  //!----------ADD New Section------
  const addArabicNewSection = () => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.promoSection.push({
      images_detail: {
        title: "",
        content: "",
      },
    });
    setHomeData(updatedValue);
  };
  //!--------Remove section------
  const removeArabicSection = (index) => {
    let updatedValue = { ...homeData };
    let updatedSection = updatedValue.widget_content.arabic.promoSection.filter(
      (x, i) => i !== index
    );
    updatedValue.widget_content.arabic.promoSection = updatedSection;
    setHomeData(updatedValue);
  };
  //!--------Hanlde Meta Details OnChange---------
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...homeData };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setHomeData(updatedValue);
  };
  //! --------------Handle Submit-------------
  const handleSubmit = () => {
    let updatedData = { ...homeData, page_id: pageData._id };
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
    <>
      {props.dataLog.login.loggedInUser.role !== "seo" && (
        <Card className="home-form">
          <CardHeader>
            <CardTitle>Slider Section</CardTitle>
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
                  {/* //! **************Slider One************** */}
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-1">
                          <CardTitle className="lead collapse-title collapsed">
                            First Slider
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
                                onChange={handleSliderOneOnChange}
                                value={
                                  homeData?.widget_content?.sliderOne?.title
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
                                      homeData?.widget_content?.sliderOne
                                        ?.description
                                    }
                                    onChange={(e) =>
                                      handleSliderOneEditor(e.editor.getData())
                                    }
                                  />
                                </div>
                              </Col>
                              <Col sm={3}>
                                <FormGroup className="">
                                  <Label for="video_thumbnail">
                                    Upload Image
                                  </Label>
                                  <div className="clearfix" />
                                  <div className="img-preview-wrapper">
                                    {homeData?.widget_content?.sliderOne
                                      ?.image !== "" && (
                                      <img
                                        src={
                                          process.env.REACT_APP_IMAGE_BASE_URL +
                                          homeData?.widget_content?.sliderOne
                                            ?.image
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
                                      setIsSliderTwo(false);
                                      setIsSliderThree(false);
                                      setModalShow(true);
                                    }}
                                  >
                                    Slider Image
                                  </Button.Ripple>
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                  {/* //! **************Slider Two*************** */}
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-2">
                          <CardTitle className="lead collapse-title collapsed">
                            Second Slider
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
                                onChange={handleSliderTwoOnChange}
                                value={
                                  homeData?.widget_content?.sliderTwo?.title
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
                                      homeData?.widget_content?.sliderTwo
                                        ?.description
                                    }
                                    onChange={(e) =>
                                      handleSliderTwoEditor(e.editor.getData())
                                    }
                                  />
                                </div>
                              </Col>
                              <Col sm={3}>
                                <FormGroup className="">
                                  <Label for="video_thumbnail">
                                    Upload Image
                                  </Label>
                                  <div className="clearfix" />
                                  <div className="img-preview-wrapper">
                                    {homeData?.widget_content?.sliderTwo
                                      ?.image !== "" && (
                                      <img
                                        src={
                                          process.env.REACT_APP_IMAGE_BASE_URL +
                                          homeData?.widget_content?.sliderTwo
                                            ?.image
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
                                      setIsSliderTwo(true);
                                      setIsSliderThree(false);
                                      setModalShow(true);
                                    }}
                                  >
                                    Slider Image
                                  </Button.Ripple>
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
                  </div>
                  {/* //! **************Slider Three*************** */}
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-3">
                          <CardTitle className="lead collapse-title collapsed">
                            Third Slider
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
                                onChange={handleSliderThreeOnChange}
                                value={
                                  homeData?.widget_content?.sliderThree?.title
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
                                      homeData?.widget_content?.sliderThree
                                        ?.description
                                    }
                                    onChange={(e) =>
                                      handleSliderThreeEditor(
                                        e.editor.getData()
                                      )
                                    }
                                  />
                                </div>
                              </Col>
                              <Col sm={3}>
                                <FormGroup className="">
                                  <Label for="video_thumbnail">
                                    Upload Image
                                  </Label>
                                  <div className="clearfix" />
                                  <div className="img-preview-wrapper">
                                    {homeData?.widget_content?.sliderThree
                                      ?.image !== "" && (
                                      <img
                                        src={
                                          process.env.REACT_APP_IMAGE_BASE_URL +
                                          homeData?.widget_content?.sliderThree
                                            ?.image
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
                                      setIsSliderTwo(false);
                                      setIsSliderThree(true);
                                      setModalShow(true);
                                    }}
                                  >
                                    Slider Image
                                  </Button.Ripple>
                                </FormGroup>
                              </Col>
                            </Row>
                          </CardBody>
                        </UncontrolledCollapse>
                      </Card>
                    </div>
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
      )}
      {/* //! **************Slider Bottom Section*************** */}
      {props.dataLog.login.loggedInUser.role !== "seo" && (
        <Card className="slider-bottom-section">
          <CardHeader>
            <CardTitle>Slider Bottom Section</CardTitle>
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
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-4">
                          <CardTitle className="lead collapse-title collapsed">
                            Slider Bottom Title
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
                                onChange={handleTagOnChange}
                                value={
                                  homeData?.widget_content?.tagSection?.title
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
                                      homeData?.widget_content?.tagSection
                                        ?.description
                                    }
                                    onChange={(e) =>
                                      handleTagEditor(e.editor.getData())
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
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      )}
      {/* //! **************Welcome Section*************** */}
      {props.dataLog.login.loggedInUser.role !== "seo" && (
        <Card className="welcome-section">
          <CardHeader>
            <CardTitle>Welcome Section</CardTitle>
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
                  <div className="variation-row-wrapper mb-2">
                    <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                      <Card>
                        <CardHeader id="item-5">
                          <CardTitle className="lead collapse-title collapsed">
                            Welcome Section
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
                                onChange={handleWelcomeOnChange}
                                value={
                                  homeData?.widget_content?.welcomeSection
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
                                      homeData?.widget_content?.welcomeSection
                                        ?.description
                                    }
                                    onChange={(e) =>
                                      handleWelcomeEditor(e.editor.getData())
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
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      )}
      {/* //! **************ُPromo Section*************** */}
      <Card className="welcome-section">
        {props.dataLog.login.loggedInUser.role !== "seo" && (
          <CardHeader>
            <CardTitle>Promo Section</CardTitle>
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
                {props.dataLog.login.loggedInUser.role !== "seo" &&
                  homeData?.widget_content?.promoSection?.map((x, index) => (
                    <div className="variation-row-wrapper mb-2">
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader id={`item-${index + 1}`}>
                            <CardTitle className="lead collapse-title collapsed">
                              Promo {index + 1}
                            </CardTitle>
                          </CardHeader>
                          <UncontrolledCollapse toggler={`item-${index + 1}`}>
                            <CardBody>
                              <FormGroup className="mb-1">
                                <Label for="title">Title</Label>
                                <Field
                                  name="title"
                                  id="title"
                                  onChange={(e) =>
                                    handlePromoOnChange(e, index)
                                  }
                                  value={x.images_detail?.title}
                                  className={`form-control`}
                                />
                              </FormGroup>
                              <FormGroup className="mb-1">
                                <Label for="video_link">Video Url</Label>
                                <Field
                                  name="video_link"
                                  id="video_link"
                                  onChange={(e) =>
                                    handlePromoVideoOnChange(e, index)
                                  }
                                  value={x.video_link}
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
                                      data={x.images_detail?.content}
                                      onChange={(e) =>
                                        handlePromoEditor(
                                          e.editor.getData(),
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                </Col>
                                <Col sm={3}>
                                  <FormGroup className="">
                                    <Label for="video_thumbnail">
                                      Upload Promo Image
                                    </Label>
                                    <div className="clearfix" />
                                    <div className="img-preview-wrapper">
                                      {x.images_detail?.background_image !==
                                        "" && (
                                        <img
                                          src={
                                            process.env
                                              .REACT_APP_IMAGE_BASE_URL +
                                            x.images_detail.background_image
                                          }
                                          alt=""
                                        />
                                      )}
                                    </div>
                                    <Button.Ripple
                                      color="primary"
                                      className="p-1"
                                      onClick={() => {
                                        setIsPromoImage(true);
                                        setIsSingle(false);
                                        setIsSliderTwo(false);
                                        setIsSliderThree(false);
                                        setModalShow(true);
                                        setCurrentIndex(index);
                                      }}
                                    >
                                      Slider Image
                                    </Button.Ripple>
                                  </FormGroup>
                                </Col>
                                <Col
                                  xs={12}
                                  className="d-flex justify-content-end"
                                >
                                  <DeleteOutlined
                                    color="secondary"
                                    onClick={() => removeSection(index)}
                                  />
                                </Col>
                              </Row>
                            </CardBody>
                          </UncontrolledCollapse>
                        </Card>
                      </div>
                    </div>
                  ))}
                {props.dataLog.login.loggedInUser.role !== "seo" && (
                  <Button.Ripple
                    onClick={addNewSection}
                    color="danger"
                    type="button"
                    className="mt-0"
                    size="sm"
                  >
                    Add New Section
                  </Button.Ripple>
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
                        value={homeData?.widget_content?.meta_details?.title}
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
                          homeData?.widget_content?.meta_details?.description
                        }
                      />
                    </div>
                    <div>
                      <Label for="schema_markup" className="mb-1">
                        Schema Markup
                      </Label>
                      <Input
                        type="textarea"
                        name="schema_markup"
                        id="schema_markup"
                        rows="3"
                        onChange={handleMetaOnChange}
                        value={
                          homeData?.widget_content?.meta_details?.schema_markup
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
      {/* //! ***************************************
      //? ****************Arabic Version*************
      //! ***************************************** */}
      <div className="">
        {props.dataLog.login.loggedInUser.role !== "seo" && (
          <Card className="arabic-home-form">
            <CardHeader>
              <CardTitle>Arabic Slider Section</CardTitle>
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
                    {/* //! **************Slider One************** */}
                    <div className="variation-row-wrapper mb-2">
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader id="item-1">
                            <CardTitle className="lead collapse-title collapsed">
                              First Slider
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
                                  onChange={handleArabicSliderOneOnChange}
                                  value={
                                    homeData?.widget_content?.arabic?.sliderOne
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
                                        homeData?.widget_content?.arabic
                                          ?.sliderOne?.description
                                      }
                                      onChange={(e) =>
                                        handleArabicSliderOneEditor(
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
                    {/* //! **************Slider Two*************** */}
                    <div className="variation-row-wrapper mb-2">
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader id="item-2">
                            <CardTitle className="lead collapse-title collapsed">
                              Second Slider
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
                                  onChange={handleArabicSliderTwoOnChange}
                                  value={
                                    homeData?.widget_content?.arabic?.sliderTwo
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
                                        homeData?.widget_content?.arabic
                                          ?.sliderTwo?.description
                                      }
                                      onChange={(e) =>
                                        handleArabicSliderTwoEditor(
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
                    {/* //! **************Slider Three*************** */}
                    <div className="variation-row-wrapper mb-2">
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader id="item-3">
                            <CardTitle className="lead collapse-title collapsed">
                              Third Slider
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
                                  onChange={handleArabicSliderThreeOnChange}
                                  value={
                                    homeData?.widget_content?.arabic
                                      ?.sliderThree?.title
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
                                        homeData?.widget_content?.arabic
                                          ?.sliderThree?.description
                                      }
                                      onChange={(e) =>
                                        handleArabicSliderThreeEditor(
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
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        )}
        {/* //! **************Slider Bottom Section*************** */}
        {props.dataLog.login.loggedInUser.role !== "seo" && (
          <Card className="arabic-slider-bottom-section">
            <CardHeader>
              <CardTitle>Slider Bottom Section</CardTitle>
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
                    <div className="variation-row-wrapper mb-2">
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader id="item-4">
                            <CardTitle className="lead collapse-title collapsed">
                              Slider Bottom Title
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
                                  value={
                                    homeData?.widget_content?.arabic?.tagSection
                                      ?.title
                                  }
                                  onChange={handleArabicTagOnChange}
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
                                        homeData?.widget_content?.arabic
                                          ?.tagSection?.description
                                      }
                                      onChange={(e) =>
                                        handleArabicTagEditor(
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
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        )}
        {/* //! **************Welcome Section*************** */}
        {props.dataLog.login.loggedInUser.role !== "seo" && (
          <Card className="arabic-welcome-section">
            <CardHeader>
              <CardTitle>Welcome Section</CardTitle>
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
                    <div className="variation-row-wrapper mb-2">
                      <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                        <Card>
                          <CardHeader id="item-5">
                            <CardTitle className="lead collapse-title collapsed">
                              Welcome Section
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
                                  onChange={handleArabicWelcomeOnChange}
                                  value={
                                    homeData?.widget_content?.arabic
                                      ?.welcomeSection?.title
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
                                        homeData?.widget_content?.arabic
                                          ?.welcomeSection?.description
                                      }
                                      onChange={(e) =>
                                        handleArabicWelcomeEditor(
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
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        )}
        {/* //! **************ُPromo Section*************** */}
        <Card className="arabic-promo-section">
          {props.dataLog.login.loggedInUser.role !== "seo" && (
            <CardHeader>
              <CardTitle>Promo Section</CardTitle>
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
                  {props.dataLog.login.loggedInUser.role !== "seo" &&
                    homeData?.widget_content?.arabic?.promoSection?.map(
                      (x, index) => (
                        <div className="variation-row-wrapper mb-2">
                          <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                            <Card>
                              <CardHeader id={`item-${index + 2}`}>
                                <CardTitle className="lead collapse-title collapsed">
                                  Promo {index + 1}
                                </CardTitle>
                              </CardHeader>
                              <UncontrolledCollapse
                                toggler={`item-${index + 2}`}
                              >
                                <CardBody>
                                  <FormGroup className="mb-1">
                                    <Label for="title">Title</Label>
                                    <Field
                                      name="title"
                                      id="title"
                                      onChange={(e) =>
                                        handleArabicPromoOnChange(e, index)
                                      }
                                      value={x.images_detail?.title}
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
                                          data={x.images_detail?.content}
                                          onChange={(e) =>
                                            handleArabicPromoEditor(
                                              e.editor.getData(),
                                              index
                                            )
                                          }
                                        />
                                      </div>
                                    </Col>

                                    <Col
                                      xs={12}
                                      className="d-flex justify-content-end"
                                    >
                                      <DeleteOutlined
                                        color="secondary"
                                        onClick={() =>
                                          removeArabicSection(index)
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </CardBody>
                              </UncontrolledCollapse>
                            </Card>
                          </div>
                        </div>
                      )
                    )}
                  {props.dataLog.login.loggedInUser.role !== "seo" && (
                    <Button.Ripple
                      onClick={addArabicNewSection}
                      color="danger"
                      type="button"
                      className="mt-0"
                      size="sm"
                    >
                      Add New Section
                    </Button.Ripple>
                  )}
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
                            homeData?.widget_content?.arabic?.meta_details
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
                            homeData?.widget_content?.arabic?.meta_details
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
                            homeData?.widget_content?.arabic?.meta_details
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
        <div className="submit-btn-wrap">
          <Button.Ripple onClick={handleSubmit} color="primary" type="submit">
            Submit
          </Button.Ripple>
        </div>
      </div>
    </>
  );
};
// export default HomeForm;
export default connect(mapStateToProps)(HomeForm);
