import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import I18n from '../../I18n';

type Props = {
  onChange: (e: Record<string, any>) => void;
};

function Upload(props: Props) {
  async function fileChangedHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files;
    if (file) {
      const url = URL.createObjectURL(file[0]);
      props.onChange({ file, url });
    }
  }

  const t = useContext(I18n);

  return (
    <>
      <input
        accept="image/*"
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
