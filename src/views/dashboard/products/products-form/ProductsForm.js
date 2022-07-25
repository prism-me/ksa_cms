import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody, FormGroup, Button, Label, CustomInput, Input, Col } from "reactstrap";

import Grid from "@material-ui/core/Grid";
import MaterialButton from "@material-ui/core/Button";
import { API } from "../../../../http/API";
// import { API } from "../../";
import { DragHandleOutlined } from "@material-ui/icons";
import { Paper } from "@material-ui/core";
import MultiSelect from "react-select/creatable";
// import CreatableSelect from 'react-select/creatable';

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import "./ProductsForm.scss";
import GalleryModal from "../../gallery-modal/GalleryModal";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../assets/scss/plugins/extensions/editor.scss";
import AWS from "aws-sdk";
import S3 from "react-aws-s3";
import CKEditor from "ckeditor4-react";
import { useHistory, useParams } from "react-router-dom";
import { Row } from "react-bootstrap";
import { DeleteOutlined, RemoveCircleOutline } from "@material-ui/icons";
import "./../../../../assets/scss/plugins/forms/react-select/_react-select.scss";
import { connect } from "react-redux";

const formSchema = Yup.object().shape({});

const tagsList = [
  {
    value: "3+ Months",
    label: "3+ Months",
  },
  {
    value: "BPA Free",
    label: "BPA Free",
  },
  {
    value: "Electric",
    label: "Electric",
  },
  {
    value: "Manual",
    label: "Manual",
  },
];

const arabicTagsList = [
  {
    value: "منتجاته",
    label: "منتجاته",
  },
  {
    value: "ذات صل",
    label: "ذات صل",
  },
  {
    value: "مجات ذات",
    label: "مجات ذات",
  },
  {
    value: "نتا صله",
    label: "نتا صله",
  },
];

const sortingList = [
  {
    value: "Popularity",
    label: "Popularity",
  },
  {
    value: "Recommended",
    label: "Recommended",
  },
  {
    value: "Best Seller",
    label: "Best Seller",
  },
];

const initialProducts = {
  name: "",
  arabic_name: "",
  rating: "",
  default_price: "",
  default_stock: "",
  short_description: "",
  long_description: "",
  category: "",
  sub_category: "",
  featured_img: "",
  images_list: [], // (array of strings)
  banner_images_list: [],
  downloads: "",
  product_code: "",
  variation_price: "",
  variation_stock: "",
  firstcry_link: "",
  tags: [],
  arabic_tags: [],
  sortings: [],
  features: "",
  meta_details: {
    title: "",
    description: "",
    schema_markup: "",
  },
  specifications: {
    description: "",
  },
  overview: "",
  type: "",
  status: "",
  variations: [],
  variation_images: [],
  route: "",
  single_default_images: [],
  arabic: {
    name: "",
    variations: [],
    arabic_name: "",
    short_description: "",
    long_description: "",
    features: "",
    tags: [],
    arabic_tags: [],
    meta_details: {
      title: "",
      description: "",
      schema_markup: "",
    },
    specifications: {
      description: "",
    },
  },
};

const mapStateToProps = (props) => {
  return {
    dataLog: props.auth,
  };
};

