import React, { useState, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  CardHeader,
  Divider,
  Button
} from '@material-ui/core';
import I18n from '../../../I18n';
import Upload from '../../../components/Upload';
import ImageModal from '../../../components/ImageModal';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { cx } from 'emotion';
import * as R from 'ramda';

const useStyles = makeStyles((theme: any) => ({
  cardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    minHeight: '167px'
  },
  avatar: {
    cursor: 'pointer',
    margin: '10px',
    height: 65,
    width: 65,
    border: 'solid 1px #eee',
    '&.selected': {
      height: 75,
      width: 75,
      boxShadow: ' 0px 17px 10px -10px rgba(0,0,0,0.7)'
    }
  },

  spacer: {
    flexGrow: 1
  },
  avatarContainer: {
    height: 95,
    width: 95,
    cursor: 'pointer',
    '&:hover': {
      background: '#0002'
    },
    '&.selected': {
      height: 93,
      width: 93,
      border: 'solid 1px #0005'
    }
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
  const [openModal, setOpenModal] = useState(false);
  const handleAddImage = useCallback(img => setImages(s => [...s, img]), []);
  const t = useContext(I18n);

  const handleDeleteImage = () => {
    const union = R.intersection(images, selected);
    const _images = images.filter(img => !union.includes(img));
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
    <Card>
      <CardHeader
        title={`${t('int.images')} ${selectedTitle}`}
        subheader={t('int.edit-view-delete-images')}
      />
      <Divider />

      <CardContent className={classes.cardContent}>
        {images.map((obj, idx) => (
          <div
            onClick={() => handleSelectImg(obj)}
            key={idx}
            className={cx(classes.avatarContainer, {
              selected: selected.includes(obj)
            })}>
            <Avatar className={cx(classes.avatar)} src={obj.url} />
          </div>
        ))}
      </CardContent>
      <Divider />
      <CardActions>
        <span className={classes.spacer}></span>

        {selected.length === 1 && (
          <Button
            onClick={() => setOpenModal(true)}
            variant="outlined"
            title={t('int.view')}>
            <VisibilityIcon />
          </Button>
        )}

        {selected && (
          <Button
            onClick={handleDeleteImage}
            title={t('int.delete')}
            variant={'outlined'}>
            <DeleteOutlineIcon />
          </Button>
        )}

        <Upload onChange={handleAddImage} />
        <Button color={'primary'} variant="outlined">
          {t('int.save')}
        </Button>
      </CardActions>
      <ImageModal
        src={selected.length === 1 ? selected[0]?.url : undefined}
        onClose={() => setOpenModal(false)}
        open={openModal}
      />
    </Card>
  );
}

export default AccountProfile;
