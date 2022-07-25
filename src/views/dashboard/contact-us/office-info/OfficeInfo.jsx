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

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./OfficeInfo.scss";
import CKEditor from "ckeditor4-react";
import { API } from "../../../../http/API";

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
});

const initialObj = {
  widget_name: "office-info",
  page_id: 0,
  widget_type: "office-info",
  widget_content: {
    title: "",
    address_details: "",
    map_link: "",
    map_title: "",
    map_description: "",
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    arabic: {
      title: "",
      address_details: "",
      map_title: "",
      map_description: "",
      meta_details: {
        title: "",
        description: "",
        schema_markup: "",
      },
    },
  },
};

const OfficeInfo = () => {
  const [isOfficeInfo, setIsOfficeInfo] = useState({ ...initialObj });
  const [pageData, setPageData] = useState();

  //!------------Pages Api Call------------
  useEffect(() => {
    API.get(`/pages`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          //   debugger;
          let currentPage = response.data.find((x) => x.slug === "office-info");
          setPageData(currentPage);

          API.get(`/all_widgets/${currentPage._id}`)
            .then((res) => {
              // debugger;
              if (
                !res.data[res.data.length - 1].widget_content.meta_details
                  .schema_markup
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.meta_details.schema_markup =
                  initialObj.widget_content.meta_details.schema_markup;
              }

              if (!res.data[res.data.length - 1].widget_content.map_title) {
                res.data[res.data.length - 1].widget_content.map_title =
                  initialObj.widget_content.map_title;
              }
              if (
                !res.data[res.data.length - 1].widget_content.map_description
              ) {
                res.data[res.data.length - 1].widget_content.map_description =
                  initialObj.widget_content.map_description;
              }
              //------Arabic------
              if (
                !res.data[res.data.length - 1].widget_content.arabic.map_title
              ) {
                res.data[res.data.length - 1].widget_content.arabic.map_title =
                  initialObj.widget_content.arabic.map_title;
              }
              if (
                !res.data[res.data.length - 1].widget_content.arabic
                  .map_description
              ) {
                res.data[
                  res.data.length - 1
                ].widget_content.arabic.map_description =
                  initialObj.widget_content.arabic.map_description;
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

              setIsOfficeInfo({ ...initialObj, widget_content });
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  //!--------Handle OnChange---------
  const handleOnChange = (e) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content[e.target.name] = e.target.value;
    setIsOfficeInfo(updatedValue);
  };

  //!--------Handle Editor---------
  const handleEditor = (value) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content.address_details = value;
    setIsOfficeInfo(updatedValue);
  };
  //!--------Handle Meta_Details OnChange---------
  const handleMetaOnChange = (e) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content.meta_details[e.target.name] = e.target.value;
    setIsOfficeInfo(updatedValue);
  };
  const handleMapEditor = (value) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content.map_description = value;
    setIsOfficeInfo(updatedValue);
  };

  //! **********Arabic Info***********

  //!--------Handle OnChange---------
  const handleArabicOnChange = (e) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content.arabic[e.target.name] = e.target.value;
    setIsOfficeInfo(updatedValue);
  };

  //!--------Handle Editor---------
  const handleArabicEditor = (value) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content.arabic.address_details = value;
    setIsOfficeInfo(updatedValue);
  };
  //!--------Handle Meta_Details OnChange---------
  const handleArabicMetaOnChange = (e) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content.arabic.meta_details[e.target.name] =
      e.target.value;
    setIsOfficeInfo(updatedValue);
  };
  const handleArabicMapEditor = (value) => {
    let updatedValue = { ...isOfficeInfo };
    updatedValue.widget_content.arabic.map_description = value;
    setIsOfficeInfo(updatedValue);
  };

  //!--------Handle Submit----------
  const handleSubmit = () => {
    let updatedData = { ...isOfficeInfo, page_id: pageData._id };
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
    <div>
      <Card className="office-info">
        <CardHeader>
          <CardTitle>Office Info</CardTitle>
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
                    value={isOfficeInfo.widget_content.title}
                    onChange={handleOnChange}
                    className={`form-control`}
                  />
                </FormGroup>

                <div>
                  <Label for="content">Office Info</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={isOfficeInfo.widget_content.address_details}
                    onChange={(e) => handleEditor(e.editor.getData())}
                  />
                </div>
                {/* //!-----Map Details------ */}
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle>Map Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className="mb-1">
                      <Label for="map_title">Map Title</Label>
                      <Field
                        name="map_title"
                        id="map_title"
                        value={isOfficeInfo.widget_content.map_title}
                        onChange={handleOnChange}
                        className={`form-control`}
                      />
                    </FormGroup>
                    <FormGroup className="mb-1">
                      <Label for="map_link">Map Link</Label>
                      <Field
                        name="map_link"
                        id="map_link"
                        value={isOfficeInfo.widget_content.map_link}
                        onChange={handleOnChange}
                        className={`form-control`}
                      />
                    </FormGroup>
                    <div>
                      <Label for="content">Map Details</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={isOfficeInfo.widget_content.map_description}
                        onChange={(e) => handleMapEditor(e.editor.getData())}
                      />
                    </div>
                  </CardBody>
                </Card>
                {/* //! **********Meta_ Details*********** */}
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
                          isOfficeInfo?.widget_content?.meta_details?.title
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
                          isOfficeInfo?.widget_content?.meta_details
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
                          isOfficeInfo?.widget_content?.meta_details
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

      {/* //! ******************************
      //? **********Arabic Version*********
      //! ****************************** */}
      <Card className="arabic-office-info">
        <CardHeader>
          <CardTitle>Arabic Office Info</CardTitle>
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
                    value={isOfficeInfo.widget_content.arabic.title}
                    onChange={handleArabicOnChange}
                    className={`form-control`}
                  />
                </FormGroup>

                <div>
                  <Label for="content">Office Info</Label>
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) =>
                      (CKEDITOR.disableAutoInline = true)
                    }
                    data={isOfficeInfo.widget_content?.arabic?.address_details}
                    onChange={(e) => handleArabicEditor(e.editor.getData())}
                  />
                </div>
                <Card className="mt-2">
                  <CardHeader>
                    <CardTitle>Map Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className="mb-1">
                      <Label for="map_title">Map Title</Label>
                      <Field
                        name="map_title"
                        id="map_title"
                        value={isOfficeInfo.widget_content.arabic.map_title}
                        onChange={handleArabicOnChange}
                        className={`form-control`}
                      />
                    </FormGroup>

                    <div>
                      <Label for="content">Map Details</Label>
                      <CKEditor
                        onBeforeLoad={(CKEDITOR) =>
                          (CKEDITOR.disableAutoInline = true)
                        }
                        data={
                          isOfficeInfo.widget_content.arabic.map_description
                        }
                        onChange={(e) =>
                          handleArabicMapEditor(e.editor.getData())
                        }
                      />
                    </div>
                  </CardBody>
                </Card>
                {/* //! **********Meta_ Details*********** */}
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
                          isOfficeInfo?.widget_content?.arabic?.meta_details
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
                          isOfficeInfo?.widget_content?.arabic?.meta_details
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
                          isOfficeInfo?.widget_content?.arabic?.meta_details
                            ?.schema_markup
                        }
                      />
                    </div>
                  </CardBody>
                </Card>
              </Form>
            )}
          </Formik>
          <div className="submit-btn-wrap">
            <Button.Ripple onClick={handleSubmit} color="primary" type="submit">
              Submit
            </Button.Ripple>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default OfficeInfo;
