import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  CustomInput
} from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./VideosForm.scss";
import { API } from "../../../../http/API";
import { withRouter } from "react-router-dom";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  title: "",
  url: "",
  category: "",
  category_slug: "",
  arabic: {
    title: "",
    category:"",
  },
};

const VideoForm = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [videoData, setVideoData] = useState({ ...initialObj });
  const [categories, setCategories] = useState([]);

  //!-----------Call Api for Edit--------------
  useEffect(() => {

    API.get("/categories")
    .then((response) => {
      if (response.status === 200 || response.status === 201) {
        // setData(response.data);
        console.log("=== cats response.data===");
        setCategories(response.data)
        console.log(response.data);
      }
    })
    .catch((err) => {
      console.log(err);
    });

    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/video/${id}`)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setVideoData(response.data);
          }
        })
        .catch((err) => console.log(err));
    }

  }, [id]);

  //!------------Handle select Fields-------

  const handleCategorySelect = (e) => {

    let updatedVideo = { ...videoData };
    updatedVideo.category_slug = e.target.value
    updatedVideo.arabic.category = e.target[e.target.selectedIndex].getAttribute('data-arabic')
    updatedVideo.category = e.target[e.target.selectedIndex].getAttribute('data-name')
    // console.log("====category");
    // console.log(category);
    // return false;

    // updatedVideo.category = category.name;
    // updatedVideo.category_slug = category.route;
    // updatedVideo.arabic.category = category.arabic.name;
    setVideoData(updatedVideo);
    // console.log("===updatedVideo===")
    // console.log(updatedVideo)
  };


  //!------------Handle Input Fields-------
  const handleFieldChange = (e) => {
    let updatedVideo = { ...videoData };
    updatedVideo[e.target.name] = e.target.value;
    setVideoData(updatedVideo);
  };

  //!------------Handle Arabic Fields-------
  const handleArabicFieldChange = (e) => {
    let updatedVideo = { ...videoData };
    updatedVideo.arabic[e.target.name] = e.target.value;
    setVideoData(updatedVideo);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    if (isEdit) {
      let updateId = videoData._id;
      delete videoData["_id"];
      API.put(`/video/${updateId}`, videoData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            alert("Item updated successfully");
            history.push("/videos/list");
          }
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post(`/video`, videoData)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            alert("Video added successfully");
            // console.log(response.data);
            history.push("/videos/list");
          }
        })
        .catch((err) => alert("Something went wrong"));
    }
  };

  return (
    <>
      <Card className="category-add-form">
        <CardHeader>
          <CardTitle>Video {isEdit ? "Edit" : "Add"} Form</CardTitle>
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
                    value={videoData.title}
                    className={`form-control`}
                  />
                </FormGroup>
                <FormGroup className="mb-1">
                  <Label for="url">Video Link</Label>
                  <Field
                    name="url"
                    id="url"
                    onChange={handleFieldChange}
                    value={videoData.url}
                    className={`form-control`}
                  />
                </FormGroup>
                {console.log(videoData,"videoDatavideoData")}
                <FormGroup className="mb-1">
                  <Label for="category">Select Category</Label>
                    <CustomInput
                      type="select"
                      name="category"
                      id="category"
                      value={ videoData.category_slug}
                      onChange={handleCategorySelect}
                    >
                      <option value="">Select Category</option>
                      {categories?.map((x) => (
                        // <React.Fragment key={}>
                          <>
                          {x.parent_id === null && (
                            <option value={x.route} data-name={x.name} data-arabic={x.arabic.name}>{x.name}</option>
                          )}
                          </>
                        // </React.Fragment>
                      ))}
                    </CustomInput>
                </FormGroup>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>

      {/* *********************
      ARABIC VERSION FIELDS
      ********************* */}
      {/* {isEdit && ( */}
        {/* // <Card style={{ background: '#f0f0f0', boxShadow: `0px 4px 25px 0px rgba(230, 85, 80, 0.4)` }}> */}
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
                        value={videoData.arabic?.title}
                        className={`form-control`}
                      />
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </div>
          </CardBody>
        </Card>
      {/* )} */}

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

export default withRouter(VideoForm);
