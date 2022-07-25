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
  CustomInput,
  UncontrolledCollapse,
  Input,
} from "reactstrap";
import { DeleteOutlined } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./ArticleForm.scss";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../gallery-modal/GalleryModal";
import { API } from "../../../http/API";
import { connect } from "react-redux";


const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  category_id: "",
  title: "",
  exert: "",
  featured_img: "",
  banner_img: "",
  route: "",
  category_route: "",
  content: [
    {
      description: "",
      image: "",
    },
  ],
  meta_details: {
    title: "",
    description: "",
    schema_markup: "",
  },
  arabic: {
    title: "",
    exert: "",
    featured_img: "",
    banner_img: "",
    category_id: "",
    category_route: "",
    content: [
      {
        description: "",
        image: "",
      },
    ],
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
  },
};

const mapStateToProps = (props) => {
  return {
    dataLog: props.auth,
  };
};

const ArticleForm = (props) => {
  const { id } = useParams();
  const history = useHistory();

  const [articleData, setArticleData] = useState({ ...initialObj });
  const [articleCategories, setArticleCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [paraImage, setParaImage] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  //!------------Gallery--------
  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:8db4219e-3012-4027-ac2e-60ec65e9ca84",
  });

  var albumBucketName = "pigeon-gallery";
  var s3 = new AWS.S3({
    apiVersion: "2011-12-05",
    params: { Bucket: albumBucketName },
  });

  useEffect(() => {
    getGalleryImages();
  }, []);

  useEffect(
    () => {
      setArticleData({
        ...articleData,
        route: `${articleData.title.replace(/\s+/g, "-").toLocaleLowerCase()}`,
      });
    },
    isEdit ? [] : [articleData.title]
  );
  //!----------Aricles Api call--------
  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/articles/${id}`)
        .then((res) => {
          console.log("useEffect 1st ::", res)
          if (!res.data.arabic) {
            res.data.arabic = initialObj.arabic;
          }
          if (!res.data.arabic.meta_details.schema_markup) {
            res.data.arabic.meta_details.schema_markup =
              initialObj.arabic.meta_details.schema_markup;
          }
          if (!res.data.meta_details.schema_markup) {
            res.data.meta_details.schema_markup =
              initialObj.meta_details.schema_markup;
          }
          // debugger;
          if (!res.data.exert) {
            res.data.exert = initialObj.exert;
          }
          if (!res.data.arabic.exert) {
            res.data.arabic.exert = initialObj.arabic.exert;
          }

          setArticleData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    API.get("/article_category")
      .then((response) => {
        setArticleCategories(response.data);
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
        setArticleData({
          ...articleData,
          featured_img: imagesData[index].avatar,
        });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else if (paraImage && !isSingle && !isBanner) {
        // debugger;
        let updatedArticle = { ...articleData };
        updatedArticle.content[currentIndex].image = imagesData[index].avatar;
        setArticleData(updatedArticle);

        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else if (!isSingle && isBanner) {
        setArticleData({
          ...articleData,
          banner_img: imagesData[index].avatar,
        });
        setBannerThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else {
        setSelectedImages([...selectedImages, imagesData[index].avatar]);
        setArticleData({
          ...articleData,
          images_list: [...articleData.images_list, imagesData[index].avatar],
        });
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
    } else {
      if (isSingle && !isBanner) {
        setArticleData({ ...articleData, thumbnail: "" });
        setThumbnailPreview("");
      } else if (!isSingle && isBanner) {
        setArticleData({ ...articleData, banner_img: "" });
        setBannerThumbnailPreview("");
      } else {
        setSelectedImages(
          selectedImages.filter((x) => x !== imagesData[index].avatar)
        );
      }
      setImagesData(
        imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: false,
            };
          } else {
            return x;
          }
        })
      );
    }
  };

  //!--------------Aricles Api call for Edit--------
  useEffect(() => {
    if (id && id !== "") {
      // debugger;
      setIsEdit(true);
      API.get(`/articles/${id}`)
        .then((res) => {
          // debugger;
          console.log("useEffect 2nd ::", res)
          if (!res.data.arabic) {
            res.data.arabic = initialObj.arabic;
          }
          if (!res.data.arabic.meta_details) {
            res.data.arabic.meta_details = initialObj.arabic.meta_details;
          }
          if (!res.data.meta_details) {
            res.data.meta_details = initialObj.meta_details;
          }
          let arabicContents = [];
          res.data.content.forEach((x) => {
            arabicContents.push({
              description: x.arabic.description,
              image: x.image,
            });
          });
          // debugger;
          res.data.arabic.content = arabicContents;

          setArticleData(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  //!-----------Handle Input Fields---------

  const handleFieldChange = (e) => {
    let updatedArticleData = { ...articleData };
    updatedArticleData[e.target.name] = e.target.value;
    setArticleData(updatedArticleData);
  };

  const handleArabicFieldChange = (e) => {
    // debugger;
    let updatedArticleData = { ...articleData };
    updatedArticleData.arabic[e.target.name] = e.target.value;
    setArticleData(updatedArticleData);
  };

  //!--------Handle Category Select--------
  const handleCategorySelect = (e) => {
    // debugger;
    let updatedArticleData = { ...articleData };
    updatedArticleData[e.target.name] = e.target.value;
    updatedArticleData.category_route = articleCategories?.find(
      (x) => x._id === e.target.value
    )?.route;
    setArticleData(updatedArticleData);
  };

  //!----------ADD New Paragraph------
  const addParagraph = () => {
    // debugger;
    let updatedValue = { ...articleData };
    updatedValue.content.push({
      description: "",
      image: "",
    });
    updatedValue.arabic.content.push({
      description: "",
      image: "",
    });
    setArticleData(updatedValue);
  };
  //!----------Remove Paragraph------
  const removeParagraph = (index) => {
    let updatedValue = { ...articleData };
    let updatedArticle = updatedValue.content.filter((x, i) => i !== index);
    updatedValue.content = updatedArticle;
    setArticleData(updatedValue);
  };

  //!----------ARABIC ADD New Paragraph------
  const addArabicParagraph = () => {
    // debugger;
    let updatedValue = { ...articleData };
    updatedValue.content.push({
      description: "",
      image: "",
    });
    updatedValue.arabic.content.push({
      description: "",
      image: "",
    });

    setArticleData(updatedValue);
  };
  //!----------ARABIC Remove Paragraph------
  const removeArabicParagraph = (index) => {
    let updatedValue = { ...articleData };
    let updatedArticleContent = updatedValue.arabic.content.filter(
      (x, i) => i !== index
    );
    updatedValue.arabic.content = updatedArticleContent;
    setArticleData(updatedValue);
  };

  //!------------Handle Ck Editor---------
  const handleEditor = (index, value, property) => {
    // debugger;
    let updatedValue = { ...articleData };
    let updatedData = updatedValue.content;
    updatedData[index][property] = value;
    updatedValue.content = updatedData;
    setArticleData(updatedValue);
  };
  //!------Handle Exert CkEditor-----
  const handleExertEditor = (value) => {
    let updatedValue = { ...articleData };
    updatedValue.exert = value;
    setArticleData(updatedValue);
  };

  //!------------ARABIC Handle Ck Editor---------
  const handleArabicEditor = (index, value, property) => {
    // debugger;
    let updatedValue = { ...articleData };
    let updatedData = updatedValue.arabic.content;
    updatedData[index][property] = value;
    updatedValue.arabic.content = updatedData;
    setArticleData(updatedValue);
  };
  // //--------Handle Arabic Category Select--------
  // const handleArabicCategorySelect = (e) => {
  //   // debugger;
  //   let updatedArticleData = { ...articleData };
  //   updatedArticleData.arabic[e.target.name] = e.target.value;
  //   updatedArticleData.arabic.category_route = articleCategories?.find(
  //     (x) => x._id === e.target.value
  //   )?.route;
  //   setArticleData(updatedArticleData);
  // };
  //! ________ Meta Detail Fields_________
  const handleMetaOnChange = (e) => {
    // debugger;
    let updatedData = { ...articleData };
    updatedData.meta_details[e.target.name] = e.target.value;
    setArticleData(updatedData);
  };

  //! *******Arabic Meta Detail Fields********
  const handleArabicMetaOnChange = (e) => {
    // debugger;
    let updatedData = { ...articleData };
    updatedData.arabic.meta_details[e.target.name] = e.target.value;
    setArticleData(updatedData);
  };
  //!------Handle Exert CkEditor-----
  const handleExertArabicEditor = (value) => {
    let updatedValue = { ...articleData };
    updatedValue.arabic.exert = value;
    setArticleData(updatedValue);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    let updatedData = { ...articleData };
    updatedData.arabic.category_id = updatedData.category_id;
    updatedData.arabic.banner_img = updatedData.banner_img;
    updatedData.arabic.featured_img = updatedData.featured_img;
    updatedData.arabic.category_route = updatedData.category_route;
    updatedData.content.forEach((x, index) => {
      updatedData.arabic.content[index].image = x.image;
    });
    // debugger;
    if (isEdit) {
      let updateId = updatedData.route;
      delete updatedData["_id"];
      API.put(`/articles/${updateId}`, updatedData)
        .then((res) => {
          alert("Article updated successfully");
          history.push("/article/list");
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post(`/articles`, articleData)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            alert("Article added successfully");
            history.push("/article/list");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Card className="feeding-advisor-form">
        <CardHeader>
          <CardTitle>Article Form</CardTitle>
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
                  <FormGroup>
                    <Label for="category_id">Select Category</Label>
                    <CustomInput
                      type="select"
                      name="category_id"
                      id="category_id"
                      // value={articleData?.widget_content?.category_id}
                      value={articleData.category_id}
                      onChange={handleCategorySelect}
                    // onChange={handleCategorySelect}
                    >
                      <option value="all">Select Category</option>
                      {articleCategories?.map((x) => (
                        <React.Fragment key={x._id}>
                          <option value={x._id}>{x.title}</option>
                        </React.Fragment>
                      ))}
                    </CustomInput>
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="mb-1">
                    <Label for="title">Title</Label>
                    <Field
                      name="title"
                      id="title"
                      onChange={handleFieldChange}
                      value={articleData.title}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="mb-1">
                    <Label for="route">Route</Label>
                    <Field
                      name="route"
                      id="route"
                      onChange={handleFieldChange}
                      value={articleData.route}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div>
                    <Label for="exert">Exert</Label>
                    <CKEditor
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={articleData?.exert}
                      onChange={(e) => {
                        handleExertEditor(e.editor.getData());
                      }}
                    />
                  </div>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Row>
                    <Col sm={6}>
                      <FormGroup className="">
                        <Label for="featured_img">Banner Images</Label>
                        <div className="clearfix" />
                        <div className="img-preview-wrapper">
                          {articleData.banner_img !== "" && (
                            <img src={articleData.banner_img} alt="" />
                          )}
                        </div>
                        <Button.Ripple
                          color="primary"
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
                          {articleData.featured_img !== "" && (
                            <img src={articleData.featured_img} alt="" />
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
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Row>
                    {articleData?.content?.map((x, index) => (
                      <div
                        className="variation-row-wrapper mb-2"
                        style={{ width: "100%" }}
                        key={index}
                      >
                        <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                          <Card>
                            <CardHeader
                              id={`item-${index}`}
                              className="accordion-header"
                            >
                              <CardTitle className="lead collapse-title collapsed">
                                Description
                              </CardTitle>
                            </CardHeader>
                            <UncontrolledCollapse toggler={`item-${index}`}>
                              <CardBody>
                                <Row>
                                  <Col sm={9}>
                                    <div>
                                      <Label for="description">Description</Label>
                                      <CKEditor
                                        onBeforeLoad={(CKEDITOR) =>
                                          (CKEDITOR.disableAutoInline = true)
                                        }
                                        data={x.description}
                                        onChange={(e) => {
                                          handleEditor(
                                            index,
                                            e.editor.getData(),
                                            "description"
                                          );
                                        }}
                                      />
                                    </div>
                                  </Col>
                                  <Col sm={3}>
                                    <FormGroup className="">
                                      <Label for="featured_img">Image</Label>
                                      <div className="clearfix" />
                                      <div className="img-preview-wrapper">
                                        {x.image !== "" && (
                                          <img src={x.image} alt="" />
                                        )}
                                      </div>
                                      <Button.Ripple
                                        color="primary"
                                        className="p-1"
                                        onClick={() => {
                                          setIsSingle(false);
                                          setParaImage(true);
                                          setCurrentIndex(index);
                                          setIsBanner(false);
                                          setModalShow(true);
                                        }}
                                      >
                                        Add Image
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
                                      onClick={() => removeParagraph(index)}
                                    />
                                  </div>
                                </Col>
                              </CardBody>
                            </UncontrolledCollapse>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </Row>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&

                  <Button.Ripple
                    onClick={addParagraph}
                    color="danger"
                    type="button"
                    className="mt-0"
                    size="sm"
                  >
                    Add Next Paragraph
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
                        value={articleData?.meta_details?.title}
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
                        value={articleData?.meta_details?.description}
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
                        onChange={handleMetaOnChange}
                        value={articleData?.meta_details?.schema_markup}
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
      {/* *********************
     //! ARABIC VERSION FIELDS
      ********************* */}
      {isEdit && (
        // <Card style={{ background: '#f0f0f0', boxShadow: `0px 4px 25px 0px rgba(230, 85, 80, 0.4)` }}>
        <Card style={{ background: "rgba(230,85,80,.15)" }}>
          <CardBody>
            <div className="arabic-form">
              <h3>Arabic Fields</h3>
              <Formik
                initialValues={{
                  required: "",
                  email: "",
                  url: "",
                  number: "",
                  date: "",
                  minlength: "",
                  maxlength: "",
                }}
                validationSchema={formSchema}
              >
                {({ errors, touched }) => (
                  <Form>
                    {/* <FormGroup>
                      <Label for="category_id">Select Category</Label>
                      <CustomInput
                        type="select"
                        name="category_id"
                        id="category_id"
                        // value={articleData?.widget_content?.category_id}
                        value={articleData?.arabic?.category_id}
                        onChange={handleArabicCategorySelect}
                        // onChange={handleCategorySelect}
                      >
                        <option value="all">Select Category</option>
                        {articleCategories?.map((x) => (
                          <React.Fragment key={x._id}>
                            <option value={x._id}>{x.title}</option>
                          </React.Fragment>
                        ))}
                      </CustomInput>
                    </FormGroup> */}
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <FormGroup className="mb-1">
                        <Label for="title">Title</Label>
                        <Field
                          name="title"
                          id="title"
                          onChange={handleArabicFieldChange}
                          value={articleData?.arabic?.title}
                          className={`form-control`}
                        />
                      </FormGroup>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <div>
                        <Label for="exert">Exert</Label>
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          data={articleData?.arabic?.exert}
                          onChange={(e) => {
                            handleExertArabicEditor(e.editor.getData());
                          }}
                        />
                      </div>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <CardBody>
                        <Row>
                          {console.log("articleData ::", articleData)}
                          {articleData?.arabic?.content?.map((x, index) => (
                            <div
                              className="variation-row-wrapper mb-2"
                              style={{ width: "100%" }}
                              key={index}
                            >
                              <div className="vx-collapse collapse-bordered collapse-icon accordion-icon-rotate">
                                <Card>
                                  <CardHeader
                                    id={`item-arabic-${index}`}
                                    className="accordion-header"
                                  >
                                    <CardTitle className="lead collapse-title collapsed">
                                      Description
                                    </CardTitle>
                                  </CardHeader>
                                  <UncontrolledCollapse
                                    toggler={`item-arabic-${index}`}
                                  >
                                    <CardBody>
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
                                              onChange={(e) => {
                                                handleArabicEditor(
                                                  index,
                                                  e.editor.getData(),
                                                  "description"
                                                );
                                              }}
                                            />
                                          </div>
                                        </Col>
                                      </Row>
                                      <Col sm={12}>
                                        <div
                                          style={{
                                            height: "100%",
                                            cursor: "pointer",
                                          }}
                                          className="d-flex align-items-center justify-content-end"
                                        >
                                          <DeleteOutlined
                                            color="secondary"
                                            onClick={() =>
                                              removeArabicParagraph(index)
                                            }
                                          />
                                        </div>
                                      </Col>
                                    </CardBody>
                                  </UncontrolledCollapse>
                                </Card>
                              </div>
                            </div>
                          ))}
                        </Row>
                      </CardBody>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&

                      <Button.Ripple
                        onClick={addArabicParagraph}
                        color="danger"
                        type="button"
                        className="mt-0"
                        size="sm"
                      >
                        Add Next Paragraph
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
                            value={articleData?.arabic?.meta_details?.title}
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
                              articleData?.arabic?.meta_details?.description
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
                              articleData?.arabic?.meta_details?.schema_markup
                            }
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Form>
                )}
              </Formik>
            </div>
          </CardBody>
        </Card>
      )}
      <Card>
        <CardBody>
          {/* //!----------Submit Button--------------- */}
          <Button.Ripple
            onClick={handleSubmit}
            color="primary"
            type="submit"
            className="mt-2"
          >
            {isEdit ? "Update" : "Add"}
          </Button.Ripple>
        </CardBody>
      </Card>
    </>
  );
};

// export default ArticleForm;
export default connect(mapStateToProps)(ArticleForm);


// let arabicContents = [];
// res.data.content.forEach(x=>{
// arabicContents.push({
// description: "",
// image: x.image
// })
// })

// res.data.arabic.content = arabicContents;
