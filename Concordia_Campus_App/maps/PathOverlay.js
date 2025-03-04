import React, { useEffect, useState } from 'react';
import { Polyline, Marker } from 'react-native-maps';

const PathOverlay = ({ path }) => {
  const [delayedPath, setDelayedPath] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedPath(path);
    }, 500);

    return () => clearTimeout(timer);
  }, [path]);

  if (!delayedPath) return null;

  return (
    <>
      <Polyline
        coordinates={delayedPath}
        strokeColor="blue"
        strokeWidth={1}
        lineDashPattern={[5, 5]}
      />
      
      <Marker coordinate={delayedPath[0]} pinColor={'green'} />
      <Marker coordinate={delayedPath[delayedPath.length - 1]} pinColor={'black'} />
    </>
  );
};

export default PathOverlay;
