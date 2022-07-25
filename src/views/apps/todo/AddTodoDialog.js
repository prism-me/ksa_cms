import React, { Fragment, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Image } from '@material-ui/icons';
import API from "../../../utils/http";
import { Grid, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

export default function AddTodoDialog(props) {
  const [todo_name, setTodoName] = React.useState("");
  const [todo_description, setTodoDescription] = React.useState("");
  const [is_read, setIsRead] = React.useState(false);

  const handleSubmit = () => {
    API.post(`/todo`, {
      todo_name,
      todo_description,
      is_read
    }).then(response => {
      if (response.status === 200) {
        alert(response.data?.message || "Success");
        props.success();
      }
    }).catch(err => alert("Something went wrong"));

  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Todo Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="todo_name"
                label="Task Name"
                type="text"
                fullWidth
                size="small"
                value={todo_name}
                onChange={(e) => setTodoName(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12}>

              <TextField
                id="todo_description"
                label="Description"
                type="text"
                fullWidth
                size="small"
                value={todo_description}
                onChange={(e) => setTodoDescription(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12}>

              <FormControl style={{ marginTop: '1rem' }} component="fieldset">
                <RadioGroup aria-label="is_read" row defaultChecked name="is_read" value={is_read} onChange={(e) => { setIsRead(!is_read) }}>
                  <FormControlLabel value={false} control={<Radio />} label="Pending" />
                  <FormControlLabel value={true} control={<Radio />} label={"Completed"} />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} variant="contained" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
