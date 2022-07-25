import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Button,
  Label,
  CustomInput,
  Row,
  Col,
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { API } from "../../../../http/API";
import GalleryModal from "../../gallery-modal/GalleryModal";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import "./SubCategoryForm.scss";
const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialCategory = {
  name: "",
  parent_id: "",
  short_description: "",
  long_description: "",
  featured_img: "",
  images_list: [],
  banner_images_list: [],
  type: "",
  status: "",
  video_link: "",
  video_description: "",
  route: "",
  arabic: {
    name: "",
    short_description: "",
    long_description: "",
    video_description: "",
  },
};

const SubCategoryForm = () => {
  const history = useHistory();
  //Sub Category
  const { id } = useParams();

  const [category, setCategory] = useState(initialCategory);
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [modalShow, setModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [isSingle, setIsSingle] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  //!--------------------
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
        setCategory({
          ...category,
          featured_img: imagesData[index].avatar,
        });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else if (!isSingle && isBanner) {
        setCategory({
          ...category,
          banner_images_list: [imagesData[index].avatar],
        });
        setBannerThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else {
        setSelectedImages([...selectedImages, imagesData[index].avatar]);
        setCategory({
          ...category,
          images_list: [...category.images_list, imagesData[index].avatar],
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
      // }
    } else {
      if (isSingle && !isBanner) {
        setCategory({ ...category, thumbnail: "" });
        setThumbnailPreview("");
      } else if (!isSingle && isBanner) {
        setCategory({ ...category, banner_img: "" });
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

  //!-------------Handle Input Fields-------------

  const handleFields = (e) => {
    let updateValues = { ...category };
    updateValues[e.target.name] = e.target.value;
    setCategory(updateValues);
  };

  const handleArabicFields = (e) => {
    let updateValues = { ...category };
    updateValues.arabic[e.target.name] = e.target.value;
    setCategory(updateValues);
  };

  //Select category field
  const handleSelect = (e) => {
    let updateValues = { ...category };
    updateValues[e.target.name] = e.target.value;
    setCategory(updateValues);
  };

  // Get Category for Parent_Id
  useEffect(() => {
    API.get("/categories")
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setData(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //!--------------------Edit Categiry----------------------
  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/categories/${id}`)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setCategory(response.data[0]);
            setThumbnailPreview(response.data[0]?.featured_img);
            setBannerThumbnailPreview(response.data[0]?.banner_images_list);
            if (!response.data[0].arabic) {
              response.data[0].arabic = initialCategory.arabic;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  //!-------------------Submit and Edit category-----------------

  //Submit subcaterory Category
  const submitCategory = () => {
    if (category.name === "") {
      alert("Please Enter Category Name");
      return;
    }
    if (category.parent_id === "" || category.parent_id === "all") {
      alert("Please Select Category");
      return;
    }
    let updateCategory = { ...category };
    if (isEdit) {
      let updateId = updateCategory.route;
      delete updateCategory["_id"];
      API.put(`/categories/${updateId}`, updateCategory)
        .then((response) => {
          alert("Sub category updated successfully");
          setCategory({ ...initialCategory });
          history.push("/sub-category/list");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      API.post("/categories", updateCategory)
        .then((response) => {
          setCategory({ ...initialCategory });
          alert("Sub category add successfully");
          history.push("/sub-category/list");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Card className="subcategory-add-form">
        <CardHeader>
          <CardTitle>Sub Category {isEdit ? "Edit" : "Add"} Form</CardTitle>
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
                <FormGroup>
                  <Label for="parent_id">Select Category</Label>
                  <CustomInput
                    type="select"
                    name="parent_id"
                    id="parent_id"
                    value={category.parent_id}
                    onChange={handleSelect}
                  >
                    <option value="all">Select Category</option>

                    {data?.map((x) => (
                      <React.Fragment key={x._id}>
                        {x.parent_id === null && (
                          <option value={x._id}>{x.name}</option>
                        )}
                      </React.Fragment>
                    ))}
                  </CustomInput>
                </FormGroup>
                <FormGroup className="">
                  <Label for="name">Name</Label>
                  <Field
                    name="name"
                    id="name"
                    onChange={handleFields}
                    value={category.name}
                    className={`form-control`}
                  />
                </FormGroup>
                <FormGroup className="">
                  <Label for="route">Route</Label>
                  <Field
                    name="route"
                    id="route"
                    onChange={handleFields}
                    value={category.route}
                    className={`form-control`}
                  />
                </FormGroup>
                <Card className="inner-card-wrap">
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm={6}>
                        <FormGroup className="my-2">
                          <Label for="featured_img">Featured Image</Label>
                          <div className="clearfix" />
                          <div className="img-preview-wrapper">
                            {thumbnailPreview !== "" && (
                              <img src={thumbnailPreview} alt="" />
                            )}
                          </div>
                          <Button.Ripple
                            color="primary"
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
                      <Col sm={6}>
                        <FormGroup className="my-2">
                          <Label for="banner_images_list">Banner Images</Label>
                          <div className="clearfix" />
                          <div className="img-preview-wrapper">
                            {bannerThumbnailPreview !== "" && (
                              <img src={bannerThumbnailPreview} alt="" />
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
                <div>
                  <Label for="short_description">Short Description</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={category.short_description}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        short_description: e.editor.getData(),
                      })
                    }
                  />
                </div>
                <div>
                  <Label for="long_description">Long Description</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={category.long_description}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        long_description: e.editor.getData(),
                      })
                    }
                  />
                </div>
                <FormGroup className="mb-2">
                  <Label for="type">Video Link (Youtube, Vimeo etc.)</Label>
                  <Field
                    name="video_link"
                    id="video_link"
                    onChange={handleFields}
                    value={category.video_link}
                    className={`form-control`}
                  />
                </FormGroup>
                <div>
                  <Label for="video_description">Video Description</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={category.video_description}
                    onChange={(e) =>
                      setCategory({
                        ...category,
                        video_description: e.editor.getData(),
                      })
                    }
                  />
                </div>

                {/* <Button.Ripple
                  onClick={submitCategory}
                  color="primary"
                  type="submit"
                  className="mt-2"
                >
                  {isEdit ? "Edit" : "Add"}
                </Button.Ripple> */}
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
      ARABIC VERSION FIELDS
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
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Field
                        name="name"
                        id="name"
                        onChange={handleArabicFields}
                        value={category.arabic?.name}
                        className={`form-control`}
                      />
                    </FormGroup>

                    <div>
                      <Label for="short_description">Short Description</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={category.arabic?.short_description}
                        onChange={(e) =>
                          setCategory({
                            ...category,
                            arabic: {
                              ...category.arabic,
                              short_description: e.editor.getData(),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label for="long_description">Long Description</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={category.arabic?.long_description}
                        onChange={(e) =>
                          setCategory({
                            ...category,
                            arabic: {
                              ...category.arabic,
                              long_description: e.editor.getData(),
                            },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label for="video_description">Video Description</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={category.arabic?.video_description}
                        onChange={(e) =>
                          setCategory({
                            ...category,
                            arabic: {
                              ...category.arabic,
                              video_description: e.editor.getData(),
                            },
                          })
                        }
                      />
                    </div>
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
            onClick={submitCategory}
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

export default SubCategoryForm;
