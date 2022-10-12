import React, { Suspense, lazy } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import knowledgeBaseCategory from "./views/pages/knowledge-base/Category";
import knowledgeBaseQuestion from "./views/pages/knowledge-base/Questions";
import { ContextLayout } from "./utility/context/Layout";

// Route-based code splitting
const analyticsDashboard = lazy(() =>
  import("./views/dashboard/analytics/AnalyticsDashboard")
);
const ecommerceDashboard = lazy(() =>
  import("./views/dashboard/ecommerce/EcommerceDashboard")
);
//!----------------------------Route Start-------------------------------
const productForm = lazy(() =>
  import("./views/dashboard/products/products-form")
);
const productsList = lazy(() =>
  import("./views/dashboard/products/products-list")
);
const productsDetail = lazy(() =>
  import("./views/dashboard/products/products-detail")
);
const categoryList = lazy(() =>
  import("./views/dashboard/category/category-list/CategoryList")
);
const categoryForm = lazy(() =>
  import("./views/dashboard/category/category-form/CategoryForm")
);
const subCategoryList = lazy(() =>
  import("./views/dashboard/category/sub-category-list/SubCategoryList")
);
const subCategoryForm = lazy(() =>
  import("./views/dashboard/category/sub-category-form")
);
const faqs = lazy(() => import("./views/dashboard/faq"));
const pregnancyForm = lazy(() =>
  import("./views/dashboard/pregnancy/pregnancy-form")
);
const babyCareForm = lazy(() =>
  import("./views/dashboard/baby-care/baby-care-form/BabyCareForm")
);
const postPregnancyForm = lazy(() =>
  import("./views/dashboard/pregnancy/post-pregnancy-form")
);
const goodToKnowList = lazy(() =>
  import("./views/dashboard/good-to-know/good-to-know-list/GoodToKnowList")
);
const goodToKnowSortList = lazy(() =>
  import(
    "./views/dashboard/good-to-know/good-to-know-sort-list/GoodToKnowSortList"
  )
);
const goodToKnowForm = lazy(() =>
  import("./views/dashboard/good-to-know/good-to-know-form")
);
const firstTimeFatherList = lazy(() =>
  import(
    "./views/dashboard/first-time-father/first-time-father-list/FirstTimeFatherList"
  )
);
const firstTimeFatherForm = lazy(() =>
  import("./views/dashboard/first-time-father/index")
);
const breastFeedingAdvisorList = lazy(() =>
  import(
    "./views/dashboard/breast-feeding-advisor/breast-feeding-advisor-list/BreastFeedingAdvisorList"
  )
);
const breastFeedingAdvisorSortList = lazy(() =>
  import(
    "./views/dashboard/breast-feeding-advisor/breast-feeding-advisor-sort-list/BreastFeedingAdvisorSortList"
  )
);
const breastFeedingAdvisorForm = lazy(() =>
  import("./views/dashboard/breast-feeding-advisor/index")
);
const blogGridList = lazy(() =>
  import("./views/dashboard/blog/blog-grid-list")
);
const blogGridForm = lazy(() =>
  import("./views/dashboard/blog/blog-grid-from")
);
const articleList = lazy(() =>
  import("./views/dashboard/article-form/article-list/ArticleList")
);
const articleSortList = lazy(() =>
  import("./views/dashboard/article-form/article-sort-list/ArticleSortList")
);
const articleForm = lazy(() => import("./views/dashboard/article-form/index"));
const blogItemsList = lazy(() =>
  import("./views/dashboard/blog/blog-item-list")
);
const blogItemsForm = lazy(() =>
  import("./views/dashboard/article-form/index")
);
const gallery = lazy(() => import("./views/dashboard/gallery"));
const videosList = lazy(() => import("./views/dashboard/videos/videos-list"));
const videoForm = lazy(() => import("./views/dashboard/videos/videos-form"));
const pagesForm = lazy(() => import("./views/dashboard/pages/pages-form"));
const pagesList = lazy(() => import("./views/dashboard/pages/pages-list"));
const headerForm = lazy(() => import("./views/dashboard/header/Header"));
const footerForm = lazy(() => import("./views/dashboard/footer/Footer"));
const categoriesSort = lazy(() =>
  import("./views/dashboard/categories-sort/CategoriesSort")
);
const productsSort = lazy(() =>
  import("./views/dashboard/products-sort/ProductsSort")
);
const usersList = lazy(() =>
  import("./views/dashboard/users/users-list/UserList")
);
const reviewsList = lazy(() =>
  import("./views/dashboard/reviews-list/ReviewsList")
);
const contactList = lazy(() =>
  import("./views/dashboard/contact-us/ContactList")
);
const userProfile = lazy(() => import("./views/dashboard/user-profile"));
const aboutUs = lazy(() => import("./views/dashboard/static-pages/about-us"));
const missionFrom = lazy(() =>
  import("./views/dashboard/static-pages/mission-and-vision/Mission")
);
const pigeonLogo = lazy(() =>
  import("./views/dashboard/static-pages/pigeon-logo")
);
const topMessage = lazy(() =>
  import("./views/dashboard/static-pages/top-message")
);
const homeForm = lazy(() => import("./views/dashboard/home-form"));
const officeInfo = lazy(() =>
  import("./views/dashboard/contact-us/office-info")
);
//????// const articleForm = lazy(() => import("./views/article/article-form")); //Not using
//!----------------------Route End----------------------
const email = lazy(() => import("./views/apps/email/Email"));
const chat = lazy(() => import("./views/apps/chat/Chat"));
const todo = lazy(() => import("./views/apps/todo/Todo"));
const calendar = lazy(() => import("./views/apps/calendar/Calendar"));
const shop = lazy(() => import("./views/apps/ecommerce/shop/Shop"));
const wishlist = lazy(() => import("./views/apps/ecommerce/wishlist/Wishlist"));
const checkout = lazy(() => import("./views/apps/ecommerce/cart/Cart"));
const productDetail = lazy(() =>
  import("./views/apps/ecommerce/detail/Detail")
);
const grid = lazy(() => import("./views/ui-elements/grid/Grid"));
const typography = lazy(() =>
  import("./views/ui-elements/typography/Typography")
);
const textutilities = lazy(() =>
  import("./views/ui-elements/text-utilities/TextUtilities")
);
const syntaxhighlighter = lazy(() =>
  import("./views/ui-elements/syntax-highlighter/SyntaxHighlighter")
);
const colors = lazy(() => import("./views/ui-elements/colors/Colors"));
const reactfeather = lazy(() =>
  import("./views/ui-elements/icons/FeatherIcons")
);
const basicCards = lazy(() => import("./views/ui-elements/cards/basic/Cards"));
const statisticsCards = lazy(() =>
  import("./views/ui-elements/cards/statistics/StatisticsCards")
);
const analyticsCards = lazy(() =>
  import("./views/ui-elements/cards/analytics/Analytics")
);
const actionCards = lazy(() =>
  import("./views/ui-elements/cards/actions/CardActions")
);
const Alerts = lazy(() => import("./components/reactstrap/alerts/Alerts"));
const Buttons = lazy(() => import("./components/reactstrap/buttons/Buttons"));
const Breadcrumbs = lazy(() =>
  import("./components/reactstrap/breadcrumbs/Breadcrumbs")
);
const Carousel = lazy(() =>
  import("./components/reactstrap/carousel/Carousel")
);
const Collapse = lazy(() =>
  import("./components/reactstrap/collapse/Collapse")
);
const Dropdowns = lazy(() =>
  import("./components/reactstrap/dropdowns/Dropdown")
);
const ListGroup = lazy(() =>
  import("./components/reactstrap/listGroup/ListGroup")
);
const Modals = lazy(() => import("./components/reactstrap/modal/Modal"));
const Pagination = lazy(() =>
  import("./components/reactstrap/pagination/Pagination")
);
const NavComponent = lazy(() =>
  import("./components/reactstrap/navComponent/NavComponent")
);
const Navbar = lazy(() => import("./components/reactstrap/navbar/Navbar"));
const Tabs = lazy(() => import("./components/reactstrap/tabs/Tabs"));
const TabPills = lazy(() =>
  import("./components/reactstrap/tabPills/TabPills")
);
const Tooltips = lazy(() =>
  import("./components/reactstrap/tooltips/Tooltips")
);
const Popovers = lazy(() =>
  import("./components/reactstrap/popovers/Popovers")
);
const Badge = lazy(() => import("./components/reactstrap/badge/Badge"));
const BadgePill = lazy(() =>
  import("./components/reactstrap/badgePills/BadgePill")
);
const Progress = lazy(() =>
  import("./components/reactstrap/progress/Progress")
);
const Media = lazy(() => import("./components/reactstrap/media/MediaObject"));
const Spinners = lazy(() =>
  import("./components/reactstrap/spinners/Spinners")
);
const Toasts = lazy(() => import("./components/reactstrap/toasts/Toasts"));
const avatar = lazy(() => import("./components/@vuexy/avatar/Avatar"));
const AutoComplete = lazy(() =>
  import("./components/@vuexy/autoComplete/AutoComplete")
);
const chips = lazy(() => import("./components/@vuexy/chips/Chips"));
const divider = lazy(() => import("./components/@vuexy/divider/Divider"));
const vuexyWizard = lazy(() => import("./components/@vuexy/wizard/Wizard"));
const listView = lazy(() => import("./views/ui-elements/data-list/ListView"));
const thumbView = lazy(() => import("./views/ui-elements/data-list/ThumbView"));
const select = lazy(() => import("./views/forms/form-elements/select/Select"));
const switchComponent = lazy(() =>
  import("./views/forms/form-elements/switch/Switch")
);
const checkbox = lazy(() =>
  import("./views/forms/form-elements/checkboxes/Checkboxes")
);
const radio = lazy(() => import("./views/forms/form-elements/radio/Radio"));
const input = lazy(() => import("./views/forms/form-elements/input/Input"));
const group = lazy(() =>
  import("./views/forms/form-elements/input-groups/InputGoups")
);
const numberInput = lazy(() =>
  import("./views/forms/form-elements/number-input/NumberInput")
);
const textarea = lazy(() =>
  import("./views/forms/form-elements/textarea/Textarea")
);
const pickers = lazy(() =>
  import("./views/forms/form-elements/datepicker/Pickers")
);
const inputMask = lazy(() =>
  import("./views/forms/form-elements/input-mask/InputMask")
);
const layout = lazy(() => import("./views/forms/form-layouts/FormLayouts"));
const formik = lazy(() => import("./views/forms/formik/Formik"));
const tables = lazy(() => import("./views/tables/reactstrap/Tables"));
const ReactTables = lazy(() =>
  import("./views/tables/react-tables/ReactTables")
);
const Aggrid = lazy(() => import("./views/tables/aggrid/Aggrid"));
const DataTable = lazy(() => import("./views/tables/data-tables/DataTables"));
const profile = lazy(() => import("./views/pages/profile/Profile"));
// const faq = lazy(() => import("./views/pages/faq/FAQ"));
const knowledgeBase = lazy(() =>
  import("./views/pages/knowledge-base/KnowledgeBase")
);
const search = lazy(() => import("./views/pages/search/Search"));
const accountSettings = lazy(() =>
  import("./views/pages/account-settings/AccountSettings")
);
const invoice = lazy(() => import("./views/pages/invoice/Invoice"));
const comingSoon = lazy(() => import("./views/pages/misc/ComingSoon"));
const error404 = lazy(() => import("./views/pages/misc/error/404"));
const error500 = lazy(() => import("./views/pages/misc/error/500"));
const authorized = lazy(() => import("./views/pages/misc/NotAuthorized"));
const maintenance = lazy(() => import("./views/pages/misc/Maintenance"));
const apex = lazy(() => import("./views/charts/apex/ApexCharts"));
const chartjs = lazy(() => import("./views/charts/chart-js/ChartJS"));
const extreme = lazy(() => import("./views/charts/recharts/Recharts"));
const leafletMaps = lazy(() => import("./views/maps/Maps"));
const toastr = lazy(() => import("./extensions/toastify/Toastify"));
const sweetAlert = lazy(() => import("./extensions/sweet-alert/SweetAlert"));
const rcSlider = lazy(() => import("./extensions/rc-slider/Slider"));
const uploader = lazy(() => import("./extensions/dropzone/Dropzone"));
const editor = lazy(() => import("./extensions/editor/Editor"));
const drop = lazy(() => import("./extensions/drag-and-drop/DragAndDrop"));
const tour = lazy(() => import("./extensions/tour/Tour"));
const clipboard = lazy(() =>
  import("./extensions/copy-to-clipboard/CopyToClipboard")
);
const menu = lazy(() => import("./extensions/contexify/Contexify"));
const swiper = lazy(() => import("./extensions/swiper/Swiper"));
const i18n = lazy(() => import("./extensions/i18n/I18n"));
const reactPaginate = lazy(() => import("./extensions/pagination/Pagination"));
const tree = lazy(() => import("./extensions/treeview/TreeView"));
const Import = lazy(() => import("./extensions/import-export/Import"));
const Export = lazy(() => import("./extensions/import-export/Export"));
const ExportSelected = lazy(() =>
  import("./extensions/import-export/ExportSelected")
);
const userList = lazy(() => import("./views/apps/user/list/List"));
const userEdit = lazy(() => import("./views/apps/user/edit/Edit"));
const userView = lazy(() => import("./views/apps/user/view/View"));
const Login = lazy(() => import("./views/pages/authentication/login/Login"));
const forgotPassword = lazy(() =>
  import("./views/pages/authentication/ForgotPassword")
);
const lockScreen = lazy(() =>
  import("./views/pages/authentication/LockScreen")
);
const resetPassword = lazy(() =>
  import("./views/pages/authentication/ResetPassword")
);
const register = lazy(() =>
  import("./views/pages/authentication/register/Register")
);
const accessControl = lazy(() =>
  import("./extensions/access-control/AccessControl")
);
// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout;
            return (
              <LayoutTag {...props} permission={props.user?.userRole}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);
