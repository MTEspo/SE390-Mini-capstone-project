import React from 'react';
import { Overlay } from 'react-native-maps';

const BuildingOverlay = ({ coordinates, image, opacity }) => {
  if (!coordinates || !image) {
    return null;
  }

  return (
    <Overlay
      bounds={[
        [
          Math.min(...coordinates.map((coord) => coord.latitude)),
          Math.min(...coordinates.map((coord) => coord.longitude)),
        ],
        [
          Math.max(...coordinates.map((coord) => coord.latitude)),
          Math.max(...coordinates.map((coord) => coord.longitude)),
        ],
      ]}
      image={image}
      opacity={opacity}
    />
  );
};

export default BuildingOverlay;