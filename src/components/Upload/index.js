import React, { Component, useContext } from 'react';
import Resizer from 'react-image-file-resizer';
import { useSelector } from 'react-redux';
import I18n from 'I18n';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  uploadButton: {
    marginRight: theme.spacing(2)
  },
  input: {
    display: 'none'
  }
}));

function Upload(props) {
  const account = useSelector(store => store.account);
  function blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  const classes = useStyles();
  function fileChangedHandler(event) {
    console.log(event);
    var fileInput = false;
    const file = event.target.files[0];
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        600,
        600,
        'JPEG',
        100,
        0,
        blob => {
          const img = blobToFile(blob, file.name);
          const formData = new FormData();
          formData.append('file', img, img.name);
          fetch('/api/images', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${account.access_token}`
            },
            body: formData
          })
            .then(res => res.json())
            .then(imgInfo => {
              props.onSuccess(imgInfo);
            });
        },
        'blob'
      );
    }
  }

  const t = useContext(I18n);

  return (
    <div>
      <input
        disabled={props.disabled}
        accept="image/*"
        className={classes.input}
        onChange={fileChangedHandler}
        id="contained-button-file"
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button
          disabled={props.disabled}
          variant={'outlined'}
          title={t('int.upload')}
          component="span"
          className={classes.button}>
          <AddIcon></AddIcon>
        </Button>
      </label>
    </div>
  );
}

Upload.propTypes = {
  onSuccess: PropTypes.any.isRequired,
  disabled: PropTypes.any
};

export default Upload;
