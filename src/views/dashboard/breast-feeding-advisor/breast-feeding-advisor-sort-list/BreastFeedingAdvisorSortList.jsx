// import React from "react";
// import "./BreastFeedingAdvisorSortList.scss";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Input,
//   Button,
// } from "reactstrap";
// import DataTable from "react-data-table-component";
// import { Search } from "react-feather";
// import { MdDelete, MdEdit } from "react-icons/md";
// import { FaEye } from "react-icons/fa";
// import { API } from "../../../../http/API";

// const CustomHeader = (props) => {
//   return (
//     <div className="d-flex flex-wrap justify-content-between">
//       <div className="add-new">
//         <Button.Ripple
//           color="primary"
//           onClick={() => props.history.push("/breast-feeding-advisor/form")}
//         >
//           Add New
//         </Button.Ripple>
//       </div>
//       <div className="position-relative has-icon-left mb-1">
//         <Input value={props.value} onChange={(e) => props.handleFilter(e)} />
//         <div className="form-control-position">
//           <Search size="15" />
//         </div>
//       </div>
//     </div>
//   );
// };

// class BreastFeedingAdvisorList extends React.Component {
//   state = {
//     columns: [
//       {
//         name: "Name",
//         selector: "name",
//         sortable: true,
//         minWidth: "200px",
//         cell: (row) => (
//           <div className="d-flex flex-xl-row flex-column align-items-xl-center align-items-start py-xl-0 py-1">
//             <div className="user-img ml-xl-0 ml-2">
//               {row.featured_img?.startsWith("http") ? (
//                 <img
//                   className="img-fluid rounded-circle"
//                   height="36"
//                   width="36"
//                   src={row.featured_img}
//                   alt={row.featured_img}
//                 />
//               ) : null}
//             </div>
//             <div className="user-info text-truncate ml-xl-50 ml-0">
//               <span
//                 title={row.title}
//                 className="d-block text-bold-500 text-truncate mb-0"
//               >
//                 {row.title}
//               </span>
//             </div>
//           </div>
//         ),
//       },

//       {
//         name: "Description",
//         selector: "content",
//         sortable: true,
//         cell: (row) => <p className="text-bold-500 mb-0">{row.content}</p>,
//       },

//       {
//         name: "Actions",
//         selector: "route",
//         sortable: true,
//         cell: (row) => (
//           <p className="text-bold-500 mb-0">
//             {/* <FaEye size={20} className="action-icon-details" /> */}
//             <MdEdit
//               size={20}
//               style={{
//                 color: "#e65550 ",
//               }}
//               onClick={() =>
//                 this.props.history.push(
//                   `/breast-feeding-advisor/form/${encodeURI(row.route)}`
//                 )
//               }
//               className="action-icon-edit"
//             />
//             <MdDelete
//               size={20}
//               className="action-icon-delete"
//               onClick={() => {
//                 if (window.confirm("Are you sure to delete this item?")) {
//                   this.handleDelete(row.route);
//                 }
//               }}
//             />
//           </p>
//         ),
//       },
//     ],

//     data: [],
//     filteredData: [],
//     value: "",
//   };
//   componentDidMount() {
//     this.getArticleCategories();
//   }

//   getArticleCategories = () => {
    // API.get("/article_category")
    //   .then((response) => {
    //     // console.log("Article Categoies response", response.data);
    //     this.setState({ data: response.data });
    //   })
    //   .catch();
//   };

//   handleDelete = (id) => {
//     API.delete(`/article_category/${id}`)
//       .then((response) => {
//         // alert("Category deleted successfully");
//         this.getArticleCategories();
//       })
//       .catch((err) => console.log(err));
//   };

//   handleFilter = (e) => {
//     let value = e.target.value;
//     let data = this.state.data;
//     let filteredData = this.state.filteredData;
//     this.setState({ value });

