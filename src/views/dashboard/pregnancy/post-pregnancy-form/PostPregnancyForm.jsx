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
import "./PostPregnancyForm.scss";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  widget_name: "post-pregnancy",
  page_id: 0,
  widget_type: "post-pregnancy",
  widget_content: {
    title: "",
    short_description: "",
    featured_img: "",
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    pregnancy: [
      {
        title: "Abdomen",
        description: "",
        featured_img: "",
      },
      {
        title: "Hips",
        description: "",
        featured_img: "",
      },
      {
        title: "Legs",
        description: "",
        featured_img: "",
      },
    ],
    arabic: {
      title: "",
      short_description: "",
      featured_img: "",
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
      pregnancy: [
        {
          title: "",
          description: "",
          featured_img: "",
        },
        {
          title: "",
          description: "",
          featured_img: "",
        },
        {
          title: "",
          description: "",
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


const PostPregnancy = (props) => {
  const { id } = useParams();
  const [postPregnancy, setPostPregnancy] = useState(initialObj);
  const [isEdit, setIsEdit] = useState(false);
  const [pageData, setPageData] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);

  const [isSingle, setIsSingle] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  //!-------------Gallery----------------
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

  //!-------handleSelect s3 Images-----------
  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (!isSingle && isBanner) {
        setPostPregnancy({
          ...postPregnancy,
          widget_content: {
            ...postPregnancy.widget_content,
            featured_img: imagesData[index].avatar,
            arabic: {
              ...postPregnancy.widget_content.arabic,
              featured_img: imagesData[index].avatar,
            },
          },
        });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      }
      if (isSingle && !isBanner) {
        let updatedPregnancy = { ...postPregnancy };
        updatedPregnancy.widget_content.pregnancy[currentIndex].featured_img =
          imagesData[index].avatar;
        updatedPregnancy.widget_content.arabic.pregnancy[
          currentIndex
        ].featured_img = imagesData[index].avatar;
        setPostPregnancy(updatedPregnancy);

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
          let currentPage = response.data.find(
            (x) => x.slug === "post-pregnancy"
          );
          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              if (
                !res.data?.widget_content &&
                !res.data[res.data?.length - 1]?.widget_content
              ) {
                res.data.widget_content = initialObj.widget_content;
              }
              if (
                !res.data[res.data?.length - 1]?.widget_content.meta_details
                  .schema_markup
              ) {
                res.data[
                  res.data?.length - 1
                ].widget_content.meta_details.schema_markup =
                  initialObj.widget_content.meta_details.schema_markup;
              }

              if (
                !res.data[res.data?.length - 1]?.widget_content.arabic
                  .meta_details.schema_markup
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.meta_details.schema_markup =
                  initialObj.widget_content.arabic.meta_details.schema_markup;
              }

              let widget_content =
                res.data?.[res.data?.length - 1]?.widget_content;
              setPostPregnancy({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!---------Handle Input Field-----------

  const handleFields = (e) => {
    let updateValues = { ...postPregnancy };
    let update = updateValues.widget_content;
    update[e.target.name] = e.target.value;
    updateValues.widget_content = update;
    setPostPregnancy(updateValues);
  };
  //!---------Handle Inner onChange-----------

  const handleInnerFields = (e, index) => {
    let updateValues = { ...postPregnancy };
    let update = updateValues.widget_content.pregnancy;
    update[index][e.target.name] = e.target.value;
    updateValues.widget_content.pregnancy = update;
    setPostPregnancy(updateValues);
  };
  //!-----------------Handle Description(ckEditor)---------

  const handleBabyFeedingChange = (value, index, property) => {
    let updatedBabycareData = { ...postPregnancy };
    let updatedData = updatedBabycareData.widget_content;
    updatedData.pregnancy[index][property] = value;
    updatedBabycareData.widget_content = updatedData;
    setPostPregnancy(updatedBabycareData);
  };
  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...postPregnancy };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setPostPregnancy(updatedValue);
  };

  //! ********************************
  //? ********Arabic Function*******
  //! ********************************

  //---------Handle onChange-----------

  const handleArabicOnChange = (e) => {
    let updateValues = { ...postPregnancy };
    let update = updateValues.widget_content.arabic;
    update[e.target.name] = e.target.value;
    updateValues.widget_content.arabic = update;
    setPostPregnancy(updateValues);
  };

  //---------Handle Main Editor---------------
  const handleArabicMainEditor = (value) => {
    let updatedValue = { ...postPregnancy };
    let update = updatedValue.widget_content.arabic;
    update.short_description = value;
    updatedValue.widget_content.arabic = update;
    setPostPregnancy(updatedValue);
  };

  //---------Handle Inner section onChnage-----------

  const handleInnerArabicOnChange = (e, index) => {
    let updateValues = { ...postPregnancy };
    let update = updateValues.widget_content.arabic.pregnancy;
    update[index][e.target.name] = e.target.value;
    updateValues.widget_content.arabic.pregnancy = update;
    setPostPregnancy(updateValues);
  };

  //------------Handle Description(ckEditor)---------
  const handleArabicEditor = (value, index, property) => {
    let updatedBabycareData = { ...postPregnancy };
    let updatedData = updatedBabycareData.widget_content.arabic;
    updatedData.pregnancy[index][property] = value;
    updatedBabycareData.widget_content.arabic = updatedData;
    setPostPregnancy(updatedBabycareData);
  };
  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...postPregnancy };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setPostPregnancy(updatedValue);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    const updatedData = { ...postPregnancy, page_id: pageData._id };

    // assigning english images to arabic fields
    // TEMP SOLUTION
    updatedData.widget_content.arabic.featured_img =
      updatedData.widget_content.featured_img;
    updatedData.widget_content.arabic.pregnancy[0].featured_img =
      updatedData.widget_content.pregnancy[0].featured_img;
    updatedData.widget_content.arabic.pregnancy[1].featured_img =
      updatedData.widget_content.pregnancy[1].featured_img;
    updatedData.widget_content.arabic.pregnancy[2].featured_img =
      updatedData.widget_content.pregnancy[2].featured_img;

    API.post(`widgets`, updatedData)
      .then((response) => {
        if (response.status === 200 || response === 201) {
          alert("Data updated successfully");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card className="postPregnancy-add-form">
        <CardHeader>
          <CardTitle>Post Pregnancy Form</CardTitle>
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
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Card className="inner-card-wrap">
                    <CardHeader>
                      <CardTitle>First Section</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className="mb-1">
                        <Label for="title">Title</Label>
                        <Field
                          name="title"
                          id="title"
                          onChange={handleFields}
                          value={postPregnancy.widget_content.title}
                          className={`form-control`}
                        />
                      </FormGroup>
                      <Row>
                        <Col sm={9}>
                          <div>
                            <Label for="short_description">Description</Label>
                            <CKEditor
                              onBeforeLoad={(CKEDITOR) =>
                                (CKEDITOR.disableAutoInline = true)
                              }
                              data={
                                postPregnancy.widget_content.short_description
                              }
                              onChange={(e) =>
                                setPostPregnancy({
                                  ...postPregnancy,
                                  widget_content: {
                                    ...postPregnancy.widget_content,
                                    short_description: e.editor.getData(),
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
                              {postPregnancy.widget_content.featured_img !==
                                "" && (
                                  <img
                                    src={postPregnancy.widget_content.featured_img}
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
                              Add Featured Image
                            </Button.Ripple>
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        {selectedImages?.map((x, index) => (
                          <Col sm={3} key={index}>
                            <div className="img-preview-wrapper preview-small">
                              <img src={x} alt="" />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </CardBody>
                  </Card>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Card>
                    <CardHeader>
                      <CardTitle>Second Section</CardTitle>
                    </CardHeader>
                    <CardBody>
                      {postPregnancy?.widget_content?.pregnancy?.map(
                        (x, index) => (
                          <div className="variation-row-wrapper mb-2" key={index}>
                            <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                              <Card>
                                <CardHeader
                                  id={`item-${index}`}
                                  className="accordion-header"
                                >
                                  <CardTitle className="lead collapse-title collapsed">
                                    {x.title}
                                  </CardTitle>
                                </CardHeader>
                                <UncontrolledCollapse toggler={`item-${index}`}>
                                  <CardBody>
                                    <CardTitle>{x.tabName}</CardTitle>
                                    <FormGroup className="mb-1">
                                      <Label for="title">Title</Label>
                                      <Field
                                        name="title"
                                        id="title"
                                        onChange={(e) =>
                                          handleInnerFields(e, index)
                                        }
                                        value={x.title}
                                        className={`form-control`}
                                      />
                                    </FormGroup>

                                    <Row>
                                      <Col sm={9}>
                                        <div>
                                          <Label for="description">
                                            Description
                                          </Label>
                                          <CKEditor
                                            onBeforeLoad={(CKEDITOR) =>
                                              (CKEDITOR.disableAutoInline = true)
                                            }
                                            data={x.description}
                                            onChange={(e) =>
                                              handleBabyFeedingChange(
                                                e.editor.getData(),
                                                index,
                                                "description"
                                              )
                                            }
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
                                              setCurrentIndex(index);
                                              setIsBanner(false);
                                              setModalShow(true);
                                            }}
                                          >
                                            Add Featured Image
                                          </Button.Ripple>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </CardBody>
                                </UncontrolledCollapse>
                              </Card>
                            </div>
                          </div>
                        )
                      )}
                    </CardBody>
                  </Card>
                }
                <div className="submit-btn-wrap">
                  <Button.Ripple
                    onClick={handleSubmit}
                    color="primary"
                    type="submit"
                  >
                    {isEdit ? "Edit" : "Submit"}
                  </Button.Ripple>
                </div>
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
                          postPregnancy?.widget_content?.meta_details?.title
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
                          postPregnancy?.widget_content?.meta_details
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
                          postPregnancy?.widget_content?.meta_details
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

      {/* //! **************************************************
      //? **************Arabic version********************
      //! ************************************************** */}

      <Card className="arabic-postPregnancy-form">
        {props.dataLog.login.loggedInUser.role !== 'seo' &&
          <CardHeader>
            <CardTitle>Arabic Post Pregnancy Form</CardTitle>
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
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Card className="inner-card-wrap">
                    <CardHeader>
                      <CardTitle>First Section</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className="mb-1">
                        <Label for="title">Title</Label>
                        <Field
                          name="title"
                          id="title"
                          onChange={handleArabicOnChange}
                          value={postPregnancy.widget_content.arabic.title}
                          className={`form-control`}
                        />
                      </FormGroup>
                      <Row>
                        <Col sm={12}>
                          <div>
                            <Label for="short_description">Description</Label>
                            <CKEditor
                              onBeforeLoad={(CKEDITOR) =>
                                (CKEDITOR.disableAutoInline = true)
                              }
                              data={
                                postPregnancy.widget_content.arabic
                                  .short_description
                              }
                              onChange={(e) =>
                                handleArabicMainEditor(e.editor.getData())
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Card>
                    <CardHeader>
                      <CardTitle>Second Section</CardTitle>
                    </CardHeader>
                    <CardBody>
                      {postPregnancy?.widget_content?.arabic?.pregnancy?.map(
                        (x, index) => (
                          <div className="variation-row-wrapper mb-2" key={index}>
                            <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                              <Card>
                                <CardHeader
                                  id={`item-${index}`}
                                  className="accordion-header"
                                >
                                  <CardTitle className="lead collapse-title collapsed">
                                    {x.title}
                                  </CardTitle>
                                </CardHeader>
                                <UncontrolledCollapse toggler={`item-${index}`}>
                                  <CardBody>
                                    {/* <CardTitle>Arabic</CardTitle> */}
                                    <FormGroup className="mb-1">
                                      <Label for="title">Title</Label>
                                      <Field
                                        name="title"
                                        id="title"
                                        onChange={(e) =>
                                          handleInnerArabicOnChange(e, index)
                                        }
                                        value={x.title}
                                        className={`form-control`}
                                      />
                                    </FormGroup>

                                    <Row>
                                      <Col sm={12}>
                                        <div>
                                          <Label for="description">
                                            Description
                                          </Label>
                                          <CKEditor
                                            onBeforeLoad={(CKEDITOR) =>
                                              (CKEDITOR.disableAutoInline = true)
                                            }
                                            data={x.description}
                                            onChange={(e) =>
                                              handleArabicEditor(
                                                e.editor.getData(),
                                                index,
                                                "description"
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
                    </CardBody>
                  </Card>
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
                          postPregnancy?.widget_content?.arabic?.meta_details
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
                          postPregnancy?.widget_content?.arabic?.meta_details
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
                          postPregnancy?.widget_content?.arabic?.meta_details
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
    </>
  );
};

// export default PostPregnancy;
export default connect(mapStateToProps)(PostPregnancy);

