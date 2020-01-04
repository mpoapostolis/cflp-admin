import React, { useEffect } from 'react';
import Leaflet, { marker } from 'leaflet';
import { makeStyles } from '@material-ui/styles';
import { createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

import {
  Theme,
  Card,
  CardHeader,
  CardActions,
  Button
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  mapCont: {
    width: '600px',
    padding: '15px',
    height: '600px'
  },
  map: {
    width: '100%',
    height: '80%'
  }
}));

const GreceCoords = {
  lat: 37.98381,
  lng: 23.727539
};

interface IProps {}

function Offers(props: IProps) {
  const classes = useStyles();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(console.log);
    }
    const [lat, lng] = [GreceCoords.lat, GreceCoords.lng];
    const map = Leaflet.map('mapid').setView([lat, lng], 10);

    Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {}
    ).addTo(map);
  }, []);

  return (
    <Card className={classes.mapCont}>
      <CardHeader title="header" subheader="n  people "></CardHeader>
      <div className={classes.map} id="mapid" />
      <CardActions>
        <Button>Search</Button>
      </CardActions>
    </Card>
  );
}
export default Offers;
