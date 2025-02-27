import React from 'react';
import { Polyline, Marker } from 'react-native-maps';

const PathOverlay = ({ path }) => {

  return (
    <>
      <Polyline
        coordinates={path}
        strokeColor="black"
        strokeWidth={3}
        lineDashPattern={[5, 5]}
      />
      <Marker coordinate={path[0]} pinColor={'green'} />
      <Marker coordinate={path[path.length - 1]} pinColor={'black'} />
    </>
  );
};

export default PathOverlay;