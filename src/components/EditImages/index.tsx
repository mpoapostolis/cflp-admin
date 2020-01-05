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
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
  isEdit: boolean;
  deleteImages: (paths: string[]) => void;
};

function EditImages(props: Props) {
  const classes = useStyles();
  const { images, setImages } = props;
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<Image[]>([]);
  const handleAddImage = useCallback(img => setImages(s => [...s, img]), []);
  const t = useContext(I18n);

  function handleClickDelete() {
    if (selected.filter(f => !f.file).length > 0) {
      setOpenModal(true);
    } else handleDeleteImage();
  }

  const handleDeleteImage = () => {
    const union = R.intersection(images, selected);
    const _images = images.filter(img => !union.includes(img));
    if (props.isEdit) {
      const paths = selected.filter(f => !f.file).map(f => f.url);
      if (paths.length > 0) {
        setOpenModal(false);
        props.deleteImages(paths);
        toast.success(t('int.images-deleted-successfully'));
      }
    }
    setImages(_images);
    setSelected([]);
  };

  const handleSelectImg = (img: Image) => {
    if (selected.includes(img)) {
      const _images = selected.filter(_img => _img.url !== img.url);
      setSelected(_images);
    } else {
      setSelected(s => [...s, img]);
    }
  };

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
          {images.map((obj, idx) => (
            <div
              key={idx}
              onClickCapture={evt => {
                if (selected.length > 0) {
                  handleSelectImg(obj);
                  evt.stopPropagation();
                }
              }}
              className={cx(classes.selectMeCont, {
                selected: selected.includes(obj)
              })}>
              <IconButton
                className={classes.selecteMe}
                onClick={() => handleSelectImg(obj)}>
                <CheckBoxRoundedIcon
                  color={selected.includes(obj) ? 'secondary' : 'action'}
                />
              </IconButton>
              <ImageModal key={idx} className={classes.imgModal} src={obj.url}>
                <img
                  className={cx(classes.imgClass, {
                    selected: selected.includes(obj)
                  })}
                  src={obj.url}
                />
              </ImageModal>
            </div>
          ))}
        </CardContent>
        <Divider />
        <CardActions>
          <span className={classes.spacer}></span>

          {selected.length > 0 && (
            <Button
              onClick={handleClickDelete}
              title={t('int.delete')}
              variant={'outlined'}>
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
          <Button
            style={{ color: 'red' }}
            onClick={handleDeleteImage}
            autoFocus>
            {t('int.agree')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditImages;