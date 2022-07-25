import React, { Fragment, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Image } from '@material-ui/icons';
import { API } from "../../../http/API";
import "./Gallery.scss";
import { Grid, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

export default function UpdateGalleryDialog(props) {
    console.log(props)
    const [alt_tag, set_alt_tag] = React.useState("");


    const handleSubmit = () => {
        console.log("alt_tag :: ",alt_tag)
        // let imagesFormData = new FormData();
        // imagesFormData.append("images[]", avatar);
        // imagesFormData.append("id", id);
        // imagesFormData.append("data[]", JSON.stringify({
        //     alt_tag,
        //     is360
        // }));
        // // props.onClose();
        // // return;
        // API.post(`/upload_edit`, imagesFormData, {
        //     headers: {
        //         'Content-Type': `multipart/form-data; boundary=${imagesFormData._boundary}`,
        //     }
        // }).then(response => {
        //     if (response.status === 200) {
        //         alert("Image updated successfully.");
        //         // this.setState({currentFiles: []})
        //     }
        // }).catch(err => alert("Something went wrong"));

    }

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Gallery Image</DialogTitle>
                <DialogContent>
                    <form type="post" encType="multipart/form-data">
                        <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="alt_tag"
                                    label="Alternate Text"
                                    type="text"
                                    fullWidth
                                    size="small"
                                    value={alt_tag}
                                    onChange={(e) => set_alt_tag(e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div style={{
                                    width: '100%', height: '180px'
                                }}>
                                    <img width="100%" style={{ height: '100%', objectFit: 'cover' }} className="img-thumbnail" src={props.image} alt="" />
                                </div>
                            </Grid>
                        </Grid>
                    </form>
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