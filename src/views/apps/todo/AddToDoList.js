import React, { useEffect, useState } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
// import CardBody from "components/Card/CardBody.js";


// import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import API from "../../../utils/http";
import { Avatar, Checkbox, IconButton } from "@material-ui/core";
import { AddOutlined, Check, DeleteOutlined, PlaylistAddOutlined } from "@material-ui/icons";
import AddTodoDialog from "./AddTodoDialog";
import {Card} from "react-bootstrap";



// const useStyles = makeStyles(styles);

export default function AddToDoList() {
  // const classes = useStyles();

  const [todos, setTodos] = useState([]);
  const [showAddTodo, setShowAddTodo] = useState(false);


  useEffect(() => {
        API.get('/todo').then(response => {
          if (response?.status === 200) {
            setTodos(response.data)
          }
    })
  }, [])

  const getTodos = () => {
    API.get('/todo').then(response => {
      if (response?.status === 200) {
        setTodos(response.data)
      }
    })
  }

  const handleStatusChange = (e, index) => {
    let updatedTodo = todos[index];
    updatedTodo.is_read = e.target.checked;
    API.put(`/todo/${todos[index]._id}`, updatedTodo)
      .then(response => {
        if (response?.status === 200) {
          // alert("Updated")
        }
      })
      .then(() => {
        API.get('/todo').then(response => {
          if (response?.status === 200) {
            setTodos(response.data)
          }
        })
      })
      .catch(err => {
        alert("Something went wrong")
      })
  }

  const handleTaskDelete = (id) => {
    API.delete(`/todo/${id}`).then(response => {
      if (response.status === 200) {
        // alert("Task deleted successfully.");
        // this.setState({currentFiles: []})
      }
    }).then(() => {
      API.get('/todo').then(response => {
        if (response.status === 200) {
          setTodos(response.data)
        }
      })
    })
      .catch(err => alert("Something went wrong"));
  }

  return (
    <div>
          <Card>
            <Card.Header style={{background:"#ffc849",boxShadow: "-1px 5px 12px -3px rgba(102,108,95,0.8)"}}>
                <div>
                  <h4 className="mb-0 text-white">Todo List</h4>
                  <p className={"text-white"}>
                    List of all tasks and todos.
                  </p>
                </div>
                <div>
                  <IconButton color="default" style={{ color: '#fff',borderRadius:"100%"}} onClick={() => setShowAddTodo(true)}>
                    <AddOutlined />
                  </IconButton>
                </div>
            </Card.Header>
            <Card.Body style={{ height: '300px', overflowY: 'scroll' }}>
              <div className="d-flex align-items-center img-thumbnail mb-2" style={{ justifyContent: 'space-between' }}>
                <small style={{ width: '30%', marginBottom: 0, fontWeight: 500 }}>
                  Task
                    </small>
                <small style={{ width: '30%', marginBottom: 0, fontWeight: 500 }}>
                  Date
                    </small>
                <small style={{ width: '20%', marginBottom: 0, fontWeight: 500, textAlign: 'center' }}>
                  Status
                    </small>
                <small style={{ width: '10%', marginBottom: 0, fontWeight: 500, textAlign: 'center' }}>
                  Mark
                    </small>
                <small style={{ width: '10%', marginBottom: 0, fontWeight: 500, textAlign: 'center' }}>
                  Delete
                    </small>
              </div>
              {
                todos?.map((x, index) => (
                  <div className="d-flex align-items-center img-thumbnail mb-2" style={{ justifyContent: 'space-between' }}>
                    <p title={x.todo_description} style={{ width: '30%', marginBottom: 0 }}>
                      {x.todo_name}
                    </p>
                    <p style={{ width: '30%', marginBottom: 0 }}>
                      {new Date(x.updated_at).toLocaleDateString()}
                    </p>
                    <p style={{ width: '20%', marginBottom: 0, textAlign: 'center' }}>
                      {
                        x.is_read == 0 ?
                          <small className="badge badge-warning">pending</small>
                          :
                          <small className="badge badge-success">completed</small>
                      }
                    </p>
                    <p style={{ width: '10%', marginBottom: 0, textAlign: 'center' }}>
                      <Checkbox
                        checked={x.is_read == 0 ? false : true}
                        tabIndex={-1}
                        onChange={(e) => handleStatusChange(e, index)}
                        size="small"
                      />
                    </p>
                    <p style={{ width: '10%', marginBottom: 0, textAlign: 'center' }}>
                      <DeleteOutlined onClick={() => handleTaskDelete(x._id)} style={{ cursor: 'pointer' }} fontSize="small" color="secondary" />
                    </p>
                  </div>
                ))
              }
            </Card.Body>
          </Card>
      <AddTodoDialog success={() => { getTodos(); setShowAddTodo(false) }} onClose={() => setShowAddTodo(false)} open={showAddTodo} />
    </div>
  );
}
