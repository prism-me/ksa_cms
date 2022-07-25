import React from "react";
import * as Icon from "react-feather";
import { CgProductHunt } from "react-icons/cg";

const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: <Icon.Home size={20} />,
    navLink: "/",
    // badge: "warning",
    // badgeText: "2",

  },
    //! -----------Home Page---------
    {
      id: "homePage",
      title: "Home",
      type: "item",
      icon: <Icon.Home size={12} />,
      permissions: ["admin", "editor"],
      navLink: "/home-page",
    },

    //!---------------- Categories--------
    {
      id: "categoryList",
      title: "Categories",
      type: "item",
      icon: <Icon.Menu size={12} />,
      permissions: ["admin", "editor"],
      navLink: "/category/list",
    },

  //!---------------- Products--------
  {
    id: "productList",
    title: "Product",
    type: "item",
    icon: <Icon.Package size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/products/list",
  },

  //!----------------Sub Categories--------
  // {
  //   id: "subCategoryList",
  //   title: "Sub Categories",
  //   type: "item",
  //   icon: <Icon.ShoppingBag size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/sub-category/list",
  // },

    //!-----------Blog----------
    {
      id: "blog",
      title: "Blog",
      type: "item",
      icon: <Icon.AlertTriangle size={12} />,
      permissions: ["admin", "editor"],
      navLink: "/blog",
      // children: [
      //   {
      //     id: "blogGrid",
      //     title: "Blog Grid",
      //     type: "item",
      //     icon: <Icon.Circle size={12} />,
      //     permissions: ["admin", "editor"],
      //     navLink: "/blog/list",
      //   },
      //   {
      //     id: "blogItem",
      //     title: "Blog Items",
      //     type: "item",
      //     icon: <Icon.Clipboard size={12} />,
      //     permissions: ["admin", "editor"],
      //     navLink: "/blog-item/list",
      //   },
      // ],
    },

    //!--------------Videos-------
    {
      id: "videosForm",
      title: "Videos",
      type: "item",
      icon: <Icon.Video size={12} />,
      permissions: ["admin", "editor"],
      navLink: "/videos/list",
    },
    //!--------------Pages-------
    {
      id: "pages",
      title: "Pages",
      type: "item",
      icon: <Icon.Paperclip size={12} />,
      permissions: ["admin", "editor"],
      navLink: "/pages",
    },
    {
      id: "staticPages",
      title: "Static Pages",
      type: "collapse",
      icon: <Icon.Anchor size={15} />,
      children: [
        {
          id: "about-us",
          title: "About Us",
          type: "item",
          icon: <Icon.Circle size={12} />,
          permissions: ["admin", "editor"],
          navLink: "/about-us/form",
        },
        {
          id: "mission",
          title: "Mission",
          type: "item",
          icon: <Icon.Clipboard size={12} />,
          permissions: ["admin", "editor"],
          navLink: "/mission/form",
        },
        {
          id: "pigeonLogo",
          title: "Pigeon Logo",
          type: "item",
          icon: <Icon.PlayCircle size={12} />,
          permissions: ["admin", "editor"],
          navLink: "/pigeon-logo/form",
        },
        {
          id: "topMessage",
          title: "Top Message",
          type: "item",
          icon: <Icon.PlayCircle size={12} />,
          permissions: ["admin", "editor"],
          navLink: "/top-message/form",
        },
      ],
    },
  //!-------Mother and baby world-----------
  {
    id: "motherBabyWorld",
    title: "Mother & Baby World",
    type: "collapse",
    icon: <Icon.Activity size={15} />,
    children: [
      {
        id: "questionAndAnswersForm",
        title: "FAQ",
        type: "item",
        icon: <Icon.HelpCircle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/faqs/form",
      },
      {
        id: "babyCare",
        title: "Baby Care",
        type: "item",
        icon: <Icon.Book size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/babycare/form",
      },
      {
        id: "firstTimeFather",
        title: "First Time Father",
        type: "item",
        icon: <Icon.Dribbble size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/first-time-father/form",
      },
      //!----------------Moms and Moms-------
      {
        id: "MomsAndMoms",
        title: "Moms & Moms",
        type: "collapse",
        icon: <Icon.Heart size={12} />,
        children: [
          {
            id: "pregnancy",
            title: "Pregnancy",
            type: "item",
            icon: <Icon.Bell size={12} />,
            permissions: ["admin", "editor"],
            navLink: "/pregnancy/form",
          },
          {
            id: "postPregnancyForm",
            title: "Post Pregnancy Form",
            type: "item",
            icon: <Icon.LifeBuoy size={12} />,
            permissions: ["admin", "editor"],
            navLink: "/post-pregnancy/form",
          },
        ],
      },
    ],
  },

  //!-------------Good To know-----------
  {
    id: "goodToKnow",
    title: "Good To Know",
    type: "item",
    icon: <Icon.Aperture size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/good-to-know/list",
  },
  //!-------------Good To know-----------
  {
    id: "goodToKnowSort",
    title: "Good To Know Sorting",
    type: "item",
    icon: <Icon.Aperture size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/good-to-know-sort/list",
  },
  //!--------------BreastFeedingAdvisor--------
  {
    id: "breastFeedingAdvisor",
    title: "Breast Feeding Advisor",
    type: "collapse",
    icon: <Icon.Anchor size={15} />,
    children: [
      {
        id: "breastFeedingCategories",
        title: "Categories",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/breast-feeding-advisor/list",
      },
      {
        id: "breastFeedingCategoriesSort",
        title: "Categories Sort",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/breast-feeding-advisor-sort/list",
      },
      {
        id: "articleForm",
        title: "Articles",
        type: "item",
        icon: <Icon.Clipboard size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/article/list",
      },
      {
        id: "articleSortForm",
        title: "Articles Sort",
        type: "item",
        icon: <Icon.Clipboard size={12} />,
        permissions: ["admin", "editor"],
        navLink: "/article-sort/list",
      },
    ],
  },


  //!---------------Users------
  {
    id: "users",
    title: "Registered Users",
    type: "item",
    icon: <Icon.User size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/users-list",
  },

  //!---------------Reviews------
  {
    id: "reviews",
    title: "Reviews",
    type: "item",
    icon: <Icon.Star size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/reviews",
  },
    //!---------------Header------
    {
      id: "header",
      title: "Header",
      type: "item",
      icon: <Icon.Flag size={12} />,
      permissions: ["admin", "editor"],
      navLink: "/header",
    },
    //!---------------Footer------
    {
      id: "footer",
      title: "Footer",
      type: "item",
      icon: <Icon.CheckSquare size={12} />,
      permissions: ["admin", "editor"],
      navLink: "/footer",
    },
  //!---------------Contact List------
  {
    id: "contact",
    title: "Contact Us",
    type: "item",
    icon: <Icon.User size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/contact-list",
  },
  //!----------Office Info-----------
  {
    id: "officeInfo",
    title: "Office Info",
    type: "item",
    icon: <Icon.User size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/office-info",
  },
  //!-------------Gallery--------
  {
    id: "gallery",
    title: "Gallery",
    type: "item",
    icon: <Icon.Image size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/gallery",
  },
  //!-------------Categories Sort--------
  {
    id: "categories_sort",
    title: "Categories Sort",
    type: "item",
    icon: <Icon.List size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/categories-sort",
  },
  //!-------------Products Sort--------
  {
    id: "products_sort",
    title: "Products Sort",
    type: "item",
    icon: <Icon.List size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/products-sort",
  },
  //!------------Static Pages--------

];

export default navigationConfig;