//     if (value.length) {
//       filteredData = data.filter((item) => {
//         let startsWithCondition =
//           item.title?.toLowerCase().startsWith(value?.toLowerCase()) ||
//           item.date?.toLowerCase().startsWith(value?.toLowerCase()) ||
//           item.size?.toLowerCase().startsWith(value?.toLowerCase()) ||
//           item.short_description
//             ?.toLowerCase()
//             .startsWith(value?.toLowerCase()) ||
//           item.long_description
//             ?.toLowerCase()
//             .startsWith(value?.toLowerCase()) ||
//           item.category?.toLowerCase().startsWith(value?.toLowerCase()) ||
//           item.material?.toLowerCase().startsWith(value?.toLowerCase());
//         let includesCondition =
//           item.title?.toLowerCase().includes(value?.toLowerCase()) ||
//           item.date?.toLowerCase().includes(value?.toLowerCase()) ||
//           item.size?.toLowerCase().startsWith(value?.toLowerCase()) ||
//           item.short_description
//             ?.toLowerCase()
//             .startsWith(value?.toLowerCase()) ||
//           item.long_description
//             ?.toLowerCase()
//             .startsWith(value?.toLowerCase()) ||
//           item.category?.toLowerCase().startsWith(value?.toLowerCase()) ||
//           item.material?.toLowerCase().includes(value?.toLowerCase());

//         if (startsWithCondition) {
//           return startsWithCondition;
//         } else if (!startsWithCondition && includesCondition) {
//           return includesCondition;
//         } else return null;
//       });
//       this.setState({ filteredData });
//     }
//   };

//   render() {
//     let { data, columns, value, filteredData } = this.state;
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Breast Feeding Advisor List</CardTitle>
//         </CardHeader>
//         <CardBody className="rdt_Wrapper">
//           <DataTable
//             className="dataTable-custom"
//             data={value.length ? filteredData : data}
//             columns={columns}
//             noHeader
//             pagination
//             subHeader
//             subHeaderComponent={
//               <CustomHeader
//                 value={value}
//                 handleFilter={this.handleFilter}
//                 {...this.props}
//               />
//             }
//           />
//         </CardBody>
//       </Card>
//     );
//   }
// }

// export default BreastFeedingAdvisorList;

import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Button,
} from "reactstrap";
import { API } from "../../../../http/API";
import "./BreastFeedingAdvisorSortList.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderBottom: '1px solid #0000001f',
    background: isDragging ? "#cfcfcf" : "#fff",
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "" : "#fff",
    padding: grid,
    width: '100%'
});

class BreastFeedingAdvisorSortList extends React.Component {
    state = {
        items: []
    };
    //!------Handle Api---------
    handleGetApi = () => {
        // API.get("/products")
        //     .then((response) => {
        //         this.setState({ items: response.data.data.sort((a,b) => a.currentIndex - b.currentIndex) });
        //     })
        //     .catch((err) => console.log(err));
        
        API.get("/article_category")
        .then((response) => {
            // console.log("Article Categoies response", response.data);
            this.setState({ items: response.data.sort((a,b) => a.currentIndex - b.currentIndex) });
        })
        .catch();
    };
    //!-------Handle Delete------
    componentDidMount() {
        this.handleGetApi();
    }

    onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({ items });
    }

    handleProductSort = () => {

        this.state.items.forEach((element, index) => {
            this.state.items[index].currentIndex = index + 1
        })

        let data = {
            article_category_data: this.state?.items
        }

        // console.log(data.product_data);return false;

        API.post("/article-category-indexing", data)
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    alert("Products Sorting successfully");
                }
            })
            .catch((err) => {
                alert("Something went wrong.");
                console.log(err);
            });
    }


    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Breast Feeding Advisor Sorting</CardTitle>
                </CardHeader>
                <CardBody className="rdt_Wrapper">

                    <div className="d-flex flex-wrap" style={{ justifyContent: 'flex-end' }}>
                        <div className="add-new">
                            <Button.Ripple
                                color="primary"
                                onClick={this.handleProductSort}
                            >
                                Update Sorting
                            </Button.Ripple>
                        </div>
                    </div>

                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <table {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #0000001f', height: '75px' }}>
                                            <th>Featured Image</th>
                                            <th>Name</th>
                                            <th>Article Categories</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.items.map((item, index) => (
                                            <Draggable key={item._id} draggableId={item._id} index={index}>
                                                {(provided, snapshot) => (
                                                    <tr ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <td>
                                                            <img
                                                                className="img-fluid"
                                                                src={item?.featured_img}
                                                                alt={""}
                                                                width="75px"
                                                            />
                                                        </td>
                                                        <td style={{ color: 'rgba(0,0,0,0.87)' }}>{item?.title}</td>
                                                        <td style={{ color: 'rgba(0,0,0,0.87)', width:"50%"}}>{item.content}</td>
                                                    </tr>

                                                )}
                                            </Draggable>
                                        ))}
                                    </tbody>
                                    {provided.placeholder}
                                </table>
                            )}
                        </Droppable>
                    </DragDropContext>

                </CardBody>
            </Card >
        );
    }
}

export default BreastFeedingAdvisorSortList;
