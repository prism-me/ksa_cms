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
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./PagesForm.scss";
import CKEditor from "ckeditor4-react";
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
  meta_details: {
    title: "",
    description: "",
    schema_markup: "",
  },
  arabic: {
    title: "",
    description: "",
    route: "",
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

const PagesForm = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const [pagesData, setPagesData] = useState({ ...initialObj });
  const [isEdit, setIsEdit] = useState(false);

  console.log("props ::",props)

  //!-------call pages api for Edit------
  useEffect(() => {
    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/pages/${id}`)
        .then((response) => {
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
            setPagesData(response.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  //!-----------Handle Input Fields---------

  const handleFields = (e) => {
    let updateValues = { ...pagesData };
    updateValues[e.target.name] = e.target.value;
    setPagesData(updateValues);
  };
  //!______Handle Meta OnChange______
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...pagesData };
    updatedValue.meta_details[e.target.name] = e.target.value;
    setPagesData(updatedValue);
  };

  //!-----------Handle Arabic Input Fields---------

  const handleArabicFields = (e) => {
    let updateValues = { ...pagesData };
    updateValues.arabic[e.target.name] = e.target.value;
    setPagesData(updateValues);
  };

  //______Handle Arabic OnChange_______
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...pagesData };
    updatedValue.arabic.meta_details[e.target.name] = e.target.value;
    setPagesData(updatedValue);
  };

  //!------------------Submit and Edit---------------
  const handleSubmit = () => {
    const updateValue = { ...pagesData };
    // debugger;
    if (isEdit) {
      let updateId = updateValue.route;
      delete updateValue[`_id`];
      API.put(`/pages/${updateId}`, updateValue)
        .then((response) => {
          alert("Page updated successfully");
          history.push("/pages");
        })
        .catch((err) => alert("Something went wrong"));
    } else {
      API.post("/pages", updateValue)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setPagesData(initialObj);
            alert("Page Add Successfully");
            history.push("/pages");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Card className="good-add-form">
        <CardHeader>
          <CardTitle>Page {isEdit ? "Edit" : "Add"} Form</CardTitle>
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
                  <FormGroup className="mb-1">
                    <Label for="title">Title</Label>
                    <Field
                      name="title"
                      id="title"
                      onChange={handleFields}
                      value={pagesData.title}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="mb-1">
                    <Label for="slug">Slug</Label>
                    <Field
                      name="slug"
                      id="slug"
                      onChange={handleFields}
                      value={pagesData.slug}
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
                      onChange={handleFields}
                      value={pagesData.route}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="mb-1">
                    <Label for="cms_route">CMS Route</Label>
                    <Field
                      name="cms_route"
                      id="cms_route"
                      onChange={handleFields}
                      value={pagesData.cms_route}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div>
                    <Label for="description">Description</Label>
                    <CKEditor
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={pagesData.description || ""}
                      onChange={(e) => {
                        setPagesData({
                          ...pagesData,
                          description: e.editor.getData(),
                        });
                      }}
                    />
                  </div>
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
                        value={pagesData?.meta_details?.title}
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
                        value={pagesData?.meta_details?.description}
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
                        value={pagesData?.meta_details?.schema_markup}
                      />
                    </div>
                  </CardBody>
                </Card>

                {/* //! **********Arabic Meta Details********* */}
                <Card className="mt-3 arabic-page-form">
                  {props.dataLog.login.loggedInUser.role !== 'seo' &&
                    <CardHeader>
                      <CardTitle>Arabic Fields</CardTitle>
                    </CardHeader>
                  }

                  <CardBody>
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <FormGroup className="mb-1">
                        <Label for="title">Title</Label>
                        <Field
                          name="title"
                          id="title"
                          onChange={handleArabicFields}
                          value={pagesData.arabic.title}
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
                          onChange={handleArabicFields}
                          value={pagesData.arabic.route}
                          className={`form-control`}
                        />
                      </FormGroup>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <div className="mb-1">
                        <Label for="description">Description</Label>
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          data={pagesData.arabic.description || ""}
                          onChange={(e) => {
                            setPagesData({
                              ...pagesData,
                              arabic: {
                                ...pagesData.arabic,
                                description: e.editor.getData(),
                              },
                            });
                          }}
                        />
                      </div>
                    }
                    <FormGroup className="">
                      <Label for="title">Arabic Meta Title</Label>
                      <Field
                        name="title"
                        id="title"
                        onChange={handleArabicMetaOnChange}
                        value={pagesData?.arabic?.meta_details?.title}
                        className={`form-control`}
                      />
                    </FormGroup>
                    <div>
                      <Label for="description" className="mb-1">
                        Meta Description
                      </Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        rows="3"
                        onChange={handleArabicMetaOnChange}
                        value={pagesData?.arabic?.meta_details?.description}
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
                        value={pagesData?.arabic?.meta_details?.schema_markup}
                      />
                    </div>
                  </CardBody>
                </Card>

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

// export default PagesForm;
export default connect(mapStateToProps)(PagesForm);

