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
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import "./PregnancyForm.scss";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({});

const mapStateToProps = (props) => {
  return {
    dataLog: props.auth,
  };
};

const PregnancyForm = (props) => {
  const [pregnancyData, setPregnancyData] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [isFirstTrimester, setIsFirstTrimester] = useState(false);
  const [isSecondTrimester, setIsSecondTrimester] = useState(false);
  const [isThirdTrimester, setIsThirdTrimester] = useState(false);
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
      if (isSingle && !isFirstTrimester) {
        let updatedPregnancy = { ...pregnancyData };
        updatedPregnancy.widget_content.pregnancy[currentIndex].featured_img =
          imagesData[index].avatar;
        updatedPregnancy.widget_content.arabic.pregnancy[
          currentIndex
        ].featured_img = imagesData[index].avatar;
        setPregnancyData(updatedPregnancy);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (isFirstTrimester && !isSingle) {
        let updatedPregnancy = { ...pregnancyData };
        updatedPregnancy.widget_content.firstTrimester.image =
          imagesData[index].avatar;
        updatedPregnancy.widget_content.arabic.firstTrimester.image =
          imagesData[index].avatar;
        setPregnancyData(updatedPregnancy);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (
        isSecondTrimester &&
        !isFirstTrimester &&
        !isSingle &&
        !isThirdTrimester
      ) {
        let updatedPregnancy = { ...pregnancyData };
        updatedPregnancy.widget_content.secondTrimester.image =
          imagesData[index].avatar;
        updatedPregnancy.widget_content.arabic.secondTrimester.image =
          imagesData[index].avatar;
        setPregnancyData(updatedPregnancy);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (
        isThirdTrimester &&
        !isFirstTrimester &&
        !isSecondTrimester &&
        !isSingle
      ) {
        let updatedPregnancy = { ...pregnancyData };
        updatedPregnancy.widget_content.thirdTrimester.image =
          imagesData[index].avatar;
        updatedPregnancy.widget_content.arabic.thirdTrimester.image =
          imagesData[index].avatar;
        setPregnancyData(updatedPregnancy);
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

  //!--------------Call Pages API-------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let currentPage = response.data.find((x) => x.slug === "pregnancy");
          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              // debugger;
              if (
                !res.data.widget_content &&
                !res.data[res.data?.length - 1]?.widget_content
              ) {
                res.data.widget_content = initialObj.widget_content;
              }
              if (!res.data[res.data?.length - 1]?.widget_content.arabic) {
                res.data[res.data.length - 1].widget_content.arabic =
                  initialObj.widget_content.arabic;
              }
              if (
                !res.data[res.data?.length - 1]?.widget_content.meta_details
              ) {
                res.data[res.data?.length - 1].widget_content.meta_details =
                  initialObj.widget_content.meta_details;
              }
              //! ----Schema Markup-----
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

              //! -------Trimesters---------
              if (
                !res.data[res.data.length - 1]?.widget_content.firstTrimester
              ) {
                res.data[res.data.length - 1].widget_content.firstTrimester =
                  initialObj.widget_content.firstTrimester;
              }
              if (
                !res.data[res.data.length - 1]?.widget_content.secondTrimester
              ) {
                res.data[res.data.length - 1].widget_content.secondTrimester =
                  initialObj.widget_content.secondTrimester;
              }
              if (
                !res.data[res.data.length - 1]?.widget_content.thirdTrimester
              ) {
                res.data[res.data.length - 1].widget_content.thirdTrimester =
                  initialObj.widget_content.thirdTrimester;
              }
              //!--------Arabic Trimesters---------
              if (
                !res.data[res.data.length - 1]?.widget_content.arabic
                  .firstTrimester
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.firstTrimester =
                  initialObj.widget_content.arabic.firstTrimester;
              }
              if (
                !res.data[res.data.length - 1]?.widget_content.arabic
                  .secondTrimester
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.secondTrimester =
                  initialObj.widget_content.arabic.secondTrimester;
              }
              if (
                !res.data[res.data.length - 1]?.widget_content.arabic
                  .thirdTrimester
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.thirdTrimester =
                  initialObj.widget_content.arabic.thirdTrimester;
              }

              let widget_content =
                res.data?.[res.data?.length - 1]?.widget_content;

              // handling arabic images pre-populate
              // TEMP SOLUTION
              widget_content.pregnancy.forEach((x, index) => {
                widget_content.arabic.pregnancy[index].featured_img =
                  x.featured_img;
              });
              widget_content.arabic.firstTrimester.image =
                widget_content.firstTrimester.image;
              widget_content.arabic.secondTrimester.image =
                widget_content.secondTrimester.image;
              widget_content.arabic.thirdTrimester.image =
                widget_content.thirdTrimester.image;
              // debugger;
              setPregnancyData({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!-----------------Handle Description(ckEditor)---------

  const handleBabyFeedingChange = (value, index, property) => {
    let updatedBabycareData = { ...pregnancyData };
    let updatedData = updatedBabycareData.widget_content;
    updatedData.pregnancy[index][property] = value;
    updatedBabycareData.widget_content = updatedData;
    setPregnancyData(updatedBabycareData);
  };
  
  //!--------Handle First Trimester OnChange---------
  const handleFirstTrimesterOnChange = (value) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.firstTrimester.content = value;
    setPregnancyData(updatedValue);
  };

  //!--------Handle Second Trimester OnChange---------
  const handleSecondTrimesterOnChange = (value) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.secondTrimester.content = value;
    setPregnancyData(updatedValue);
  };

  //!--------Handle Third Trimester OnChange---------
  const handleThirdTrimesterOnChange = (value) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.thirdTrimester.content = value;
    setPregnancyData(updatedValue);
  };

  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setPregnancyData(updatedValue);
  };

  //! *****************************************
  //? ***************Arabic Functions*********
  //! *****************************************
  //-----------------Handle Description(ckEditor)---------

  const handleArabicEditor = (value, index, property) => {
    let updatedBabycareData = { ...pregnancyData };
    let updatedData = updatedBabycareData.widget_content.arabic;
    updatedData.pregnancy[index][property] = value;
    updatedBabycareData.widget_content.arabic = updatedData;
 
    setPregnancyData(updatedBabycareData);
  };

  //--------Handle Arabic First Trimester OnChange---------
  const handleArabicFirstTrimesterOnChange = (value) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.arabic.firstTrimester.content = value;
    setPregnancyData(updatedValue);
  };

  //--------Handle Arabic Second Trimester OnChange---------
  const handleArabicSecondTrimesterOnChange = (value) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.arabic.secondTrimester.content = value;
    setPregnancyData(updatedValue);
  };

  //--------Handle Arabic Third Trimester OnChange---------
  const handleArabicThirdTrimesterOnChange = (value) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.arabic.thirdTrimester.content = value;
    setPregnancyData(updatedValue);
  };
  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...pregnancyData };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setPregnancyData(updatedValue);
  };

  //!----------Handle Submit---------
  const handleSubmit = () => {
    let updatedData = { ...pregnancyData, page_id: pageData._id };
    debugger;
    API.put(`/widgets/${pageData._id}`, updatedData)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          alert("Data updated successfully");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  //?------------------------------
  return (
    <div>
      <Card className="pregnancy-form">
        <CardHeader>
          <CardTitle>Pregnancy Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik initialValues={{}} validationSchema={formSchema}>
            {({ errors, touched }) => (
              <Form>
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="mb-2">
                    <div className="clearfix mb-1" />
                    {pregnancyData.widget_content?.pregnancy?.map((x, index) => (
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
                                  <Col sm={4}>
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
                                          setCurrentIndex(index);
                                          setModalShow(true);
                                        }}
                                      >
                                        Add Featured Image
                                      </Button.Ripple>
                                    </FormGroup>
                                  </Col>
                                  <Col sm={12}>
                                    <div>
                                      <Label for="bodyText">Your Body</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.bodyText}
                                        onChange={(e) =>
                                          handleBabyFeedingChange(
                                            e.editor.getData(),
                                            index,
                                            "bodyText"
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label for="infoText">
                                        Your Information
                                      </Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.infoText}
                                        onChange={(e) =>
                                          handleBabyFeedingChange(
                                            e.editor.getData(),
                                            index,
                                            "infoText"
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label for="babyText">Your Baby</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.babyText}
                                        onChange={(e) =>
                                          handleBabyFeedingChange(
                                            e.editor.getData(),
                                            index,
                                            "babyText"
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
                {/* //! *****************Trimester******************* */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Card>
                    <CardHeader>
                      <CardTitle>Trimesters</CardTitle>
                    </CardHeader>
                    <CardBody>
                      {/* //! *****************First Trimester******************* */}
                      <div className="variation-row-wrapper mb-2">
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader id="item-50" className="accordion-header">
                              <CardTitle className="lead collapse-title collapsed">
                                First Trimester
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler="item-50">
                              <CardBody>
                                <Row>
                                  <Col sm={9}>
                                    <div>
                                      <Label for="bodyText">Content</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={
                                          pregnancyData?.widget_content
                                            ?.firstTrimester?.content
                                        }
                                        onChange={(e) =>
                                          handleFirstTrimesterOnChange(
                                            e.editor.getData()
                                          )
                                        }
                                      />
                                    </div>
                                  </Col>
                                  <Col sm={3}>
                                    <FormGroup className="">
                                      <Label for="image">Image</Label>
                                      <div className="clearfix" />
                                      <div className="img-preview-wrapper">
                                        {pregnancyData?.widget_content
                                          ?.firstTrimester?.image !== "" && (
                                            <img
                                              src={
                                                pregnancyData?.widget_content
                                                  ?.firstTrimester?.image
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
                                          setIsFirstTrimester(true);
                                          setModalShow(true);
                                        }}
                                      >
                                        Add Trimester Image
                                      </Button.Ripple>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </CardBody>
                            </UncontrolledCollapse>
                          </Card>
                        </div>
                      </div>
                      {/* //! *****************Second Trimester******************* */}
                      <div className="variation-row-wrapper mb-2">
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader id="item-51" className="accordion-header">
                              <CardTitle className="lead collapse-title collapsed">
                                Second Trimester
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler="item-51">
                              <CardBody>
                                <Row>
                                  <Col sm={9}>
                                    <div>
                                      <Label for="bodyText">Content</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={
                                          pregnancyData?.widget_content
                                            ?.secondTrimester?.content
                                        }
                                        onChange={(e) =>
                                          handleSecondTrimesterOnChange(
                                            e.editor.getData()
                                          )
                                        }
                                      />
                                    </div>
                                  </Col>
                                  <Col sm={3}>
                                    <FormGroup className="">
                                      <Label for="image">Image</Label>
                                      <div className="clearfix" />
                                      <div className="img-preview-wrapper">
                                        {pregnancyData?.widget_content
                                          ?.secondTrimester?.image !== "" && (
                                            <img
                                              src={
                                                pregnancyData?.widget_content
                                                  ?.secondTrimester?.image
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
                                          setIsFirstTrimester(false);
                                          setIsSecondTrimester(true);
                                          setModalShow(true);
                                        }}
                                      >
                                        Add Trimester Image
                                      </Button.Ripple>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </CardBody>
                            </UncontrolledCollapse>
                          </Card>
                        </div>
                      </div>
                      {/* //! *****************Third Trimester******************* */}
                      <div className="variation-row-wrapper mb-2">
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader id="item-52" className="accordion-header">
                              <CardTitle className="lead collapse-title collapsed">
                                Third Trimester
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler="item-52">
                              <CardBody>
                                <Row>
                                  <Col sm={9}>
                                    <div>
                                      <Label for="bodyText">Content</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={
                                          pregnancyData?.widget_content
                                            ?.thirdTrimester?.content
                                        }
                                        onChange={(e) =>
                                          handleThirdTrimesterOnChange(
                                            e.editor.getData()
                                          )
                                        }
                                      />
                                    </div>
                                  </Col>
                                  <Col sm={3}>
                                    <FormGroup className="">
                                      <Label for="image">Image</Label>
                                      <div className="clearfix" />
                                      <div className="img-preview-wrapper">
                                        {pregnancyData?.widget_content
                                          ?.secondTrimester?.image !== "" && (
                                            <img
                                              src={
                                                pregnancyData?.widget_content
                                                  ?.thirdTrimester?.image
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
                                          setIsFirstTrimester(false);
                                          setIsSecondTrimester(false);
                                          setIsThirdTrimester(true);
                                          setModalShow(true);
                                        }}
                                      >
                                        Add Trimester Image
                                      </Button.Ripple>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </CardBody>
                            </UncontrolledCollapse>
                          </Card>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                }

                {/* //! **********Meta Details************** */}
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
                          pregnancyData?.widget_content?.meta_details?.title
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
                          pregnancyData?.widget_content?.meta_details
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
                          pregnancyData?.widget_content?.meta_details
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
      //? ***************Arabic Version*****************
      //! ***********************************************/}
      <Card className="arabic-pregnancy-form">
        {props.dataLog.login.loggedInUser.role !== 'seo' &&
          <CardHeader>
            <CardTitle>Pregnancy Form</CardTitle>
          </CardHeader>
        }
        <CardBody>
          <Formik initialValues={{}} validationSchema={formSchema}>
            {({ errors, touched }) => (
              <Form>
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="mb-2">
                    <div className="clearfix mb-1" />
                    {pregnancyData.widget_content.arabic.pregnancy?.map(
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
                                      <div>
                                        <Label for="bodyText">Your Body</Label>
                                        <CKEditor
                                          onBeforeLoad={(CKEDITOR) =>
                                            (CKEDITOR.disableAutoInline = true)
                                          }
                                          data={x.bodyText}
                                          onChange={(e) =>
                                            handleArabicEditor(
                                              e.editor.getData(),
                                              index,
                                              "bodyText"
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label for="infoText">
                                          Your Information
                                        </Label>
                                        <CKEditor
                                          onBeforeLoad={(CKEDITOR) =>
                                            (CKEDITOR.disableAutoInline = true)
                                          }
                                          data={x.infoText}
                                          onChange={(e) =>
                                            handleArabicEditor(
                                              e.editor.getData(),
                                              index,
                                              "infoText"
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label for="babyText">Your Baby</Label>
                                        <CKEditor
                                          onBeforeLoad={(CKEDITOR) =>
                                            (CKEDITOR.disableAutoInline = true)
                                          }
                                          data={x.babyText}
                                          onChange={(e) =>
                                            handleArabicEditor(
                                              e.editor.getData(),
                                              index,
                                              "babyText"
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
                {/* //! *****************Arabic Trimesters******************* */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Card>
                    <CardHeader>
                      <CardTitle>Trimesters</CardTitle>
                    </CardHeader>
                    <CardBody>
                      {/* //! *****************First Trimester******************* */}
                      <div className="variation-row-wrapper mb-2">
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader id="item-53" className="accordion-header">
                              <CardTitle className="lead collapse-title collapsed">
                                First Trimester
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler="item-53">
                              <CardBody>
                                <Row>
                                  <Col sm={12}>
                                    <div>
                                      <Label for="bodyText">Content</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={
                                          pregnancyData?.widget_content.arabic
                                            ?.firstTrimester?.content
                                        }
                                        onChange={(e) =>
                                          handleArabicFirstTrimesterOnChange(
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
                      {/* //! *****************Second Trimester******************* */}
                      <div className="variation-row-wrapper mb-2">
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader id="item-54" className="accordion-header">
                              <CardTitle className="lead collapse-title collapsed">
                                Second Trimester
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler="item-54">
                              <CardBody>
                                <Row>
                                  <Col sm={12}>
                                    <div>
                                      <Label for="bodyText">Content</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={
                                          pregnancyData?.widget_content.arabic
                                            ?.secondTrimester?.content
                                        }
                                        onChange={(e) =>
                                          handleArabicSecondTrimesterOnChange(
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
                      {/* //! *****************Third Trimester******************* */}
                      <div className="variation-row-wrapper mb-2">
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader id="item-52" className="accordion-header">
                              <CardTitle className="lead collapse-title collapsed">
                                Third Trimester
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler="item-52">
                              <CardBody>
                                <Row>
                                  <Col sm={12}>
                                    <div>
                                      <Label for="bodyText">Content</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={
                                          pregnancyData?.widget_content.arabic
                                            ?.thirdTrimester?.content
                                        }
                                        onChange={(e) =>
                                          handleArabicThirdTrimesterOnChange(
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
                    </CardBody>
                  </Card>
                }
                {/* //! **************Arabic Meta Details************** */}
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
                          pregnancyData?.widget_content?.arabic?.meta_details
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
                          pregnancyData?.widget_content?.arabic.meta_details
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
                          pregnancyData?.widget_content?.arabic?.meta_details
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

// export default PregnancyForm;
export default connect(mapStateToProps)(PregnancyForm);


const initialObj = {
  widget_name: "pregnancy",
  page_id: 0,
  widget_type: "pregnancy",
  widget_content: {
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    firstTrimester: {
      content: "",
      image: "",
    },
    secondTrimester: {
      content: "",
      image: "",
    },
    thirdTrimester: {
      content: "",
      image: "",
    },
    pregnancy: [
      {
        tabName: "1st month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "2nd month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "3rd month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "4th month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "5th month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "6th month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },

      {
        tabName: "7th month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "8th month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "9th month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
      {
        tabName: "10th month",
        bodyText: "",
        infoText: "",
        babyText: "",
        featured_img: "",
      },
    ],
    arabic: {
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
      firstTrimester: {
        content: "",
        image: "",
      },
      secondTrimester: {
        content: "",
        image: "",
      },
      thirdTrimester: {
        content: "",
        image: "",
      },
      pregnancy: [
        {
          tabName: "الشهر الأول",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر الثاني",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر الثالث",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر الرابع",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر الخامس",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر السادس",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },

        {
          tabName: "الشهر السابع",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر الثامن",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر التاسع",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
        {
          tabName: "الشهر العاشر",
          bodyText: "",
          infoText: "",
          babyText: "",
          featured_img: "",
        },
      ],
    },
  },
};
