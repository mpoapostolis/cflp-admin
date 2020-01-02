import React, { useState, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Button,
  IconButton
} from '@material-ui/core';
import I18n from '../../../I18n';
import Upload from '../../../components/Upload';
import ImageModal from '../../../components/ImageModal';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { cx, css } from 'emotion';
import * as R from 'ramda';
import CheckBoxRoundedIcon from '@material-ui/icons/CheckBoxRounded';
import useFetch from '../../../Hooks';

const useStyles = makeStyles((theme: any) => ({
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    minHeight: '167px',
    maxHeight: '65vh',
    overflowY: 'auto'
  },

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

function AccountProfile() {
  const classes = useStyles();
  const [images, setImages] = useState<Image[]>([]);
  const [selected, setSelected] = useState<Image[]>([]);
  const handleAddImage = useCallback(img => setImages(s => [...s, img]), []);
  const t = useContext(I18n);

  const handleDeleteImage = () => {
    const union = R.intersection(images, selected);
    const _images = images.filter(img => !union.includes(img));
    setImages(_images);
    setSelected([]);
  };

  const header = useFetch();

  const handleSelectImg = (img: Image) => {
    if (selected.includes(img)) {
      const _images = selected.filter(_img => _img.url !== img.url);
      setSelected(_images);
    } else {
      setSelected(s => [...s, img]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    const files = images.map(f => f.file as Blob);
    images.forEach(f => formData.append('image', f.file));

    fetch('/api/bo/products/images', {
      method: 'POST',
      headers: new Headers({
        ...header
      }),
      body: formData
    }).then(e => console.log(e));
  };

  const selectedTitle =
    selected.length > 0 ? `(${selected.length} ${t('int.selected')})` : '';

  return (
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
            onClick={handleDeleteImage}
            title={t('int.delete')}
            variant={'outlined'}>
            <DeleteOutlineIcon />
          </Button>
        )}

        <Upload onChange={handleAddImage} />
        <Button onClick={handleSubmit} color={'primary'} variant="outlined">
          {t('int.save')}
        </Button>
      </CardActions>
    </Card>
  );
}

export default AccountProfile;
