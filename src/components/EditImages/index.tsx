import React, { useState, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import I18n from '../../I18n';
import Upload from '../Upload';
import ImageModal from '../ImageModal';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { cx } from 'emotion';
import * as R from 'ramda';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';
import { toast } from 'react-toastify';
import api from '../../ky';

const useStyles = makeStyles(() => ({
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    minHeight: '167px',
    maxHeight: '61vh',
    overflowY: 'auto'
  },
  dialog: {},
  spacer: {
    flexGrow: 1
  },
  imgModal: {
    maxWidth: '250px',
    minHeight: '180px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    objectFit: 'cover',
    cursor: 'pointer'
  },
  imgClass: {
    cursor: 'pointer',
    height: 'calc(100% - 20px)',
    width: 'calc(100% - 20px)',
    transition: '0.125s',
    '&.selected': {
      height: 'calc(100% - 40px)',
      width: 'calc(100% -  40px)'
    }
  },
  selectMeCont: {
    margin: '10px',
    padding: '10px',
    position: 'relative',
    background: '#e8f0fe2f',

    '&.selected': {
      background: '#f8f0ff'
    }
  },
  selecteMe: {
    position: 'absolute',
    top: '-10px',
    left: '-10px'
  }
}));

type Image = {
  file: File;
  url: string;
};

type Props = {
  image?: string;
  isEdit: boolean;
  onChange: (paths: string) => void;
};

function EditImages(props: Props) {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<Image[]>([]);
  const handleAddImage = useCallback(async (img) => {
    const formData = new FormData();
    formData.append('image', img);

    const { path } = await api
      .post('/api/upload/images', {
        body: formData,
        headers: {}
      })
      .json();
    props.onChange(path);
  }, []);
  const t = useContext(I18n);

  // function handleClickDelete() {
  //   if (selected.filter((f) => !f.file).length > 0) {
  //     setOpenModal(true);
  //   } else handleDeleteImage();
  // }

  // const handleDeleteImage = () => {
  //   if (props.isEdit) {
  //     const paths = selected.filter((f) => !f.file).map((f) => f.url);
  //     if (paths.length > 0) {
  //       setOpenModal(false);
  //       props.deleteImages(paths);
  //       toast.success(t('int.images-deleted-successfully'));
  //     }
  //   }
  //   setSelected([]);
  // };

  console.log(props.image);

  const selectedTitle =
    selected.length > 0 ? `(${selected.length} ${t('int.selected')})` : '';

  return (
    <>
      <Card>
        <CardHeader
          title={`${t('int.images')} ${selectedTitle}`}
          subheader={t('int.edit-view-delete-images')}
        />
        <Divider />

        <CardContent className={classes.cardContent}>
          {props.image && (
            <div className={cx(classes.selectMeCont)}>
              <ImageModal
                className={classes.imgModal}
                src={`/img/${props.image}`}>
                <img
                  className={cx(classes.imgClass)}
                  src={`/img/${props.image}`}
                />
              </ImageModal>
            </div>
          )}
        </CardContent>
        <Divider />
        <CardActions>
          <span className={classes.spacer}></span>

          {selected.length > 0 && (
            <Button title={t('int.delete')} variant={'outlined'}>
              <DeleteOutlineIcon />
            </Button>
          )}

          <Upload onChange={handleAddImage} />
        </CardActions>
      </Card>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{t('int.warning')}</DialogTitle>
        <DialogContent>
          <DialogContentText
            className={classes.dialog}
            id="alert-dialog-description">
            {t('int.image-action confirmation')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>
            {t('int.disagree')}
          </Button>
          <Button style={{ color: 'red' }} autoFocus>
            {t('int.agree')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditImages;
