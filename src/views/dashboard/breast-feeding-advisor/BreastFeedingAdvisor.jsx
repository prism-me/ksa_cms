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
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./BreastFeedingAdvisor.scss";
// import { API } from "../../../../http/API";
import AWS from "aws-sdk";
import CKEditor from "ckeditor4-react";
import GalleryModal from "../gallery-modal/GalleryModal";
import { API } from "../../../http/API";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  title: "",
  content: "",
  featured_img: "",
  route: "",
  arabic: {
    featured_img: "",
    title: "",
    content: "",
  },
};

const BreastFeedingAdvisor = () => {
  const history = useHistory();
  const { id } = useParams();

  const [feedingAdvisor, setFeedingAdvisor] = useState({ ...initialObj });
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

  //!--------Call Article_category Api for Edit----
  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/single_article_category/${id}`)
        .then((response) => {
          // debugger;
          if (!response.data.arabic) {
            response.data.arabic = initialObj.arabic;
          }
          if (response.status === 200 || response.status === 201) {
            setFeedingAdvisor(response.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);
  useEffect(
    () => {
      setFeedingAdvisor({
        ...feedingAdvisor,
        route: feedingAdvisor.title.replace(/\s+/g, "-").toLocaleLowerCase(),
      });
    },
    isEdit ? [] : [feedingAdvisor.title]
  );

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
        setFeedingAdvisor({
          ...feedingAdvisor,
          featured_img: imagesData[index].avatar,
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
    let updatedValues = { ...feedingAdvisor };
    updatedValues[e.target.name] = e.target.value;
    setFeedingAdvisor(updatedValues);
  };
  //! Handle Arbic OnChnage
  const handleArabicOnChange = (e) => {
    // debugger;
    let updatedValue = { ...feedingAdvisor };
    updatedValue.arabic[e.target.name] = e.target.value;
    setFeedingAdvisor(updatedValue);
  };
  //! ***Handle Arabic Editor***
  const handleArabicEditor = (value) => {
    // debugger;
    let updatedValue = { ...feedingAdvisor };
    updatedValue.arabic.content = value;
    setFeedingAdvisor(updatedValue);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    let updatedData = { ...feedingAdvisor };
    // updatedData.arabic.featured_img = updatedData.featured_img;
    if (isEdit) {
      let updateId = updatedData.route;
      delete updatedData["_id"];

      API.put(`/single_article_category_update/${updateId}`, updatedData)
        .then((res) => {
          alert("Item updated successfully");
          history.push("/breast-feeding-advisor/list");
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post(`/article_category`, feedingAdvisor)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            alert("Category added successfully");
            history.push("/breast-feeding-advisor/list");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Card className="feeding-advisor-form">
        <CardHeader>
          <CardTitle>
            Breast Feeding Advisor {isEdit ? "Edit" : ""} Form
          </CardTitle>
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
                <FormGroup className="mb-1">
                  <Label for="title">Title</Label>
                  <Field
                    name="title"
                    id="title"
                    onChange={handleFieldChange}
                    value={feedingAdvisor.title}
                    className={`form-control`}
                  />
                </FormGroup>

                <Row>
                  <Col sm={9}>
                    <div>
                      <Label for="infoText">Description</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={feedingAdvisor.content}
                        onChange={(e) =>
                          setFeedingAdvisor({
                            ...feedingAdvisor,
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
                        {feedingAdvisor.featured_img !== "" && (
                          <img src={feedingAdvisor.featured_img} alt="" />
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
                <FormGroup className="mb-1">
                  <Label for="route">Route</Label>
                  <Field
                    name="route"
                    id="route"
                    onChange={handleFieldChange}
                    value={feedingAdvisor.route}
                    className={`form-control`}
                  />
                </FormGroup>
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
      {/* //!--------Arabic Version---------- */}

      <Card className="feeding-advisor-arabic-form">
        <CardHeader>
          <CardTitle>Arabic Form</CardTitle>
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
                <FormGroup className="mb-1">
                  <Label for="title">Title</Label>
                  <Field
                    name="title"
                    id="title"
                    value={feedingAdvisor?.arabic?.title}
                    onChange={handleArabicOnChange}
                    className={`form-control`}
                  />
                </FormGroup>

                <Row>
                  <Col sm={12}>
                    <div>
                      <Label for="infoText">Description</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={feedingAdvisor?.arabic?.content}
                        onChange={(e) => handleArabicEditor(e.editor.getData())}
                      />
                    </div>
                  </Col>
                </Row>

                <Button.Ripple
                  onClick={handleSubmit}
                  color="primary"
                  type="submit"
                  className="mt-2"
                >
                  {isEdit ? "Edit" : "Add"}
                </Button.Ripple>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </>
  );
};

export default BreastFeedingAdvisor;
