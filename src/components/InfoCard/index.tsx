import React, { useContext, ReactNode, ReactElement } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Theme,
  CardActions,
  Button
} from '@material-ui/core';
import { cx } from 'emotion';
import { EUROSIGN } from '../../utils';
import { makeStyles } from '@material-ui/styles';

type IconColor = 'orange' | 'blue' | 'green';

const COLORS = {
  orange: 'linear-gradient(180deg, #ffa726 0%, #f57c00 100%)',
  blue: 'linear-gradient(180deg, #1976d2 0%, #0d47a1 100%)',
  green: 'linear-gradient(180deg, #66bb6a 0%, #43a047 100%)'
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  title: {
    fontWeight: 700
  },
  header: {
    paddingBottom: 0
  },
  content: {
    paddingTop: 0
  },
  value: {
    marginBottom: '5px'
  },
  avatar: {
    backgroundColor: 'transparent',
    height: 35,
    width: 35,
    color: 'white',
    '&.orange': {
      background: COLORS.orange
    },
    '&.green': {
      background: COLORS.green
    },

    '&.blue': {
      background: COLORS.blue
    }
  },
  diff: {
    display: 'flex',
    alignItems: 'center',
    color: 'green',
    '&.isNegative': {
      color: 'red'
    }
  }
}));

type Props = {
  className?: string;
  value: string;
  title: string;
  icon: ReactNode;
  primary?: boolean;
  iconColor?: IconColor;
};
function InfoCard(props: Props) {
  const classes = useStyles();

  return (
    <Card
      elevation={1}
      className={cx(props.className, { [classes.root]: props.primary })}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color={props.primary ? 'inherit' : undefined}
              gutterBottom
              variant="body2">
              {props.title}
            </Typography>
            <Typography color="inherit" variant="h2">
              {props.value}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={cx(classes.avatar, props.iconColor)}>
              {props.icon}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" color="secondary">
          see More
        </Button>
      </CardActions>
    </Card>
  );
}

export default InfoCard;
