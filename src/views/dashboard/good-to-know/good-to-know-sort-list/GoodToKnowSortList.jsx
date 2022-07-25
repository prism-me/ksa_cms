
import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Button,
} from "reactstrap";
import { API } from "../../../../http/API";
import "./GoodToKnowSortList.scss";
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

class GoodToKnowSortList extends React.Component {
    state = {
        items: []
    };
    //!------Handle Api---------
    handleGetApi = () => {

        API.get("/good_to_know")
        .then((response) => {
            this.setState({ items: response.data.sort((a,b) => a?.currentIndex - b?.currentIndex) });
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
            good_to_know: this.state?.items
        }

        API.post("/good-to-know-indexing", data)
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
                                        {this.state?.items?.map((item, index) => (
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
                                                        <td style={{ color: 'rgba(0,0,0,0.87)', width:"50%"}}>{item?.categories?.title}</td>
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

export default GoodToKnowSortList;

