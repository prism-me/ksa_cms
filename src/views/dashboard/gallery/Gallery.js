import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import AWS from "aws-sdk";
import S3 from "react-aws-s3";
import {
  Avatar,
  Box,
  Card,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { DeleteRounded } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import "./Gallery.scss";
import UpdateGalleryDialog from "./UpdateGalleryDialog";
import { API } from "../../../http/API";

const Gallery = () => {
  const [showEditBox, setToggle] = useState(false);
  const [selectedImage, setSelectedImage] = useState();

  const [imagesData, setImagesData] = useState([]);
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

  const handelEditImage = (image) => {
    setToggle(true);
    setSelectedImage(image);
  };

  const handleImageDelete = (photoKey) => {
    // let fileName = photoKey.split("album3%2F")?.[1];
    // const config = {
    //   bucketName: "pigeon-gallery",
    //   dirName: "album3",
    //   region: "eu-central-1",
    //   accessKeyId: "AKIA3NKPVIWSTWXS7QGQ",
    //   secretAccessKey: "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",
    // };
    // const ReactS3Client = new S3(config);
    // ReactS3Client.deleteFile(fileName)
    //   .then((response) => {
    //     getGalleryImages();
    //     alert("Image Deleted");
    //   })
    //   .catch((err) => console.error(err));

    API.delete(`/uploads`)
      .then((response) => {
        // axios.delete(`https://pigeonarabia.com/E_Commerce_APis_v2/public/api/uploads`).then((response) => {
        getGalleryImages();
        alert("Image Deleted");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="gallery-images-wrap">
      <Box>
        <GridList cellHeight={150} className="" spacing={10}>
          {imagesData.map((tile, index) => (
            <GridListTile
              className="gallery-tile"
              cols={0.4}
              key={tile.imageKey + index}
            >
              <img
                src={process.env.REACT_APP_IMAGE_BASE_URL + tile.avatar}
                alt={""}
                onClick={() => handelEditImage(tile.avatar)}
              />
              <GridListTileBar
                title={<small>{tile.imageKey}</small>}
                // subtitle={<span>by: {tile.author}</span>}
                actionIcon={
                  <IconButton
                    aria-label={`info about`}
                    onClick={() => handleImageDelete(tile.avatar)}
                    className=""
                  >
                    <DeleteRounded
                      fontSize="small"
                      color="secondary"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </Box>
      <Box>
        <UpdateGalleryDialog
          open={showEditBox}
          onClose={() => setToggle(false)}
          image={selectedImage}
        />
      </Box>
    </div>
  );
};

export default Gallery;
