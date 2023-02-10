import React, { useState, useEffect } from "react";
import "./BlogGridFrom.scss";
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
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  title: "",
  route: "",
  cms_route: "",
  slug: "",
  description: "",
  exert: "",
  banner_img: "",
  featured_img: "",
  meta_title: "",
  meta_details: "",
  schema_markup: "",
  arabic: {
    title: "",
    description: "",
    exert: "",
    route: "",
    meta_title: "",
    meta_details: "",
    schema_markup: "",
  },
};

const mapStateToProps = (props) => {
  return {
    dataLog: props.auth,
  };
};

const BlogGridForm = (props) => {
  const { id } = useParams();
  const history = useHistory();

  const [blogData, setBlogData] = useState({ ...initialObj });
  const [isEdit, setIsEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [paraImage, setParaImage] = useState(false);
  const [isBanner, setIsBanner] = useState(false);
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
      setBlogData({
        ...blogData,
        route: `${blogData.title.replace(/\s+/g, "-").toLocaleLowerCase()}`,
      });
    },
    isEdit ? [] : [blogData.title]
  );
  //!----------Aricles Api call--------
  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/blogs/${id}`)
        .then((res) => {
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

          setBlogData(res.data);
        })
        .catch((err) => console.log(err));
    }
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

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && !isBanner) {
        setBlogData({
          ...blogData,
          featured_img: imagesData[index].avatar,
        });
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else if (paraImage && !isSingle && !isBanner) {
        // debugger;
        let updatedArticle = { ...blogData };
        updatedArticle.content[currentIndex].image = imagesData[index].avatar;
        setBlogData(updatedArticle);

        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else if (!isSingle && isBanner) {
        setBlogData({
          ...blogData,
          banner_img: imagesData[index].avatar,
        });
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else {
        setSelectedImages([...selectedImages, imagesData[index].avatar]);
        setBlogData({
          ...blogData,
          images_list: [...blogData.images_list, imagesData[index].avatar],
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
        setBlogData({ ...blogData, thumbnail: "" });
      } else if (!isSingle && isBanner) {
        setBlogData({ ...blogData, banner_img: "" });
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
      API.get(`/blogs/${id}`)
        .then((response) => {
          // debugger;
          if (response.status === 200 || response.status === 201) {
            // debugger;
            if (!response.data.meta_details) {
              response.data.meta_details = initialObj.meta_details;
            }
            if (!response.data.arabic) {
              response.data.arabic = initialObj.arabic;
            }
            if (!response.data.arabic.route) {
              response.data.arabic.route = initialObj.arabic.route;
            }
            setBlogData(response.data);
            // console.log("response :: ",response);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  //!-----------Handle Input Fields---------

  const handleFieldChange = (e) => {
    let updatedBlogData = { ...blogData };
    updatedBlogData[e.target.name] = e.target.value;
    setBlogData(updatedBlogData);
  };

  const handleArabicFieldChange = (e) => {
    // debugger;
    let updatedBlogData = { ...blogData };
    updatedBlogData.arabic[e.target.name] = e.target.value;
    setBlogData(updatedBlogData);
  };

  //!------------Handle Ck Editor---------
  const handleEditor = (value) => {
    // debugger;
    let updatedValue = { ...blogData };
    updatedValue.description = value;
    setBlogData(updatedValue);
  };
  //!------Handle Exert CkEditor-----
  const handleExertEditor = (value) => {
    let updatedValue = { ...blogData };
    updatedValue.exert = value;
    setBlogData(updatedValue);
  };

  //!------------ARABIC Handle Ck Editor---------
  const handleArabicEditor = (value) => {
    // debugger;
    let updatedValue = { ...blogData };
    updatedValue.arabic.description = value;
    setBlogData(updatedValue);
  };
  // //--------Handle Arabic Category Select--------

  //! ________ Meta Detail Fields_________
  const handleMetaOnChange = (e) => {
    // debugger;
    let updatedData = { ...blogData };
    updatedData[e.target.name] = e.target.value;
    setBlogData(updatedData);
  };

  //! *******Arabic Meta Detail Fields********
  const handleArabicMetaOnChange = (e) => {
    // debugger;
    let updatedData = { ...blogData };
    updatedData.arabic[e.target.name] = e.target.value;
    setBlogData(updatedData);
  };
  //!------Handle Exert CkEditor-----
  const handleExertArabicEditor = (value) => {
    let updatedValue = { ...blogData };
    updatedValue.arabic.exert = value;
    setBlogData(updatedValue);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    let updatedData = { ...blogData };
    updatedData.arabic.banner_img = updatedData.banner_img;
    updatedData.arabic.featured_img = updatedData.featured_img;
    // debugger;
    if (isEdit) {
      let updateId = updatedData.route;
      delete updatedData["_id"];
      API.put(`/blogs/${updateId}`, updatedData)
        .then((res) => {
          alert("Blog updated successfully");
          history.push("/blog");
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post(`/blogs`, blogData)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            alert("Blog added successfully");
            history.push("/blog");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Card className="feeding-advisor-form">
        <CardHeader>
          <CardTitle>Blog Form</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              required: "",
            }}
            validationSchema={formSchema}
          >
            <Form>
              <FormGroup className="mb-1">
                <Label for="title">Title</Label>
                <Field
                  name="title"
                  id="title"
                  onChange={handleFieldChange}
                  value={blogData.title}
                  className={`form-control`}
                />
              </FormGroup>
              <FormGroup className="mb-1">
                <Label for="route">Route</Label>
                <Field
                  name="route"
                  id="route"
                  onChange={handleFieldChange}
                  value={blogData.route}
                  className={`form-control`}
                />
              </FormGroup>
              <div>
                <Label for="exert">Exert</Label>
                <CKEditor
                  onBeforeLoad={(CKEDITOR) =>
                    (CKEDITOR.disableAutoInline = true)
                  }
                  data={blogData?.exert}
                  onChange={(e) => {
                    handleExertEditor(e.editor.getData());
                  }}
                />
              </div>
              <Row>
                <Col sm={6}>
                  <FormGroup className="">
                    <Label for="featured_img">Banner Images</Label>
                    <div className="clearfix" />
                    <div className="img-preview-wrapper">
                      {blogData.banner_img !== "" && (
                        <img
                          src={
                            process.env.REACT_APP_IMAGE_BASE_URL +
                            blogData.banner_img
                          }
                          alt=""
                        />
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
                      {blogData.featured_img !== "" && (
                        <img
                          src={
                            process.env.REACT_APP_IMAGE_BASE_URL +
                            blogData.featured_img
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
              </Row>
              <Row>
                <Col sm={12}>
                  <div>
                    <Label for="Description">Description</Label>
                    <CKEditor
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={blogData.description}
                      onChange={(e) => {
                        handleEditor(e.editor.getData());
                      }}
                    />
                  </div>
                </Col>
              </Row>

              <Card className="mt-3">
                <CardHeader>
                  <CardTitle>Meta Tag Details</CardTitle>
                </CardHeader>
                <CardBody>
                  <FormGroup className="">
                    <Label for="title">Meta Title</Label>
                    <Field
                      name="meta_title"
                      id="meta_title"
                      onChange={handleMetaOnChange}
                      value={blogData?.meta_title}
                      className={`form-control`}
                    />
                  </FormGroup>
                  <div>
                    <Label for="meta_details" className="mb-1">
                      Description
                    </Label>
                    <Input
                      type="textarea"
                      name="meta_details"
                      id="meta_details"
                      rows="3"
                      onChange={handleMetaOnChange}
                      value={blogData?.meta_details}
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
                      value={blogData?.schema_markup}
                    />
                  </div>
                </CardBody>
              </Card>
            </Form>
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
                  <FormGroup className="mb-1">
                    <Label for="title">Title</Label>
                    <Field
                      name="title"
                      id="title"
                      onChange={handleArabicFieldChange}
                      value={blogData?.arabic?.title}
                      className={`form-control`}
                    />
                  </FormGroup>
                  <div>
                    <Label for="exert">Exert</Label>
                    <CKEditor
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={blogData?.arabic?.exert}
                      onChange={(e) => {
                        handleExertArabicEditor(e.editor.getData());
                      }}
                    />
                  </div>
                  <CardBody>
                    <Row>
                      <Col sm={12}>
                        <div>
                          <Label for="Description">Description</Label>
                          <CKEditor
                            onBeforeLoad={(CKEDITOR) =>
                              (CKEDITOR.disableAutoInline = true)
                            }
                            data={blogData.arabic.description}
                            onChange={(e) => {
                              handleArabicEditor(e.editor.getData());
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>

                  <Card className="mt-3">
                    <CardHeader>
                      <CardTitle>Arabic Meta Tag Details</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormGroup className="">
                        <Label for="title">Meta Title</Label>
                        <Field
                          name="meta_title"
                          id="meta_title"
                          onChange={handleArabicMetaOnChange}
                          value={blogData?.arabic?.meta_title}
                          className={`form-control`}
                        />
                      </FormGroup>
                      <div>
                        <Label for="meta_details" className="mb-1">
                          Description
                        </Label>
                        <Input
                          type="textarea"
                          name="meta_details"
                          id="meta_details"
                          rows="3"
                          onChange={handleArabicMetaOnChange}
                          value={blogData?.arabic?.meta_details}
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
                          value={blogData?.arabic?.schema_markup}
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
export default connect(mapStateToProps)(BlogGridForm);

// let arabicContents = [];
// res.data.content.forEach(x=>{
// arabicContents.push({
// description: "",
// image: x.image
// })
// })

// res.data.arabic.content = arabicContents;
