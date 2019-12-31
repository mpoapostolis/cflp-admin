import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import I18n from '../../I18n';

type Props = {
  onChange: (e: Record<string, any>) => void;
};

function Upload(props: Props) {
  async function fileChangedHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const url = URL.createObjectURL(file);
        props.onChange({ file, url });
      });
    }
    e.currentTarget.value = '';
  }

  const t = useContext(I18n);

  return (
    <>
      <input
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={fileChangedHandler}
        id="contained-button-file"
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button
          variant={'outlined'}
          title={t('int.add-image')}
          component="span">
          <AddIcon></AddIcon>
        </Button>
      </label>
    </>
  );
}

export default Upload;
