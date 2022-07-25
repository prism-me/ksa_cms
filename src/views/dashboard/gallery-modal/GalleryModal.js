import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { CloudUploadOutlined, DeleteOutlined } from "@material-ui/icons";
import S3 from "react-aws-s3";
import AWS from "aws-sdk";
import "./GalleryModal.scss";
import { FormGroup, Input, Label } from "reactstrap";
import { API } from "../../../http/API";

export default function GalleryDialog(props) {
  const [currentFiles, setCurrentFiles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allImages, setAllImages] = useState([]);

  useEffect(() => {
    if (props.data?.length > 0) {
      setAllImages(props.data);
    }
  }, [props.data]);

  //cognito credentials
  AWS.config.region = "eu-central-1"; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-central-1:8db4219e-3012-4027-ac2e-60ec65e9ca84",
  });

  //!-------------------------------Upload Image-----------------------------//
  const handleFileDrop = (files) => {
    let updatedFiles = files.map((x) => ({
      image: x,
      is360: false,
      // alt_text: "",
    }));
    setCurrentFiles(updatedFiles);
    if (currentFiles.length > 0) {
      setCurrentFiles([...currentFiles, ...updatedFiles]);
    } else {
      setCurrentFiles(updatedFiles);
    }
  };
  //Handle Submit
  const handleClick = (event) => {
    event.preventDefault();

    console.log(currentFiles,"currentFiles");

    // const config = {
    //   bucketName: "pigeon-gallery",
    //   dirName: "album3",
    //   region: "eu-central-1",
    //   accessKeyId: "AKIA3NKPVIWSTWXS7QGQ",
    //   secretAccessKey: "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",
    // };
    // const ReactS3Client = new S3(config);

    // currentFiles?.map((x, index) => {
    //   ReactS3Client.uploadFile(
    //     x.image,
    //     x.alt_text || new Date().toTimeString()
    //   ).then((data) => {
    //     console.log(data);
    //     if (data.status === 204) {
    //       console.log("success");
    //       setCurrentFiles([]);
    //       props.refreshData();
    //     } else {
    //       console.log("fail");
    //     }
    //   });
    // });

    let imagesFormData = new FormData();
    currentFiles.forEach(x => {
        imagesFormData.append("images[]", x.image);
        imagesFormData.append("data[]", JSON.stringify(x))
    })
    API.post(`/uploads`, imagesFormData, {
    // axios.post(`https://pigeonarabia.com/E_Commerce_APis_v2/public/api/uploads`, imagesFormData, {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
        }
    }).then(response => {
        if (response.status === 200) {
            alert("Files Uploaded");
            setCurrentFiles([]);
            props.refreshData();
        }
    }).catch(err => alert("Something went wrong"));
    
  };

  //!-------------------------------------------------------------------
  const handleImageAltChange = (e, index) => {
    let updatedFiles = [...currentFiles];
    updatedFiles[index].alt_tag = e.target.value;
    setCurrentFiles(updatedFiles);
  };

  const handleSearch = ({ currentTarget: input }) => {
    if (input.value.length < 2) {
      return;
    }
    if (input.value === "") {
      setAllImages(props.data);
      return;
    }
    let filteredImages = props.data?.filter((x) =>
      x.imageKey.includes(input.value)
    );
    setAllImages(filteredImages);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Select Images</DialogTitle>
        <DialogContent>
          {/* <Grid container spacing={2}> */}
          <div className="add-fallery-wrapper">
            <Box marginBottom={4}>
              <h6>
                If the image you are looking for is not in gallery, then add it
                here first.
              </h6>
              <DropzoneArea
                // showPreviews={true}
                dropzoneClass="dropzone-wrapper-small"
                Icon={CloudUploadOutlined}
                showAlerts={false}
                acceptedFiles={["image/*"]}
                filesLimit={15}
                showPreviewsInDropzone={false}
                showFileNamesInPreview={false}
                onDrop={handleFileDrop}
                // useChipsForPreview
                dropzoneText="Drag and Drop Images here or simply click here"
                previewGridProps={{
                  container: {
                    spacing: 1,
                    direction: "row",
                    wrap: "nowrap",
                    style: {
                      overflowX: "auto",
                      padding: "1rem",
                    },
                  },
                  item: { xs: 3 },
                }}
                // previewChipProps={}
                previewText="Selected files"
              />
            </Box>
            {currentFiles.length > 0 && (
              <Box marginBottom={4}>
                <Card>
                  <div>
                    <form type="post" encType="multipart/form-data">
                      <Grid container spacing={1} style={{ padding: "10px" }}>
                        {currentFiles?.map((x, i) => (
                          <>
                            <Grid item xs={12} sm={1}>
                              <Avatar
                                src={URL.createObjectURL(x.image)}
                                alt={x.alt_tag || ""}
                                style={{ border: "1px solid #ddd" }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <TextField
                                required
                                id={`alt_tag${i}`}
                                name="alt_tag"
                                label="Image Alt Text"
                                value={x.alt_tag}
                                variant="outlined"
                                fullWidth
                                onChange={(e) => handleImageAltChange(e, i)}
                                size="small"
                                style={{ border: "1px solid #eee" }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <FormControl component="fieldset">
                                <RadioGroup
                                  aria-label="is360"
                                  row
                                  defaultChecked
                                  name="is360"
                                  value={x.is360}
                                  onChange={(e) => {
                                    setCurrentFiles(
                                      currentFiles.map((y, ind) => {
                                        if (ind === i) {
                                          return {
                                            ...y,
                                            is360: !y.is360,
                                          };
                                        } else {
                                          return y;
                                        }
                                      })
                                    );
                                  }}
                                >
                                  <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label="Regular/Slider"
                                  />
                                  <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label={
                                      <span>
                                        360<sup>o</sup> View
                                      </span>
                                    }
                                  />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={1}>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() =>
                                  setCurrentFiles([
                                    ...currentFiles.filter(
                                      (z, index) => index !== i
                                    ),
                                  ])
                                }
                              >
                                <DeleteOutlined />
                              </Button>
                            </Grid>
                          </>
                        ))}

                        {currentFiles.length > 0 && (
                          <Grid item xs={12} sm={12}>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={handleClick}
                              style={{
                                float: "right",
                                marginTop: "1rem",
                              }}
                            >
                              Upload New Images
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </form>
                  </div>
                </Card>
              </Box>
            )}
          </div>
          <div className="search-bucket">
            <Label>Search Images</Label>
            <FormGroup>
              <Input type="text" onChange={handleSearch} placeholder="Search images..." />
            </FormGroup>
          </div>
          <div className="d-flex flex-wrap gallery-grid">
            {allImages?.map((x, index) => (
              <FormControlLabel
                key={index}
                style={{ width: "25%", margin: 0 }}
                control={
                  <Checkbox
                    checked={x.checked}
                    style={{ width: "100%" }}
                    onChange={(e) =>
                      props.handleImageSelect(e, index, props.section)
                    }
                    color="primary"
                    icon={
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          position: "relative",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                        }}
                      >
                        <img
                          className="img-thumbnail"
                          width="100%"
                          style={{
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={x.avatar}
                          alt=""
                        />
                        <p
                          style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            fontSize: "12px",
                            textAlign: "center",
                            marginBottom: 0,
                            fontWeight: 500,
                            background: "rgba(0,0,0,0.4)",
                            color: "#fff",
                            padding: "0 .5rem",
                          }}
                        >
                          {x.imageKey}
                        </p>
                      </div>
                    }
                    checkedIcon={
                      <div
                        style={{
                          width: "100%",
                          height: "150px",
                          position: "relative",
                        }}
                      >
                        <img
                          className="img-thumbnail"
                          width="100%"
                          src={x.avatar}
                          alt=""
                          style={{
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <p
                          style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            fontSize: "12px",
                            textAlign: "center",
                            marginBottom: 0,
                            fontWeight: 500,
                            background: "rgba(0,0,0,0.4)",
                            color: "#fff",
                            padding: "0 .5rem",
                          }}
                        >
                          {x.imageKey}
                        </p>
                        <div className="img-checked"></div>
                      </div>
                    }
                    name="image"
                  />
                }
              />
            ))}
          </div>
          {/* </Grid> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            variant="contained"
            color="primary"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
