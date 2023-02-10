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
  Input,
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./GoodToKnow.scss";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../../gallery-modal/GalleryModal";
import { API } from "../../../../http/API";
import { useParams, useHistory } from "react-router-dom";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  title: "",
  content: "",
  featured_img: "",

  arabic: {
    title: "",
    content: "",
    featured_img: "",
  },
};

const GoodToKnow = () => {
  const { id } = useParams();
  const history = useHistory();
  const [goodToKnow, setGoodToKnow] = useState({ ...initialObj });
  const [isEdit, setIsEdit] = useState(false);
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
    getGalleryImages();
  }, []);

  //!------------Call Good_to_know Api---------
  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`good_to_know/${id}`)
        .then((response) => {
          if (!response.data.arabic) {
            response.data.arabic = initialObj.arabic;
          }

          setGoodToKnow(response.data);
        })
        .catch((err) => alert("Something went wrong"));
    }
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

  const handleImageSelect = (e, index) => {
    if (e.target.checked) {
      if (isSingle && !isBanner) {
        setGoodToKnow({
          ...goodToKnow,
          featured_img: imagesData[index].avatar,
          arabic: {
            ...goodToKnow.arabic,
            featured_img: imagesData[index].avatar,
          },
        });
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

  //!-----------Handle Input Fields---------
  const handleFieldChange = (e) => {
    let updatedData = { ...goodToKnow };
    updatedData[e.target.name] = e.target.value;
    setGoodToKnow(updatedData);
  };

  const handleArabicFieldChange = (e) => {
    let updatedData = { ...goodToKnow };
    updatedData.arabic[e.target.name] = e.target.value;
    setGoodToKnow(updatedData);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    if (goodToKnow.title === "") {
      alert("Please add the title");
      return;
    }
    if (goodToKnow.content === "") {
      alert("Please add the content");
      return;
    }
    if (goodToKnow.featured_img === "") {
      alert("Please add the image");
      return;
    }
    let updatedData = { ...goodToKnow };

    updatedData.arabic.featured_img = updatedData.featured_img;
    if (isEdit) {
      let updateId = updatedData._id;
      delete updatedData["_id"];
      API.put(`/good_to_know/${updateId}`, updatedData)
        .then((response) => {
          alert("Item updated successfully");
          history.push("/good-to-know/list");
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post("/good_to_know", goodToKnow)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            alert("Item added successfully");
            history.push("/good-to-know/list");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Card className="good-add-form">
        <CardHeader>
          <CardTitle>Good To Know Form</CardTitle>
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
                <FormGroup className="">
                  <Label for="title">Title</Label>
                  <Field
                    name="title"
                    id="title"
                    onChange={handleFieldChange}
                    value={goodToKnow.title}
                    className={`form-control`}
                  />
                </FormGroup>

                <Row>
                  <Col sm={9}>
                    <div>
                      <Label for="infoText">Content</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={goodToKnow.content}
                        onChange={(e) =>
                          setGoodToKnow({
                            ...goodToKnow,
                            content: e.editor.getData(),
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
                        {goodToKnow.featured_img !== "" && (
                          <img
                            src={
                              process.env.REACT_APP_IMAGE_BASE_URL +
                              goodToKnow.featured_img
                            }
                            alt=""
                          />
                        )}
                      </div>
                      <Button.Ripple
                        color="primary"
                        className="p-1 btn-block"
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
                    <FormGroup className="">
                      <Label for="title">Title</Label>
                      <Field
                        name="title"
                        id="title"
                        onChange={handleArabicFieldChange}
                        value={goodToKnow.arabic?.title}
                        className={`form-control`}
                      />
                    </FormGroup>

                    <Row>
                      <Col sm={12}>
                        <div>
                          <Label for="infoText">Content</Label>
                          <CKEditor
                            onBeforeLoad={(CKEDITOR) =>
                              (CKEDITOR.disableAutoInline = true)
                            }
                            data={goodToKnow?.arabic?.content}
                            onChange={(e) =>
                              setGoodToKnow({
                                ...goodToKnow,
                                arabic: {
                                  ...goodToKnow.arabic,
                                  content: e.editor.getData(),
                                },
                              })
                            }
                          />
                        </div>
                      </Col>
                    </Row>
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

export default GoodToKnow;