class AppRouter extends React.Component {
  render() {
    console.log("APP route props: ", this.props?.user);
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        {!this.props.user?.isAuthenticated ? (
          <Switch>
            <AppRoute path="/page/login" component={Login} fullLayout />
            <AppRoute path="/pages/register" component={register} fullLayout />
            <Redirect to="/page/login" />
          </Switch>
        ) : (
          <Switch>
            <AppRoute exact path="/" component={analyticsDashboard} />
            <AppRoute
              path="/ecommerce-dashboard"
              component={ecommerceDashboard}
            />
            {/* //!-----------------------Routes-------------------------- */}
            <AppRoute path="/products/form" component={productForm} />
            <AppRoute path="/products/edit/:id" component={productForm} />
            <AppRoute path="/products/list" component={productsList} />
            <AppRoute path="/products/detail:id" component={productsDetail} />
            <AppRoute path="/category/list" component={categoryList} />
            <AppRoute path="/category/form" component={categoryForm} />
            <AppRoute path="/category/edit/:id" component={categoryForm} />
            <AppRoute path="/sub-category/form" component={subCategoryForm} />
            <AppRoute path="/sub-category/list" component={subCategoryList} />
            <AppRoute
              path="/sub-category/edit/:id"
              component={subCategoryForm}
            />
            <AppRoute path="/article/form/:id" component={articleForm} />
            <AppRoute path="/article/form" component={articleForm} />
            <AppRoute path="/article/list" component={articleList} />
            <AppRoute path="/article-sort/list" component={articleSortList} />
            <AppRoute path="/blog-item/form/:id" component={blogItemsForm} />
            <AppRoute path="/blog-item/form" component={blogItemsForm} />
            <AppRoute path="/blog-item/list" component={blogItemsList} />
            <AppRoute path="/gallery" component={gallery} />
            <AppRoute path="/faqs/form" component={faqs} />
            <AppRoute path="/pregnancy/form" component={pregnancyForm} />
            <AppRoute path="/babycare/form" component={babyCareForm} />
            <AppRoute
              path="/post-pregnancy/form"
              component={postPregnancyForm}
            />
            <AppRoute
              path="/good-to-know/form/:id"
              component={goodToKnowForm}
            />
            <AppRoute path="/good-to-know/form" component={goodToKnowForm} />
            <AppRoute path="/good-to-know/list" component={goodToKnowList} />
            <AppRoute
              path="/good-to-know-sort/list"
              component={goodToKnowSortList}
            />
            <AppRoute
              path="/first-time-father/form"
              component={firstTimeFatherForm}
            />
            <AppRoute
              path="/first-time-father/list"
              component={firstTimeFatherList}
            />
            <AppRoute path="/video/form/edit/:id" component={videoForm} />
            <AppRoute path="/video/form" component={videoForm} />
            <AppRoute path="/videos/list" component={videosList} />
            <AppRoute
              path="/breast-feeding-advisor/form/:id"
              component={breastFeedingAdvisorForm}
            />
            <AppRoute
              path="/breast-feeding-advisor/form"
              component={breastFeedingAdvisorForm}
            />
            <AppRoute
              path="/breast-feeding-advisor/list"
              component={breastFeedingAdvisorList}
            />
            <AppRoute
              path="/breast-feeding-advisor-sort/list"
              component={breastFeedingAdvisorSortList}
            />
            <AppRoute path="/blog/form/:id" component={blogGridForm} />
            <AppRoute path="/blog/form" component={blogGridForm} />
            <AppRoute path="/blog" component={blogGridList} />
            <AppRoute path="/pages/form/edit/:id" component={pagesForm} />
            <AppRoute path="/pages/form" component={pagesForm} />
            <AppRoute path="/pages" component={pagesList} />
            <AppRoute path="/header" component={headerForm} />
            <AppRoute path="/footer" component={footerForm} />
            <AppRoute path="/categories-sort" component={categoriesSort} />
            <AppRoute path="/products-sort" component={productsSort} />
            <AppRoute path="/users-list" component={usersList} />
            <AppRoute path="/reviews" component={reviewsList} />
            <AppRoute path="/contact-list" component={contactList} />
            <AppRoute path="/user-profile" component={userProfile} />
            <AppRoute path="/about-us/form" component={aboutUs} />
            <AppRoute path="/mission/form" component={missionFrom} />
            <AppRoute path="/pigeon-logo/form" component={pigeonLogo} />
            <AppRoute path="/top-message/form" component={topMessage} />
            <AppRoute path="/home-page" component={homeForm} />
            <AppRoute path="/office-info" component={officeInfo} />
            {/* //!------------------------------------------------------ */}
            <AppRoute
              path="/email"
              exact
              component={() => <Redirect to="/email/inbox" />}
            />
            <AppRoute path="/email/:filter" component={email} />
            <AppRoute path="/chat" component={chat} />
            <AppRoute
              path="/todo"
              exact
              component={() => <Redirect to="/todo/all" />}
            />
            <AppRoute path="/todo/:filter" component={todo} />
            <AppRoute path="/calendar" component={calendar} />
            <AppRoute path="/ecommerce/shop" component={shop} />
            <AppRoute path="/ecommerce/wishlist" component={wishlist} />
            <AppRoute
              path="/ecommerce/product-detail"
              component={productDetail}
            />
            <AppRoute
              path="/ecommerce/checkout"
              component={checkout}
              permission="admin"
            />
            <AppRoute path="/data-list/list-view" component={listView} />
            <AppRoute path="/data-list/thumb-view" component={thumbView} />
            <AppRoute path="/ui-element/grid" component={grid} />
            <AppRoute path="/ui-element/typography" component={typography} />
            <AppRoute
              path="/ui-element/textutilities"
              component={textutilities}
            />
            <AppRoute
              path="/ui-element/syntaxhighlighter"
              component={syntaxhighlighter}
            />
            <AppRoute path="/colors/colors" component={colors} />
            <AppRoute path="/icons/reactfeather" component={reactfeather} />
            <AppRoute path="/cards/basic" component={basicCards} />
            <AppRoute path="/cards/statistics" component={statisticsCards} />
            <AppRoute path="/cards/analytics" component={analyticsCards} />
            <AppRoute path="/cards/action" component={actionCards} />
            <AppRoute path="/components/alerts" component={Alerts} />
            <AppRoute path="/components/buttons" component={Buttons} />
            <AppRoute path="/components/breadcrumbs" component={Breadcrumbs} />
            <AppRoute path="/components/carousel" component={Carousel} />
            <AppRoute path="/components/collapse" component={Collapse} />
            <AppRoute path="/components/dropdowns" component={Dropdowns} />
            <AppRoute path="/components/list-group" component={ListGroup} />
            <AppRoute path="/components/modals" component={Modals} />
            <AppRoute path="/components/pagination" component={Pagination} />
            <AppRoute
              path="/components/nav-component"
              component={NavComponent}
            />
            <AppRoute path="/components/navbar" component={Navbar} />
            <AppRoute path="/components/tabs-component" component={Tabs} />
            <AppRoute path="/components/pills-component" component={TabPills} />
            <AppRoute path="/components/tooltips" component={Tooltips} />
            <AppRoute path="/components/popovers" component={Popovers} />
            <AppRoute path="/components/badges" component={Badge} />
            <AppRoute path="/components/pill-badges" component={BadgePill} />
            <AppRoute path="/components/progress" component={Progress} />
            <AppRoute path="/components/media-objects" component={Media} />
            <AppRoute path="/components/spinners" component={Spinners} />
            <AppRoute path="/components/toasts" component={Toasts} />
            <AppRoute
              path="/extra-components/auto-complete"
              component={AutoComplete}
            />
            <AppRoute path="/extra-components/avatar" component={avatar} />
            <AppRoute path="/extra-components/chips" component={chips} />
            <AppRoute path="/extra-components/divider" component={divider} />
            <AppRoute path="/forms/wizard" component={vuexyWizard} />
            <AppRoute path="/forms/elements/select" component={select} />
            <AppRoute
              path="/forms/elements/switch"
              component={switchComponent}
            />
            <AppRoute path="/forms/elements/checkbox" component={checkbox} />
            <AppRoute path="/forms/elements/radio" component={radio} />
            <AppRoute path="/forms/elements/input" component={input} />
            <AppRoute path="/forms/elements/input-group" component={group} />
            <AppRoute
              path="/forms/elements/number-input"
              component={numberInput}
            />
            <AppRoute path="/forms/elements/textarea" component={textarea} />
            <AppRoute path="/forms/elements/pickers" component={pickers} />
            <AppRoute path="/forms/elements/input-mask" component={inputMask} />
            <AppRoute path="/forms/layout/form-layout" component={layout} />
            <AppRoute path="/forms/formik" component={formik} />{" "}
            <AppRoute path="/tables/reactstrap" component={tables} />
            <AppRoute path="/tables/react-tables" component={ReactTables} />
            <AppRoute path="/tables/agGrid" component={Aggrid} />
            <AppRoute path="/tables/data-tables" component={DataTable} />
            <AppRoute path="/page/profile" component={profile} />
            {/* <AppRoute path="/pages/faq" component={faq} /> */}
            <AppRoute
              path="/pages/knowledge-base"
              component={knowledgeBase}
              exact
            />
            <AppRoute
              path="/pages/knowledge-base/category"
              component={knowledgeBaseCategory}
              exact
            />
            <AppRoute
              path="/pages/knowledge-base/category/questions"
              component={knowledgeBaseQuestion}
            />
            <AppRoute path="/pages/search" component={search} />
            <AppRoute
              path="/pages/account-settings"
              component={accountSettings}
            />
            <AppRoute path="/pages/invoice" component={invoice} />
            <AppRoute
              path="/misc/coming-soon"
              component={comingSoon}
              fullLayout
            />
            <AppRoute path="/misc/error/404" component={error404} fullLayout />
            <AppRoute path="/page/login" component={Login} fullLayout />
            <AppRoute path="/pages/register" component={register} fullLayout />
            <AppRoute
              path="/pages/forgot-password"
              component={forgotPassword}
              fullLayout
            />
            <AppRoute
              path="/pages/lock-screen"
              component={lockScreen}
              fullLayout
            />
            <AppRoute
              path="/pages/reset-password"
              component={resetPassword}
              fullLayout
            />
            <AppRoute path="/misc/error/500" component={error500} fullLayout />
            <AppRoute
              path="/misc/not-authorized"
              component={authorized}
              fullLayout
            />
            <AppRoute
              path="/misc/maintenance"
              component={maintenance}
              fullLayout
            />
            <AppRoute path="/app/user/list" component={userList} />
            <AppRoute path="/app/user/edit" component={userEdit} />
            <AppRoute path="/app/user/view" component={userView} />
            <AppRoute path="/charts/apex" component={apex} />
            <AppRoute path="/charts/chartjs" component={chartjs} />
            <AppRoute path="/charts/recharts" component={extreme} />
            <AppRoute path="/maps/leaflet" component={leafletMaps} />
            <AppRoute path="/extensions/sweet-alert" component={sweetAlert} />
            <AppRoute path="/extensions/toastr" component={toastr} />
            <AppRoute path="/extensions/slider" component={rcSlider} />
            <AppRoute path="/extensions/file-uploader" component={uploader} />
            <AppRoute path="/extensions/wysiwyg-editor" component={editor} />
            <AppRoute path="/extensions/drag-and-drop" component={drop} />
            <AppRoute path="/extensions/tour" component={tour} />
            <AppRoute path="/extensions/clipboard" component={clipboard} />
            <AppRoute path="/extensions/context-menu" component={menu} />
            <AppRoute path="/extensions/swiper" component={swiper} />
            <AppRoute
              path="/extensions/access-control"
              component={accessControl}
            />
            <AppRoute path="/extensions/i18n" component={i18n} />
            <AppRoute path="/extensions/tree" component={tree} />
            <AppRoute path="/extensions/import" component={Import} />
            <AppRoute path="/extensions/export" component={Export} />
            <AppRoute
              path="/extensions/export-selected"
              component={ExportSelected}
            />
            <AppRoute path="/extensions/pagination" component={reactPaginate} />
            <AppRoute component={error404} fullLayout />
          </Switch>
        )}
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.login,
  };
};
const AppRoute = connect(mapStateToProps)(RouteConfig);

export default connect(mapStateToProps)(AppRouter);
