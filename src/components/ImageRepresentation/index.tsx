import ImageIcon from '@material-ui/icons/Image';
import React from 'react';
import { Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

function ImageRepresentation(props: { howMany: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {props.howMany > 0 ? (
        <>
          <ImageIcon htmlColor={grey[500]} />
          <Typography style={{ marginLeft: '10px' }} variant="body2">
            x {props.howMany}
          </Typography>
        </>
      ) : (
        '-'
      )}
    </div>
  );
}

export default ImageRepresentation;