const ProductsForm = (props) => {
  const history = useHistory();

  const [products, setProducts] = useState({ ...initialProducts });
  const [modalShow, setModalShow] = React.useState(false);
  const [contentModalShow, setContentModalShow] = React.useState(false);
  const [imagesData, setImagesData] = useState([]);

  const [isSingle, setIsSingle] = useState(false);
  const [isArabicSingle, setIsArabicSingle] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isBanner, setIsBanner] = useState(false);
  const [bannerThumbnailPreview, setBannerThumbnailPreview] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isOverview, setIsOverview] = useState(false);
  const [isFeatures, setIsFeatures] = useState(false);
  const [overviewThumbnailPreview, setOverviewThumbnailPreview] = useState("");
  const [featuresThumbnailPreview, setFeaturesThumbnailPreview] = useState("");
  const [dragId, setDragId] = useState();
  const [arabicDragId, setArabicDragId] = useState();
  const [groupedProducts, setGroupedProducts] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [veriationIndex, setVeriationIndex] = useState(0);
  const [arabicVeriationIndex, setArabicVeriationIndex] = useState(0);


  //!----------------------------------Edit------------------------
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);

  // useEffect(() => {
  //   console.log("calling.....")
  //   if (products?.variations?.length < 1 && products?.images_list?.length > 0) {
  //     if (!isEdit) {
  //       let single_default_images = products?.images_list?.map((x) => {
  //         return {
  //           image: x,
  //           is_default: false,
  //         };
  //       });
  //       setProducts({ ...products, single_default_images });
  //     }
  //   }
  // }, [
  //   selectedImages,
  //   products?.variations,
  //   products?.images_list,
  //   isEdit,
  //   products
  // ]);

  useEffect(() => {

    if (id && id !== "") {
      setIsEdit(true);
      API.get(`/products/${id}`)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            let productData = response.data;
            setThumbnailPreview(productData?.featured_img);
            setSelectedImages(
              productData?.single_default_images?.map((x) => x) || []
            );
            setBannerThumbnailPreview(productData?.banner_images_list);
            setFeaturesThumbnailPreview(productData?.features);
            setOverviewThumbnailPreview(productData?.overview);
            if (!productData.arabic) {
              productData.arabic = initialProducts.arabic;
            }
            if (!productData.meta_details.schema_markup) {
              productData.meta_details.schema_markup =
                initialProducts.meta_details.schema_markup;
            }
            if (!productData.arabic.meta_details.schema_markup) {
              productData.arabic.meta_details.schema_markup =
                initialProducts.arabic.meta_details.schema_markup;
            }
            if (productData.single_default_images?.length > 0) {
              productData.images_list = productData.single_default_images?.map(
                (x) => x
              );
              if(productData.is_new != 1 && productData.arabic.images_list.length < 1){
                productData.arabic.images_list = JSON.parse(JSON.stringify(productData.single_default_images))
              }
            }
            if (
              productData?.variations?.length > 0 &&
              (productData?.variation_images?.length < 1 ||
                !productData?.variation_images)
            ) {
              productData.variation_images = productData?.images_list?.map(
                (x) => {
                  return {
                    image: x,
                    variation: "",
                    is_default: false,
                  };
                }
              );
            }
            if (
              productData?.variations?.length > 0 &&
              productData?.variation_images?.length > 0 &&
              !productData?.variation_images?.find(
                (x) => x.variation?.includes("")?.image
              )
            ) {
              productData.variation_images = productData?.variation_images?.map(
                (x, index) => {
                  return {
                    image: x.image,
                    is_default: x.is_default || false,
                    variation : x.variation
                  };
                }
              );
            }
            if (
              !productData?.variations?.length > 0 &&
              !productData?.single_default_images &&
              productData?.images_list?.length > 0
            ) {
              productData.single_default_images = productData?.images_list?.map(
                (x) => {
                  return {
                    image: x,
                    is_default: false,
                  };
                }
              );
              setSelectedImages(
                productData.single_default_images?.map((x) => x)
              );
            }
            if (
              !productData?.variations?.length > 0 &&
              productData.single_default_images?.length > 0
            ) {
              productData.single_default_images = productData?.images_list?.map(
                (x, ind) => {
                  return {
                    image: x,
                    is_default:
                      productData.single_default_images[ind]?.is_default,
                  };
                }
              );
            }

            if(!productData.is_new && productData.variations?.length > 0){
                if(!productData.arabic.variations){
                  let a = productData.arabic
                  a.variations = []
                  productData.arabic = a
                }

              productData.is_new = 1

              let oldProductVariation = productData.variations
              productData.variation_images.forEach((element) => {
                oldProductVariation.forEach((element2, index2, array) => {
                  if(element2.name == element.variation){
                        let obj = {
                          image : element.image,
                          is_default : element.is_default
                        }
                        if(array[index2].variation_images){
                          let imgs = array[index2].variation_images
                          imgs.push(obj)
                          array[index2].variation_images = imgs
                        } else {
                          let imgs = []
                          imgs.push(obj)
                          array[index2].variation_images = imgs
                        }
                    }
                })

              })

              productData.variations.forEach((element, index, array) => {
                // console.log("===element 11===")
                // console.log(element.variation_images)
                if(element.arabic_name || element.arabic_sortings){
                  productData.arabic.variations.push({
                    arabic_name: element.arabic_name ? element.arabic_name : "",
                    arabic_code: "",
                    arabic_variation_price: "",
                    arabic_variation_stock: "",
                    arabic_link:"",
                    arabic_sortings: element.arabic_sortings ? element.arabic_sortings : [],
                    variation_images: element.variation_images
                    });
                }
            });
            console.log(productData.arabic.variations)
            }
            setProducts(productData);
          }
        })
        .catch((err) => {
          alert(
            "Something went wrong while fetching product info, please reload the app or contact support."
          );
          console.log("some thing went wrong", err);
        });
    }
  }, []);
  //!---------------------------Category---------------
  const [data, setData] = useState([]);

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

  //Select category field
  const handleCategorySelect = (e) => {
    let updateValues = { ...products };
    updateValues[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  //Select subcategory field
  const handleSubCategorySelect = (e) => {
    let updateValues = { ...products };
    updateValues[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  const handleTagSelect = (tags) => {
    let updateValues = { ...products };
    updateValues.tags = tags?.map((x) => x.value || []);
    setProducts(updateValues);
  };

  const handleArabicTagSelect = (tags) => {
    let updateValues = { ...products };
    updateValues.arabic_tags = tags?.map((x) => x.value || []);
    setProducts(updateValues);
  };

  const handleSortingSelect = (sortings) => {
    let updateValues = { ...products };
    updateValues.sortings = sortings?.map((x) => x.value || []);
    setProducts(updateValues);
  };

  const handleVariationSortingSelect = (sortings, index) => {
    let updateValues = { ...products };
    updateValues.variations[index].sortings = sortings?.map(
      (x) => x.value || []
    );
    setProducts(updateValues);
  };

  const handleVariationArabicSortingSelect = (sortings, index) => {
    let updateValues = { ...products };
    updateValues.variations[index].arabic_sortings = sortings?.map(
      (x) => x.value || []
    );
    setProducts(updateValues);
  };
  const handleArabicVariationArabicSortingSelect = (sortings, index) => {
    let updateValues = { ...products };
    updateValues.arabic.variations[index].arabic_sortings = sortings?.map(
      (x) => x.value || []
    );
    setProducts(updateValues);
  };

  useEffect(() => {
    getGalleryImages();
  }, []);

  useEffect(() => {
    if(refresh != 0){
    }
  }, [refresh]);

  const getGalleryImages = () => {
    API.get(`/uploads`).then((response) => {
    // axios.get(`https://pigeonarabia.com/E_Commerce_APis_v2/public/api/uploads`).then((response) => {
        if (response.status === 200) {
            setImagesData(response.data?.map((x) => ({ ...x, isChecked: false })));
        }
    }).catch(err => console.log(err));
  };

  //!--Select Image From Gallery

  const handleImageSelect = (e, index) => {

    if (e.target.checked) {
      if (isSingle && !isBanner) {
        setProducts({
          ...products,
          featured_img: imagesData[index].avatar,
        });
        setThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else if (!isSingle && isBanner) {
        setProducts({
          ...products,
          banner_images_list: [imagesData[index].avatar],
        });
        setBannerThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setModalShow(false);
        }, 500);
      } else {
        console.log(isArabicSingle)
        if(isArabicSingle){
          console.log("476")
          if(!products.arabic.variations){
            products.arabic.variations = []
          }
          if(products?.arabic?.variations?.length < 1){
            console.log("478")
            let selectedProduct = {...products }
            if(!selectedProduct.arabic.images_list){
              selectedProduct.arabic.images_list = []
            }
            console.log("485")
            let img = { image: imagesData[index].avatar, is_default: false }
            selectedProduct.arabic.images_list.push(img)
            setProducts(selectedProduct);
            console.log("products")
            console.log(products.arabic.images_list)
          }
        } else if(arabicVeriationIndex){
          console.log("hhhhhhhheeeeeeeeeerrrr 494")
            let arabicVarIndex = arabicVeriationIndex -1
            let varProduct = { ...products };
            let a = { "image" :  imagesData[index].avatar, "is_default" : false }

            if(!varProduct.arabic.variations[arabicVarIndex].variation_images){
              varProduct.arabic.variations[arabicVarIndex].variation_images = []
            }

            varProduct.arabic.variations[arabicVarIndex].variation_images.push(a)
            setProducts(varProduct)
            console.log(varProduct.arabic.variations)
            // setProducts({
            //   ...products,
            //   images_list: [...products.images_list, imagesData[index].avatar],
            //   variation_images: [
            //     ...products.variation_images,
            //     { image: imagesData[index].avatar, variation: "" },
            //   ],
            // });
        } else {
          console.log("ENG VAR IND")
          setSelectedImages([...selectedImages, { image: imagesData[index].avatar, is_default: false }]);
          if (products?.variations?.length < 1) {
              console.log("505")
                setProducts({
                  ...products,
                  images_list: [...products.images_list, { image: imagesData[index].avatar, is_default: false } ],
                  variation_images: [
                    ...products.variation_images,
                    { image: imagesData[index].avatar, variation: "" },
                  ],
                  single_default_images: [
                    ...products.single_default_images,
                    { image: imagesData[index].avatar, is_default: false },
                  ],
                });
              // }
          } else {
            let variation_images = { ...products };
            let a = { "image" :  imagesData[index].avatar, "is_default" : false }
            variation_images.variations[veriationIndex].variation_images.push(a)
            setProducts(variation_images)
            setProducts({
              ...products,
              images_list: [...products.images_list, imagesData[index].avatar],
              variation_images: [
                ...products.variation_images,
                { image: imagesData[index].avatar, variation: "" },
              ],
            });
          }
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


      // }
    } else {
      console.log("517")
      if (isSingle && !isBanner) {
        setProducts({ ...products, thumbnail: "" });
        setThumbnailPreview("");
      } else if (!isSingle && isBanner) {
        setProducts({ ...products, banner_img: "" });
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

  const handleContentImageSelect = (e, index) => {

    if (e.target.checked) {
      if (isOverview && !isFeatures) {
        setProducts({
          ...products,
          overview: imagesData[index].avatar,
        });
        setOverviewThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setContentModalShow(false);
        }, 500);
      } else if (!isOverview && isFeatures) {
        setProducts({
          ...products,
          features: imagesData[index].avatar,
        });
        setFeaturesThumbnailPreview(imagesData[index].avatar);
        setTimeout(() => {
          setContentModalShow(false);
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
      // }
    } else {
      if (isOverview && !isFeatures) {
        setProducts({ ...products, overview: "" });
        setOverviewThumbnailPreview("");
      } else if (!isOverview && isFeatures) {
        setProducts({ ...products, features: "" });
        setFeaturesThumbnailPreview("");
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

  //Hanle Meta Details
  const handleMetaDetials = (e) => {
    let updateFields = { ...products };
    updateFields.meta_details[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  //Handle Input Fields
  const handleInput = (e) => {
    let updateValues = { ...products };
    updateValues[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  //! variation changes
  const handleVariationChange = (e, index) => {
    console.log("handleVariationChange ::", e.target.value)
    let updatedProducts = { ...products };
    updatedProducts.variations[index][e.target.name] = e.target.value;
    setProducts(updatedProducts);
  };

  const handleArabicVariationChange = (e, index) => {
    console.log("handleArabicVariationChange ::", e.target.value)
    let updatedProducts = { ...products };
    updatedProducts.arabic.variations[index][e.target.name] = e.target.value;
    setProducts(updatedProducts);
  };

  const handleVariationImageChange = (e, index, image) => {
    let updatedProducts = { ...products };
    updatedProducts.variation_images[index].variation = e.target.value;
    updatedProducts.variation_images[index].image = image;
    setProducts(updatedProducts);
  };

  const handleVariationDefaultChange = (e, index, image) => {
    let updatedProducts = { ...products };

    updatedProducts.variation_images[index].is_default = e.target.checked;
    setProducts(updatedProducts);
  };
  const handleSingleDefaultChange = (e, index) => {
    let updatedProducts = { ...products };
    console.log(index)
    let updatedDefault = updatedProducts.images_list.map((x, ind) => {
      if(ind == index){
        return {
          image: x.image,
          is_default: true,
        };
      } else {
        return {
          image: x.image,
          is_default: false,
        };
      }
    });

    updatedProducts.images_list = updatedDefault;
    setProducts(updatedProducts);
    setSelectedImages(updatedDefault);
  };
  const handleSingleArabicDefaultChange = (e, index) => {
    let updatedProducts = { ...products };
    console.log(index)
    let updatedDefault = updatedProducts.arabic.images_list.map((x, ind) => {
      if(ind == index){
        return {
          image: x.image,
          is_default: true,
        };
      } else {
        return {
          image: x.image,
          is_default: false,
        };
      }
    });
    updatedProducts.arabic.images_list = updatedDefault;
    setProducts(updatedProducts);
    // setSelectedImages(updatedDefault);
  };

  const addVariation = () => {
    let updatedProducts = { ...products };
    updatedProducts.variations.push({
      name: "",
      arabic_name: "",
      code: "",
      variation_price: "",
      variation_stock: "",
      link:"",
      sortings:[],
      arabic_sortings:[],
      variation_images:[]
    });

    console.log("668 updatedProducts")
    console.log(updatedProducts)
    setProducts(updatedProducts);
  };

  const addArabicVariation = () => {
    let updatedProducts = { ...products };

    if(!updatedProducts.arabic.variations){
      let a = updatedProducts.arabic
      a.variations = []
      updatedProducts.arabic = a
    }

    updatedProducts.arabic.variations.push({
        arabic_name: "",
        arabic_code: "",
        arabic_variation_price: "",
        arabic_variation_stock: "",
        arabic_link:"",
        arabic_sortings:[],
        arabic_variation_images:[]
        });

    console.log(updatedProducts)
    setProducts(updatedProducts);
  };

  const removeVariation = (index) => {
    let updatedProducts = { ...products };
    let updatedVariations = updatedProducts.variations.filter(
      (x, i) => i !== index
    );
    updatedProducts.variations = updatedVariations;
    setProducts(updatedProducts);
  };

  const removeArabicVariation = (index) => {
    let updatedProducts = { ...products };
    let updatedVariations = updatedProducts.arabic.variations.filter(
      (x, i) => i !== index
    );
    updatedProducts.arabic.variations = updatedVariations;
    setProducts(updatedProducts);
  };

  const handleDownloadsUpload = (event) => {
    let downloadFile = event.target.files[0];

    const config = {
      bucketName: "pigeon-gallery",
      dirName: "downloads",
      region: "eu-central-1",
      accessKeyId: "AKIA3NKPVIWSTWXS7QGQ",
      secretAccessKey: "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",
    };
    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(
      downloadFile,
      downloadFile.name || new Date().toTimeString()
    ).then((data) => {
      if (data.status === 204) {
        let updatedProducts = { ...products };
        updatedProducts.downloads = data.location;
        setProducts(updatedProducts);
        console.log("success");
      } else {
        console.log("fail");
      }
    });
  };

  // ARABIC VERSION HANDLERS

  //Hanle Meta Details
  const handleArabicMetaDetials = (e) => {
    let updateFields = { ...products };
    updateFields.arabic.meta_details[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  const handleArabicTags = (tags) => {
    let updateFields = { ...products };
    updateFields.arabic.tags = tags?.map((x) => x.value || []);
    //updateFields.arabic.tags[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  const handleArabicTagsList = (tags) => {
    let updateFields = { ...products };
    updateFields.arabic.arabic_tags = tags?.map((x) => x.value || []);
    //updateFields.arabic.tags[e.target.name] = e.target.value;
    setProducts(updateFields);
  };

  //Handle Input Fields
  const handleArabicInput = (e) => {
    let updateValues = { ...products };
    updateValues.arabic[e.target.name] = e.target.value;
    setProducts(updateValues);
  };

  //!---------handle submit-------------
  const handleSubmit = () => {
    if (products.name === "") {
      alert("Please Enter Product Name");
      return;
    }
    let submitProducts = { ...products };
    console.log("======submitProducts")
    console.log(submitProducts)
    // return false;

    if (!submitProducts.variations?.length > 0) {
      submitProducts.variation_images = [];
    }

    if (isEdit) {
      let updateId = submitProducts.route;

      if(submitProducts.single_default_images){
        submitProducts.single_default_images = submitProducts.images_list
      }

      delete submitProducts["_id"];
      API.put(`/products/${updateId}`, submitProducts)
        .then((response) => {
          alert("Product updated successfully");
          history.push("/products/list");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      submitProducts = {...submitProducts, is_new : 1}
      API.post("/products", submitProducts)
        .then((response) => {
          alert("Product has been added successfully");
          setProducts({ ...initialProducts });
          history.push("/products/list");
        })
        .catch((err) => {
          alert("Something went wrong.");
          console.log(err);
        });
    }
  };

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };
  const handleArabicDrag = (ev) => {
    setArabicDragId(ev.currentTarget.id);
  };

  const removeProductVariation = (variationIndex, imageIndex) => {
    let selectedProduct = { ...products }
        selectedProduct.variations[variationIndex].variation_images = selectedProduct.variations[variationIndex].variation_images.filter(
      (y, ind) => ind != imageIndex
    )
    setProducts(selectedProduct);

    return false;

  }

  const removeArabicProductVariation = (variationIndex, imageIndex) => {
    console.log("===variationIndex, imageIndex")
    console.log(variationIndex, imageIndex)
    let selectedProduct = { ...products }

    console.log("selectedProduct.arabic.variations[variationIndex].variation_images")
    console.log(selectedProduct.arabic.variations[variationIndex].variation_images)

      //   selectedProduct.arabic.variations[variationIndex].variation_images = selectedProduct.variations[variationIndex].variation_images.filter(
      // (y, index) => index != imageIndex
      // )

    selectedProduct.arabic.variations[variationIndex].variation_images.splice(imageIndex,1)
    setProducts(selectedProduct);

    console.log("selectedProduct.arabic.variations[variationIndex].variation_images")
    console.log(selectedProduct.arabic.variations[variationIndex].variation_images)

  }

  const handleDefaultChangeVariation = (variationIndex, imageIndex) => {
    console.log("handleDefaultChangeVariation")
    let selectedProduct = { ...products }
        selectedProduct.variations[variationIndex].variation_images = selectedProduct.variations[variationIndex].variation_images.map((x, ind) => {
          if(ind == imageIndex){
            return {
              image: x.image,
              is_default: true,
            };
          } else {
            return {
              image: x.image,
              is_default: false,
            };
          }
        });
    setProducts(selectedProduct);

    return false;

  }

  const handleDefaultChangeArabicVariation = (variationIndex, imageIndex) => {
    console.log("handleDefaultChangeArabicVariation")
    let selectedProduct = { ...products }
        selectedProduct.arabic.variations[variationIndex].variation_images = selectedProduct.arabic.variations[variationIndex].variation_images.map((x, ind) => {
          if(ind == imageIndex){
            return {
              image: x.image,
              is_default: true,
            };
          } else {
            return {
              image: x.image,
              is_default: false,
            };
          }
        });
    setProducts(selectedProduct);

    return false;

  }

  const removeProduct = (index) => {
          let selectedProduct = { ...products }
          let productImages = selectedProduct.single_default_images

          productImages = productImages.filter(function( element, ind ) {
            return ind !== index;
         });
         selectedProduct.single_default_images = productImages;
         setProducts(selectedProduct);
  }
  const removeArabicProduct = (index) => {
          let selectedProduct = { ...products }
          let productImages = selectedProduct.arabic.images_list

          productImages = productImages.filter(function( element, ind ) {
            return ind !== index;
         });
         selectedProduct.arabic.images_list = productImages;
         setProducts(selectedProduct);
  }

  const handleDrop = (ev, objKey, ind = -1) => {
      let dragDivId = dragId - 1;
      let dropDivId = objKey - 1;
      if(ind != -1){
        let updatedVarientImages = { ...products }
        if(dragDivId > dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i <= dragDivId; i++) {
            if(i == dropDivId){
              temp_image = updatedVarientImages.variations[ind].variation_images[dropDivId];
              updatedVarientImages.variations[ind].variation_images[dropDivId] = updatedVarientImages.variations[ind].variation_images[dragDivId];
            } else {
              temp_image2 = updatedVarientImages.variations[ind].variation_images[i];
              updatedVarientImages.variations[ind].variation_images[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }

        if(dragDivId < dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i >= dragDivId; i--) {
            if(i == dropDivId){
              temp_image = updatedVarientImages.variations[ind].variation_images[dropDivId];
              updatedVarientImages.variations[ind].variation_images[dropDivId] = updatedVarientImages.variations[ind].variation_images[dragDivId];
            } else {
              temp_image2 = updatedVarientImages.variations[ind].variation_images[i];
              updatedVarientImages.variations[ind].variation_images[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }
        setProducts(updatedVarientImages)
      } else {
        let updatedImages = selectedImages
        if(dragDivId > dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i <= dragDivId; i++) {
            if(i == dropDivId){
              temp_image = updatedImages[dropDivId];
              updatedImages[dropDivId] = updatedImages[dragDivId];
            } else {
              temp_image2 = updatedImages[i];
              updatedImages[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }

        if(dragDivId < dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i >= dragDivId; i--) {
            if(i == dropDivId){
              temp_image = updatedImages[dropDivId];
              updatedImages[dropDivId] = updatedImages[dragDivId];
            } else {
              temp_image2 = updatedImages[i];
              updatedImages[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }

        setRefresh(refresh + 1)
        setSelectedImages(updatedImages);
        setProducts({
          ...products,
          images_list: selectedImages,single_default_images: selectedImages})
      }

    };
  const handleArabicDrop = (ev, objKey, ind = -1) => {
      let dragDivId = arabicDragId - 1;
      let dropDivId = objKey - 1;
      if(ind != -1){
        let updatedVarientImages = { ...products }
        if(dragDivId > dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i <= dragDivId; i++) {
            if(i == dropDivId){
              temp_image = updatedVarientImages.arabic.variations[ind].variation_images[dropDivId];
              updatedVarientImages.arabic.variations[ind].variation_images[dropDivId] = updatedVarientImages.arabic.variations[ind].variation_images[dragDivId];
            } else {
              temp_image2 = updatedVarientImages.arabic.variations[ind].variation_images[i];
              updatedVarientImages.arabic.variations[ind].variation_images[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }

        if(dragDivId < dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i >= dragDivId; i--) {
            if(i == dropDivId){
              temp_image = updatedVarientImages.arabic.variations[ind].variation_images[dropDivId];
              updatedVarientImages.arabic.variations[ind].variation_images[dropDivId] = updatedVarientImages.arabic.variations[ind].variation_images[dragDivId];
            } else {
              temp_image2 = updatedVarientImages.arabic.variations[ind].variation_images[i];
              updatedVarientImages.arabic.variations[ind].variation_images[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }
        setProducts(updatedVarientImages)
      } else {
        let updatedImages = { ...products }
        if(dragDivId > dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i <= dragDivId; i++) {
            if(i == dropDivId){
              temp_image = updatedImages.arabic.images_list[dropDivId];
              updatedImages.arabic.images_list[dropDivId] = updatedImages.arabic.images_list[dragDivId];
            } else {
              temp_image2 = updatedImages.arabic.images_list[i];
              updatedImages.arabic.images_list[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }

        if(dragDivId < dropDivId){
          let temp_image = "";
          let temp_image2 = "";
          for (let i = dropDivId; i >= dragDivId; i--) {
            if(i == dropDivId){
              temp_image = updatedImages.arabic.images_list[dropDivId];
              updatedImages.arabic.images_list[dropDivId] = updatedImages.arabic.images_list[dragDivId];
            } else {
              temp_image2 = updatedImages.arabic.images_list[i];
              updatedImages.arabic.images_list[i] = temp_image;
              temp_image = temp_image2
            }
          }
        }

        setRefresh(refresh + 1)
        // setSelectedImages(updatedImages);
        setProducts(updatedImages)
      }

    };

  return (
    <div
      className="cards-wrapper-product"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Card className="product-form-wrap">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit" : "Add"} Product Form </CardTitle>
        </CardHeader>
        <CardBody>
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
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="">
                    <Label for="name">Name</Label>
                    <Field
                      name="name"
                      id="name"
                      onChange={handleInput}
                      value={products.name}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="">
                    <Label for="route">Route</Label>
                    <Field
                      name="route"
                      id="route"
                      onChange={handleInput}
                      value={products.route}
                      className={`form-control`}
                      disabled={(isEdit) ? "disabled" : ""}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="my-2">
                    <Label for="product_code">Product Code</Label>
                    <Field
                      name="product_code"
                      id="product_code"
                      onChange={handleInput}
                      value={products.product_code}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="my-2">
                    <Label for="product_code">FirstCry Link</Label>
                    <Field
                      name="firstcry_link"
                      id="firstcry_link"
                      onChange={handleInput}
                      value={products.firstcry_link}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="my-2">
                    <Label for="default_price">Price</Label>
                    <Field
                      name="default_price"
                      id="default_price"
                      onChange={handleInput}
                      value={products.default_price}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="my-2">
                    <Label for="default_stock">Stock</Label>
                    <Field
                      name="default_stock"
                      id="default_stock"
                      onChange={handleInput}
                      value={products.default_stock}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="my-2">
                    <Label for="rating">Rating</Label>
                    <Field
                      name="rating"
                      id="rating"
                      onChange={handleInput}
                      value={products.rating}
                      className={`form-control`}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="mb-2">
                    <Label>Variations</Label>
                    <div className="clearfix mb-1" />
                    {products?.variations?.map((x, ind) => (
                      <div className="variation-row-wrapper mb-2">
                        <Row>
                          <Col sm={4} style={{marginBottom : "10px"}}>
                            <Field
                              name={`name`}
                              id={`variation_name_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.name}
                              placeholder={"Name"}
                              className={`form-control`}
                            />
                          </Col>
                          {/* <Col sm={4}>
                            <Field
                              name={`arabic_name`}
                              id={`variation_name_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.arabic_name}
                              placeholder={"arabic name"}
                              className={`form-control`}
                            />
                          </Col> */}
                          <Col sm={4}>
                            <Field
                              name={`code`}
                              id={`variation_code_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.code}
                              placeholder={"Code"}
                              className={`form-control`}
                            />
                          </Col>
                          <Col sm={4}>
                            <Field
                              name={`link`}
                              id={`variation_link_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.link}
                              placeholder={"English First Cry Link"}
                              className={`form-control`}
                            />
                          </Col>
                          {/* <Col sm={4}>
                            <Field
                              name={`arabic_link`}
                              id={`variation_link_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.arabic_link}
                              placeholder={"Arabic First Cry Link"}
                              className={`form-control`}
                            />
                          </Col> */}
                          <Col sm={4}>
                            <Field
                              name={`variation_price`}
                              id={`variation_price_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.variation_price}
                              placeholder={"Price"}
                              className={`form-control`}
                            />
                          </Col>
                          <Col sm={4}>
                            <Field
                              name={`variation_stock`}
                              id={`variation_stock${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.variation_stock}
                              placeholder={"Stock"}
                              className={`form-control`}
                            />
                          </Col>
                          <Col sm={11}>
                            <FormGroup>
                              {/* <Label for="sorting">Variation Tags</Label> */}
                              <MultiSelect
                                isMulti
                                options={tagsList}
                                placeholder="Select Tags"
                                className="variation-tags"
                                onChange={(e) =>
                                  handleVariationSortingSelect(e, ind)
                                }
                                value={x?.sortings?.map((x) => {
                                  return {
                                    value: x,
                                    label: x,
                                  };
                                })}
                              />
                            </FormGroup>
                          </Col>
                          {/* Images List */}
                          <Col sm={11}>
                            <FormGroup className="my-2">
                              <Label for="images_list">English Variation Images</Label>
                              <div className="clearfix" />

                              <Button.Ripple
                                color="primary"
                                onClick={() => {
                                  setIsSingle(false);
                                  setIsBanner(false);
                                  setModalShow(true);
                                  setArabicVeriationIndex(0)
                                  setVeriationIndex(ind)
                                  setIsArabicSingle(false);
                                }}
                              >
                                Add Variation Images
                              </Button.Ripple>
                            </FormGroup>
                          </Col>
                        <Col sm={11}>
                          <Row style={{margin: "0px"}}>
                            {/* {products.variations[ind].variation_images ?.map((x, index) => (
                              <Col sm={3} key={index}>
                                <div className="img-preview-wrapper preview-small">
                                  <RemoveCircleOutline
                                    className="remove-icon-productremove-icon"
                                    color="secondary"
                                    onClick={() => {
                                      setSelectedImages(
                                        selectedImages.filter(
                                          (y, ind) => ind != index
                                        )
                                      );
                                      setProducts({
                                        ...products,
                                        images_list: products.images_list.filter(
                                          (y, ind) => ind != index
                                        ),
                                        variation_images: products.variation_images.filter(
                                          (y, ind) => ind != index
                                        ),
                                        single_default_images: products.single_default_images.filter(
                                          (y, ind) => ind != index
                                        ),
                                      });
                                    }}
                                  />
                                  <img src={x} alt="" />
                                  <FormGroup
                                    check
                                    style={
                                      {
                                        // height: "100%",
                                        // display: "flex",
                                        // // flexDirection: "column",
                                        // alignItems: "center",
                                        // justifyContent: "center",
                                        // marginTop: "10px",
                                      }
                                    }
                                  >
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="is_default"
                                        id={`is_default_s_${index}`}
                                        checked={
                                          products.single_default_images?.[index]
                                            ?.is_default
                                        }
                                        onChange={(e) =>
                                          handleSingleDefaultChange(e, index, x)
                                        }
                                      />
                                      Default/First Image ?
                                    </Label>
                                  </FormGroup>
                                </div>
                              </Col>
                            ))} */}

                          <Grid container spacing={2}>
                            {/* <Grid item xs={12}></Grid> */}
                            <Grid item sm={12}>
                              <Grid container spacing={1}>
                                {products.variations[ind].variation_images
                                  ?.sort((a, b) => a.order - b.order)
                                  .map((x, index) => (
                                    <React.Fragment>
                                      <Grid item xs={3} sm={3}>
                                        <Paper
                                          className="px-2 py-3 header-menu-list-item"
                                          key={index + 1}
                                          id={index + 1}
                                          draggable
                                          onDragStart={handleDrag}
                                          onDrop={(ev) => handleDrop(ev, index + 1, ind)}
                                          onDragOver={(ev) => ev.preventDefault()}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            height: "150px",
                                          }}
                                        >

                                          <Grid container spacing={1}>
                                            <Grid
                                              item
                                              xs={12}
                                              sm={2}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <DragHandleOutlined
                                                style={{ cursor: "grab" }}
                                                color="disabled"
                                              />
                                            </Grid>

                                            <Grid item xs={12} sm={10}>
                                              <div
                                                style={{
                                                  width: "100%",
                                                  height: "120px",
                                                }}
                                              >
                                                <img
                                                  src={x.image}
                                                  alt=""
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                  }}
                                                />

                                              </div>
                                              <FormGroup
                                    check
                                    style={
                                      {
                                        // height: "100%",
                                        // display: "flex",
                                        // // flexDirection: "column",
                                        // alignItems: "center",
                                        // justifyContent: "center",
                                        // marginTop: "10px",
                                      }
                                    }
                                  >
                                  <Label check style={{fontSize : "10px",display: "flex",flexDirection: "column-reverse"}}>
                                      <Input
                                        type="checkbox"
                                        name="is_default"
                                        id={`is_default_s_${index}`}
                                        checked={
                                          x.is_default
                                        }
                                        onChange={(e) =>
                                          handleDefaultChangeVariation(ind, index)
                                        }
                                      />
                                      Set Default Image
                                    </Label>
                                  </FormGroup>
                                            </Grid>
                                          </Grid>
                                          <RemoveCircleOutline
                                                    className="remove-icon-product"
                                                    color="secondary"
                                                    onClick={() => {
                                                      // removeProduct(index);
                                                      // setSelectedImages(
                                                      //   selectedImages.filter(
                                                      //     (y, ind) => ind != index
                                                      //   )
                                                      // );
                                                      // setProducts({
                                                      //   ...products,
                                                      //   images_list: products.images_list.filter(
                                                      //     (y, ind) => ind != index
                                                      //   ),
                                                      //   variation_images: products.variation_images.filter(
                                                      //     (y, ind) => ind != index
                                                      //   ),
                                                      // });
                                                      removeProductVariation(ind, index)
                                                    }}
                                                  />
                                        </Paper>
                                      </Grid>
                                    </React.Fragment>
                                  ))}
                              </Grid>
                              <hr />
                            </Grid>
                          </Grid>
                        </Row>
                      </Col>
                          {/* <Col sm={11}>
                            <FormGroup>
                              <Label for="sorting">Arabic Tags</Label>
                              <MultiSelect
                                isMulti
                                options={arabicTagsList}
                                placeholder="Select Tags"
                                className="variation-tags"
                                onChange={(e) =>
                                  handleVariationArabicSortingSelect(e, ind)
                                }
                                value={x?.arabic_sortings?.map((x) => {
                                  return {
                                    value: x,
                                    label: x,
                                  };
                                })}
                              />
                            </FormGroup>
                          </Col> */}
                          <Col sm={11}>
                            <div
                              style={{ height: "100%" }}
                              className="d-flex align-items-center"
                            >
                              <DeleteOutlined
                                color="secondary"
                                onClick={() => removeVariation(ind)}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                    <Button.Ripple
                      onClick={addVariation}
                      color="danger"
                      type="button"
                      className="mt-0"
                      size="sm"
                    >
                      Add Variation
                    </Button.Ripple>
                  </div>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup>
                    <Label for="category">Select Category</Label>
                    <CustomInput
                      type="select"
                      name="category"
                      id="category"
                      value={products.category}
                      onChange={handleCategorySelect}
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
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup>
                    <Label for="sub_category">Select Sub-Category</Label>
                    <CustomInput
                      type="select"
                      name="sub_category"
                      id="sub_category"
                      value={products.sub_category}
                      onChange={handleSubCategorySelect}
                    >
                      <option value={"all"}>Select Subcategory</option>
                      {data
                        ?.filter((c) => c.parent_id === products.category)
                        ?.map((x) => (
                          <React.Fragment key={x._id}>
                            {x.parent_id && (
                              <option value={x._id}>{x.name}</option>
                            )}
                          </React.Fragment>
                        ))}
                    </CustomInput>
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup>
                    <Label for="tags">Tags</Label>
                    <MultiSelect
                      isMulti
                      options={tagsList}
                      onChange={handleTagSelect}
                      value={products.tags?.map((x) => {
                        return {
                          value: x,
                          label: x,
                        };
                      })}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup>
                    <Label for="tags">Arabic Tags</Label>
                    <MultiSelect
                      isMulti
                      options={arabicTagsList}
                      onChange={handleArabicTagSelect}
                      value={products.arabic_tags?.map((x) => {
                        return {
                          value: x,
                          label: x,
                        };
                      })}
                    />
                  </FormGroup>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup>
                    <Label for="sorting">Sorting Filters</Label>
                    <MultiSelect
                      isMulti
                      options={sortingList}
                      onChange={handleSortingSelect}
                      value={products.sortings?.map((x) => {
                        return {
                          value: x,
                          label: x,
                        };
                      })}
                    />
                  </FormGroup>
                }

                {/* //!---------------Upload Images-------------------------- */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Card className="inner-card-wrap">
                    <CardHeader>
                      <CardTitle>Add Product Information</CardTitle>
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

                      {/* Images List */}
                      {products.is_new == 1 && products.variations.length > 0 ? "" :
                      <FormGroup className="my-2">
                        <Label for="images_list">Slider Images</Label>
                        <div className="clearfix" />

                        <Button.Ripple
                          color="primary"
                          onClick={() => {
                            setIsSingle(false);
                            setIsBanner(false);
                            setModalShow(true);
                            setArabicVeriationIndex(0)
                            setIsArabicSingle(false);
                          }}
                        >
                          Add Slider Images
                        </Button.Ripple>
                      </FormGroup>
                      }
                      {/* <Row>
                        {selectedImages?.map((x, index) => (
                          <Col sm={3} key={index}>
                            <div className="img-preview-wrapper preview-small">
                              <RemoveCircleOutline
                                className="remove-icon-productremove-icon"
                                color="secondary"
                                onClick={() => {
                                  setSelectedImages(
                                    selectedImages.filter(
                                      (y, ind) => ind != index
                                    )
                                  );
                                  setProducts({
                                    ...products,
                                    images_list: products.images_list.filter(
                                      (y, ind) => ind != index
                                    ),
                                    variation_images: products.variation_images.filter(
                                      (y, ind) => ind != index
                                    ),
                                    single_default_images: products.single_default_images.filter(
                                      (y, ind) => ind != index
                                    ),
                                  });
                                }}
                              />
                              <img src={x} alt="" />
                              <FormGroup
                                check
                                style={
                                  {
                                    // height: "100%",
                                    // display: "flex",
                                    // // flexDirection: "column",
                                    // alignItems: "center",
                                    // justifyContent: "center",
                                    // marginTop: "10px",
                                  }
                                }
                              >
                                <Label check>
                                  <Input
                                    type="checkbox"
                                    name="is_default"
                                    id={`is_default_s_${index}`}
                                    checked={
                                      products.single_default_images?.[index]
                                        ?.is_default
                                    }
                                    onChange={(e) =>
                                      handleSingleDefaultChange(e, index, x)
                                    }
                                  />
                                  Default/First Image ?
                                </Label>
                              </FormGroup>
                            </div>
                          </Col>
                        ))}
                      </Row> */}
                      {products.is_new == 1 && products.variations.length > 0 ? "" :
                        <Row>
                          <Grid container spacing={2}>
                            {/* <Grid item xs={12}></Grid> */}
                            <Grid item sm={12}>
                              <Grid container spacing={1}>
                                {selectedImages
                                  ?.sort((a, b) => a.order - b.order)
                                  .map((x, index) => (
                                    <React.Fragment key={index}>
                                      <Grid item xs={3} sm={3}>

                                        <Paper
                                          className="px-2 py-3 header-menu-list-item"
                                          key={index + 1}
                                          id={index + 1}
                                          draggable
                                          onDragStart={handleDrag}
                                          onDrop={(ev) => handleDrop(ev, index + 1)}
                                          onDragOver={(ev) => ev.preventDefault()}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            height: "150px",
                                          }}
                                        >

                                          <Grid container spacing={1}>

                                            <Grid
                                              item
                                              xs={12}
                                              sm={2}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <DragHandleOutlined
                                                style={{ cursor: "grab" }}
                                                color="disabled"
                                              />
                                            </Grid>

                                            <Grid item xs={12} sm={10}>
                                              <div style={{ width: "100%", height: "120px"}} >
                                                  <img
                                                    src={x.image}
                                                    alt=""
                                                    style={{
                                                      width: "100%",
                                                      height: "100%",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                  <FormGroup check style={{bottom: "10px"}} >
                                  <Label check style={{fontSize : "10px",display: "flex",flexDirection: "column-reverse"}}>
                                      <Input
                                        type="checkbox"
                                        name="is_default"
                                        id={`is_default_s_${index}`}
                                        checked={
                                          x.is_default
                                        }
                                        onChange={(e) =>
                                          handleSingleDefaultChange(e, index, x)
                                        }
                                      />
                                      <span>Default/First Image ?</span>
                                    </Label>
                                  </FormGroup>
                                              </div>
                                            </Grid>
                                            {/* <Grid
                                              item
                                              xs={12}
                                              style={{ position: "relative" }}
                                            > */}
                                              {/* <small
                                                className="mb-0"
                                                style={{
                                                  position: "absolute",
                                                  bottom: 0,
                                                  left: 0,
                                                  width: "100%",
                                                  textAlign: "center",
                                                  background: "rgba(0,0,0,0.5)",
                                                  color: "#fff",
                                                  padding: "0.5rem",
                                                }}
                                              >
                                                {x.substring(0, 60)}
                                              </small> */}
                                            {/* </Grid> */}
                                          </Grid>
                                          <RemoveCircleOutline
                                                    className="remove-icon-product"
                                                    color="secondary"
                                                    onClick={() => {
                                                      removeProduct(index);
                                                      setSelectedImages(
                                                        selectedImages.filter(
                                                          (y, ind) => ind != index
                                                        )
                                                      );
                                                      setProducts({
                                                        ...products,
                                                        images_list: products.images_list.filter(
                                                          (y, ind) => ind != index
                                                        ),
                                                        variation_images: products.variation_images.filter(
                                                          (y, ind) => ind != index
                                                        ),
                                                      });
                                                    }}
                                                  />
                                        </Paper>
                                      </Grid>
                                    </React.Fragment>
                                  ))}
                              </Grid>
                              <hr />
                            </Grid>

                            {/* <Grid
                              item
                              xs={12}
                              style={{
                                alignItems: "flex-end",
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <MaterialButton
                                onClick={() => handleSubmit("menuItems")}
                                color="primary"
                                variant="contained"
                              >
                                Update Section
                              </MaterialButton>
                            </Grid> */}
                          </Grid>
                        </Row>
                      }
                    </CardBody>
                  </Card>
                }

                {/* //!------------------------------------------------------------ */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <FormGroup className="my-2">
                    <Label for="downloads">Downloads</Label>
                    <CustomInput
                      type="file"
                      id="downloads"
                      name="downloads"
                      onChange={handleDownloadsUpload}
                      className={`form-control`}
                    />

                    <p className="mt-2 font-weight-bold">
                      Current Download File:{" "}
                      {products.downloads ? (
                        <a href={products.downloads}>{products.downloads}</a>
                      ) : (
                        "None selected"
                      )}
                    </p>
                  </FormGroup>
                }
                {/* ----------------------------- */}
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div>
                    <Label for="short_description">Short Description</Label>
                    <CKEditor
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={products.short_description}
                      onChange={(e) =>
                        setProducts({
                          ...products,
                          short_description: e.editor.getData(),
                        })
                      }
                    />
                  </div>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div>
                    <Label for="long_description">Long Description</Label>
                    <CKEditor
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={products.long_description}
                      onChange={(e) =>
                        setProducts({
                          ...products,
                          long_description: e.editor.getData(),
                        })
                      }
                    />
                  </div>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div>
                    <Label for="specifications">Specifications</Label>
                    <CKEditor
                      onBeforeLoad={(CKEDITOR) =>
                        (CKEDITOR.disableAutoInline = true)
                      }
                      data={products.specifications?.description || ""}
                      onChange={(e) =>
                        setProducts({
                          ...products,
                          specifications: {
                            ...products.specifications,
                            description: e.editor.getData(),
                          },
                        })
                      }
                    />
                  </div>
                }
                {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <Row>
                    <Col sm={6}>
                      <FormGroup className="my-2">
                        <Label for="featured_img">Overview Content Image</Label>
                        <div className="clearfix" />
                        <div className="img-preview-wrapper">
                          {overviewThumbnailPreview !== "" && (
                            <img src={overviewThumbnailPreview} alt="" />
                          )}
                        </div>
                        <Button.Ripple
                          color="primary"
                          onClick={() => {
                            setIsOverview(true);
                            setIsFeatures(false);
                            setContentModalShow(true);
                          }}
                        >
                          Add Overview Image
                        </Button.Ripple>
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup className="my-2">
                        <Label for="banner_images_list">
                          Features Content Image
                        </Label>
                        <div className="clearfix" />
                        <div className="img-preview-wrapper">
                          {featuresThumbnailPreview !== "" && (
                            <img src={featuresThumbnailPreview} alt="" />
                          )}
                        </div>
                        <Button.Ripple
                          color="primary"
                          onClick={() => {
                            setIsOverview(false);
                            setIsFeatures(true);
                            setContentModalShow(true);
                          }}
                        >
                          Add Features Image
                        </Button.Ripple>
                      </FormGroup>
                    </Col>
                  </Row>
                }

                {/* //!-----------------------Meta Tag Details----------------------------------- */}
                <Card className="inner-card-wrap">
                  <CardHeader>
                    <CardTitle>Meta Tag Details</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className="my-2">
                      <Label for="title" className="mb-1">
                        Meta Title
                      </Label>
                      <Field
                        name="title"
                        id="title"
                        onChange={handleMetaDetials}
                        value={products.meta_details?.title || ""}
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
                        onChange={handleMetaDetials}
                        value={products.meta_details?.description}
                      />
                    </div>
                    <div>
                      <Label for="schema_markup" className="mb-1">
                        Schema Markup
                      </Label>
                      <Input
                        type="textarea"
                        name="schema_markup"
                        id="schema_markup"
                        rows="3"
                        onChange={handleMetaDetials}
                        value={products.meta_details?.schema_markup}
                      />
                    </div>
                  </CardBody>
                </Card>
                {/* //!----------Variation Images Section made false by putting 1000--------------- */}
                {products.images_list?.length > 0 &&
                  products?.variations?.length > 1000 && (
                    <Card className="inner-card-wrap">
                      <CardHeader>
                        <CardTitle>Select Variation Images</CardTitle>
                      </CardHeader>
                      <CardBody>
                        {products.images_list?.sort((a, b) => a.order - b.order).map((x, index) => (
                          <Row>
                            <Col sm={4}>
                              <div style={{ width: "100%" }}>
                                <img
                                  src={x}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </Col>
                            <Col sm={4}>
                              <FormGroup
                                style={{
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  // alignItems:'center',
                                  justifyContent: "center",
                                }}
                              >
                                <Label for="variation_type">
                                  Select Variation
                                </Label>
                                <CustomInput
                                  type="select"
                                  name="variation_type"
                                  id={`variation_type_${index}`}
                                  value={
                                    products.variation_images?.[index]
                                      ?.variation
                                  }
                                  onChange={(e) =>
                                    handleVariationImageChange(e, index, x)
                                  }
                                >
                                  <option value="all">Select Variation</option>
                                  {products.variations?.map((x) => (
                                    <React.Fragment key={x._id}>
                                      {<option value={x.name}>{x.name}</option>}
                                    </React.Fragment>
                                  ))}
                                </CustomInput>
                              </FormGroup>
                            </Col>
                            <Col sm={4}>
                              <FormGroup
                                check
                                style={{
                                  height: "100%",
                                  display: "flex",
                                  // flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: "10px",
                                }}
                              >
                                <Label check>
                                  <Input
                                    type="checkbox"
                                    name="is_default"
                                    id={`is_default_${index}`}
                                    checked={
                                      products.variation_images?.[index]
                                        ?.is_default
                                    }
                                    onChange={(e) =>
                                      handleVariationDefaultChange(e, index, x)
                                    }
                                  />
                                  <span>Default/First Image ?</span>
                                </Label>
                              </FormGroup>
                            </Col>
                          </Row>
                        ))}
                      </CardBody>
                    </Card>
                  )}

                {/* //!----------Submit Button--------------- */}
                {/* <Button.Ripple
                  onClick={handleSubmit}
                  color="primary"
                  type="submit"
                >
                  {isEdit ? "Update" : "Add"}
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
        <GalleryModal
          open={contentModalShow}
          handleClose={() => setContentModalShow(false)}
          handleImageSelect={handleContentImageSelect}
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
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <FormGroup className="">
                        <Label for="name">Name</Label>
                        <Field
                          name="name"
                          id="name-arabic"
                          onChange={handleArabicInput}
                          value={products.arabic?.name || ""}
                          className={`form-control`}
                        />
                      </FormGroup>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <FormGroup className="my-2">
                        <Label for="product_code">FirstCry Link</Label>
                        <Field
                          name="firstcry_arabic_link"
                          id="firstcry_link"
                          onChange={handleArabicInput}
                          value={products.arabic?.firstcry_link}
                          className={`form-control`}
                        />
                      </FormGroup>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <FormGroup>
                        <Label for="tags">Tags</Label>
                        <MultiSelect
                          isMulti
                          options={tagsList}
                          onChange={handleArabicTags}
                          value={products.arabic.tags?.map((x) => {
                            return {
                              value: x,
                              label: x,
                            };
                          })}
                        />
                        <Label for="tags">Arabic Tags</Label>
                        <MultiSelect
                          isMulti
                          options={arabicTagsList}
                          onChange={handleArabicTagsList}
                          value={products.arabic.arabic_tags?.map((x) => {
                            return {
                              value: x,
                              label: x,
                            };
                          })}
                        />
                      </FormGroup>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                  <div className="mb-2">
                    <Label>Variations</Label>
                    <div className="clearfix mb-1" />
                    {products?.arabic.variations?.map((x, ind) => (
                      <div className="variation-row-wrapper mb-2">
                        <Row>
                          {/* <Col sm={4}>
                            <Field
                              name={`name`}
                              id={`variation_name_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.name}
                              placeholder={"Name"}
                              className={`form-control`}
                            />
                          </Col> */}
                          <Col sm={4} style={{marginBottom : "10px"}}>
                            <Field
                              name={`arabic_name`}
                              id={`variation_name_${ind}`}
                              onChange={(e) => handleArabicVariationChange(e, ind)}
                              value={x.arabic_name}
                              placeholder={"arabic name"}
                              className={`form-control`}
                            />
                          </Col>
                          {/* <Col sm={2}>
                            <Field
                              name={`code`}
                              id={`variation_code_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.code}
                              placeholder={"Code"}
                              className={`form-control`}
                            />
                          </Col> */}
                          {/* <Col sm={4}>
                            <Field
                              name={`link`}
                              id={`variation_link_${ind}`}
                              onChange={(e) => handleVariationChange(e, ind)}
                              value={x.link}
                              placeholder={"English First Cry Link"}
                              className={`form-control`}
                            />
                          </Col> */}
                          <Col sm={4}>
                            <Field
                              name={`arabic_link`}
                              id={`variation_link_${ind}`}
                              onChange={(e) => handleArabicVariationChange(e, ind)}
                              value={x.arabic_link}
                              placeholder={"Arabic First Cry Link"}
                              className={`form-control`}
                            />
                          </Col>
                          <Col sm={4}>
                            <Field
                              name={`arabic_variation_price`}
                              id={`arabic_variation_price_${ind}`}
                              onChange={(e) => handleArabicVariationChange(e, ind)}
                              value={x.arabic_variation_price}
                              placeholder={"Price"}
                              className={`form-control`}
                            />
                          </Col>
                          <Col sm={4}>
                            <Field
                                name={`arabic_code`}
                                id={`variation_arabic_code_${ind}`}
                                onChange={(e) => handleArabicVariationChange(e, ind)}
                                value={x.arabic_code}
                                placeholder={"code"}
                                className={`form-control`}
                              />
                          </Col>
                          <Col sm={4}>
                            <Field
                              name={`arabic_variation_stock`}
                              id={`arabic_variation_stock${ind}`}
                              onChange={(e) => handleArabicVariationChange(e, ind)}
                              value={x.arabic_variation_stock}
                              placeholder={"Stock"}
                              className={`form-control`}
                            />
                          </Col>
                          <Col sm={11} style={{marginTop : "10px"}}>
                          <FormGroup>
                              <MultiSelect
                                isMulti
                                options={arabicTagsList}
                                placeholder="Select Arabic Tags"
                                className="variation-tags"
                                onChange={(e) =>
                                  handleArabicVariationArabicSortingSelect(e, ind)
                                }
                                value={x?.arabic_sortings?.map((x) => {
                                  return {
                                    value: x,
                                    label: x,
                                  };
                                })}
                              />
                            </FormGroup>
                          </Col>
                          {/* Images List */}
                          <Col sm={11}>
                            <FormGroup className="my-2">
                              <Label for="images_list">Arabic Variation Images</Label>
                              <div className="clearfix" />

                              <Button.Ripple
                                color="primary"
                                onClick={() => {
                                  setIsSingle(false);
                                  setIsBanner(false);
                                  setModalShow(true);
                                  setArabicVeriationIndex(ind + 1)
                                }}
                              >
                                Add Variation Images
                              </Button.Ripple>
                            </FormGroup>
                          </Col>
                        <Col sm={11}>
                          <Row style={{margin: "0px"}}>
                            {/* {products.variations[ind].variation_images ?.map((x, index) => (
                              <Col sm={3} key={index}>
                                <div className="img-preview-wrapper preview-small">
                                  <RemoveCircleOutline
                                    className="remove-icon-productremove-icon"
                                    color="secondary"
                                    onClick={() => {
                                      setSelectedImages(
                                        selectedImages.filter(
                                          (y, ind) => ind != index
                                        )
                                      );
                                      setProducts({
                                        ...products,
                                        images_list: products.images_list.filter(
                                          (y, ind) => ind != index
                                        ),
                                        variation_images: products.variation_images.filter(
                                          (y, ind) => ind != index
                                        ),
                                        single_default_images: products.single_default_images.filter(
                                          (y, ind) => ind != index
                                        ),
                                      });
                                    }}
                                  />
                                  <img src={x} alt="" />
                                  <FormGroup
                                    check
                                    style={
                                      {
                                        // height: "100%",
                                        // display: "flex",
                                        // // flexDirection: "column",
                                        // alignItems: "center",
                                        // justifyContent: "center",
                                        // marginTop: "10px",
                                      }
                                    }
                                  >
                                    <Label check>
                                      <Input
                                        type="checkbox"
                                        name="is_default"
                                        id={`is_default_s_${index}`}
                                        checked={
                                          products.single_default_images?.[index]
                                            ?.is_default
                                        }
                                        onChange={(e) =>
                                          handleSingleDefaultChange(e, index, x)
                                        }
                                      />
                                      Default/First Image ?
                                    </Label>
                                  </FormGroup>
                                </div>
                              </Col>
                            ))} */}

                          <Grid container spacing={2}>
                            {/* <Grid item xs={12}></Grid> */}
                            <Grid item sm={12}>
                              <Grid container spacing={1}>
                                {products?.arabic?.variations[ind]?.variation_images
                                  ?.sort((a, b) => a.order - b.order)
                                  .map((x, index) => (
                                    <React.Fragment>
                                      <Grid item xs={3} sm={3}>
                                        <Paper
                                          className="px-2 py-3 header-menu-list-item"
                                          key={index + 1}
                                          id={index + 1}
                                          draggable
                                          onDragStart={handleArabicDrag}
                                          onDrop={(ev) => handleArabicDrop(ev, index + 1, ind)}
                                          onDragOver={(ev) => ev.preventDefault()}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            height: "150px",
                                          }}
                                        >

                                          <Grid container spacing={1}>
                                            <Grid
                                              item
                                              xs={12}
                                              sm={2}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <DragHandleOutlined
                                                style={{ cursor: "grab" }}
                                                color="disabled"
                                              />
                                            </Grid>

                                            <Grid item xs={12} sm={10}>
                                              <div
                                                style={{
                                                  width: "100%",
                                                  height: "120px",
                                                }}
                                              >
                                                <img
                                                  src={x.image}
                                                  alt=""
                                                  style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                  }}
                                                />

                                              </div>
                                              <FormGroup
                                    check
                                    style={
                                      {
                                        // height: "100%",
                                        // display: "flex",
                                        // // flexDirection: "column",
                                        // alignItems: "center",
                                        // justifyContent: "center",
                                        // marginTop: "10px",
                                      }
                                    }
                                  >
                                  <Label check style={{fontSize : "10px",display: "flex",flexDirection: "column-reverse"}}>
                                      <Input
                                        type="checkbox"
                                        name="is_default"
                                        id={`is_default_s_${index}`}
                                        checked={
                                          x.is_default
                                        }
                                        onChange={(e) =>
                                          handleDefaultChangeArabicVariation(ind, index)
                                        }
                                      />
                                      Set Default Image
                                    </Label>
                                  </FormGroup>
                                            </Grid>
                                          </Grid>
                                          <RemoveCircleOutline
                                                    className="remove-icon-product"
                                                    color="secondary"
                                                    onClick={() => {
                                                      // removeProduct(index);
                                                      // setSelectedImages(
                                                      //   selectedImages.filter(
                                                      //     (y, ind) => ind != index
                                                      //   )
                                                      // );
                                                      // setProducts({
                                                      //   ...products,
                                                      //   images_list: products.images_list.filter(
                                                      //     (y, ind) => ind != index
                                                      //   ),
                                                      //   variation_images: products.variation_images.filter(
                                                      //     (y, ind) => ind != index
                                                      //   ),
                                                      // });
                                                      removeArabicProductVariation(ind, index)
                                                    }}
                                                  />
                                        </Paper>
                                      </Grid>
                                    </React.Fragment>
                                  ))}
                              </Grid>
                              <hr />
                            </Grid>
                          </Grid>
                        </Row>
                      </Col>
                          {/* <Col sm={11}>
                            <FormGroup>
                              <Label for="sorting">Arabic Tags</Label>
                              <MultiSelect
                                isMulti
                                options={arabicTagsList}
                                placeholder="Select Tags"
                                className="variation-tags"
                                onChange={(e) =>
                                  handleVariationArabicSortingSelect(e, ind)
                                }
                                value={x?.arabic_sortings?.map((x) => {
                                  return {
                                    value: x,
                                    label: x,
                                  };
                                })}
                              />
                            </FormGroup>
                          </Col> */}
                          <Col sm={11}>
                            <div
                              style={{ height: "100%" }}
                              className="d-flex align-items-center"
                            >
                              <DeleteOutlined
                                color="secondary"
                                onClick={() => removeArabicVariation(ind)}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    ))}
                    <Button.Ripple
                      onClick={addArabicVariation}
                      color="danger"
                      type="button"
                      className="mt-0"
                      size="sm"
                    >
                      Add Arabic Variation
                    </Button.Ripple>
                  </div>
                }
                    {products?.arabic?.variations?.length > 0 ? "" :
                      <FormGroup className="my-2">
                        <Label for="images_list">Arabic Slider Images</Label>
                        <div className="clearfix" />

                        <Button.Ripple
                          color="primary"
                          onClick={() => {
                            setIsSingle(false);
                            setIsBanner(false);
                            setModalShow(true);
                            setIsArabicSingle(true);
                            setArabicVeriationIndex(0)
                          }}
                        >
                          Add Slider Images
                        </Button.Ripple>
                      </FormGroup>
                      }
                      { products?.arabic?.variations?.length > 0 ? "" :
                        <Row>
                          <Grid container spacing={2}>
                            {/* <Grid item xs={12}></Grid> */}
                            <Grid item sm={12}>
                              <Grid container spacing={1}>
                                {products?.arabic?.images_list
                                  ?.sort((a, b) => a.order - b.order)
                                  .map((x, index) => (
                                    <React.Fragment key={index}>
                                      <Grid item xs={3} sm={3}>

                                        <Paper
                                          className="px-2 py-3 header-menu-list-item"
                                          key={index + 1}
                                          id={index + 1}
                                          draggable
                                          onDragStart={handleArabicDrag}
                                          onDrop={(ev) => handleArabicDrop(ev, index + 1)}
                                          onDragOver={(ev) => ev.preventDefault()}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            height: "150px",
                                          }}
                                        >

                                          <Grid container spacing={1}>

                                            <Grid
                                              item
                                              xs={12}
                                              sm={2}
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <DragHandleOutlined
                                                style={{ cursor: "grab" }}
                                                color="disabled"
                                              />
                                            </Grid>

                                            <Grid item xs={12} sm={10}>
                                              <div style={{ width: "100%", height: "120px"}} >
                                                  <img
                                                    src={x.image}
                                                    alt=""
                                                    style={{
                                                      width: "100%",
                                                      height: "100%",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                  <FormGroup check style={{bottom: "10px"}} >
                                  <Label check style={{fontSize : "10px",display: "flex",flexDirection: "column-reverse"}}>
                                      <Input
                                        type="checkbox"
                                        name="is_default"
                                        id={`is_default_s_${index}`}
                                        checked={
                                          x.is_default
                                        }
                                        onChange={(e) =>
                                          handleSingleArabicDefaultChange(e, index, x)
                                        }
                                      />
                                      <span>Default/First Image ?</span>
                                    </Label>
                                  </FormGroup>
                                              </div>
                                            </Grid>
                                            {/* <Grid
                                              item
                                              xs={12}
                                              style={{ position: "relative" }}
                                            > */}
                                              {/* <small
                                                className="mb-0"
                                                style={{
                                                  position: "absolute",
                                                  bottom: 0,
                                                  left: 0,
                                                  width: "100%",
                                                  textAlign: "center",
                                                  background: "rgba(0,0,0,0.5)",
                                                  color: "#fff",
                                                  padding: "0.5rem",
                                                }}
                                              >
                                                {x.substring(0, 60)}
                                              </small> */}
                                            {/* </Grid> */}
                                          </Grid>
                                          <RemoveCircleOutline
                                                    className="remove-icon-product"
                                                    color="secondary"
                                                    onClick={() => {
                                                      removeArabicProduct(index);
                                                      // setSelectedImages(
                                                      //   selectedImages.filter(
                                                      //     (y, ind) => ind != index
                                                      //   )
                                                      // );
                                                      // setProducts({
                                                      //   ...products.arabic,
                                                      //   images_list: products.arabic.images_list.filter(
                                                      //     (y, ind) => ind != index
                                                      //   ),
                                                      // });
                                                    }}
                                                  />
                                        </Paper>
                                      </Grid>
                                    </React.Fragment>
                                  ))}
                              </Grid>
                              <hr />
                            </Grid>

                            {/* <Grid
                              item
                              xs={12}
                              style={{
                                alignItems: "flex-end",
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <MaterialButton
                                onClick={() => handleSubmit("menuItems")}
                                color="primary"
                                variant="contained"
                              >
                                Update Section
                              </MaterialButton>
                            </Grid> */}
                          </Grid>
                        </Row>
                      }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <div>
                        <Label for="short_description">Short Description</Label>
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          data={products.arabic?.short_description || "<p></p>"}
                          onChange={(e) =>
                            setProducts({
                              ...products,
                              arabic: {
                                ...products.arabic,
                                short_description: e.editor.getData(),
                              },
                            })
                          }
                        />
                      </div>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <div>
                        <Label for="long_description">Long Description</Label>
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          data={products.arabic?.long_description || "<p></p>"}
                          onChange={(e) =>
                            setProducts({
                              ...products,
                              arabic: {
                                ...products.arabic,
                                long_description: e.editor.getData(),
                              },
                            })
                          }
                        />
                      </div>
                    }
                    {props.dataLog.login.loggedInUser.role !== 'seo' &&
                      <div>
                        <Label for="specifications">Specifications</Label>
                        <CKEditor
                          onBeforeLoad={(CKEDITOR) =>
                            (CKEDITOR.disableAutoInline = true)
                          }
                          data={
                            products.arabic?.specifications?.description ||
                            "<p></p>"
                          }
                          onChange={(e) =>
                            setProducts({
                              ...products,
                              arabic: {
                                ...products.arabic,
                                specifications: {
                                  ...products.arabic?.specifications,
                                  description: e.editor.getData(),
                                },
                              },
                            })
                          }
                        />
                      </div>
                    }
                    {/* //!-----------------------Meta Tag Details----------------------------------- */}
                    <Card className="inner-card-wrap">
                      <CardHeader>
                        <CardTitle>Meta Tag Details</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <FormGroup className="my-2">
                          <Label for="title" className="mb-1">
                            Meta Title
                          </Label>
                          <Field
                            name="title"
                            id="title"
                            onChange={handleArabicMetaDetials}
                            value={products.arabic?.meta_details?.title || ""}
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
                            onChange={handleArabicMetaDetials}
                            value={
                              products.arabic?.meta_details?.description || ""
                            }
                          />
                        </div>
                        <div>
                          <Label for="schema_markup" className="mb-1">
                            Schema Markup
                          </Label>
                          <Input
                            type="textarea"
                            name="schema_markup"
                            id="schema_markup"
                            rows="3"
                            onChange={handleArabicMetaDetials}
                            value={
                              products.arabic?.meta_details?.schema_markup || ""
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
          <Button.Ripple onClick={handleSubmit} color="primary" type="submit">
            {isEdit ? "Update" : "Add"}
          </Button.Ripple>
        </CardBody>
      </Card>
    </div>
  );
};

// export default ProductsForm;
export default connect(mapStateToProps)(ProductsForm);
