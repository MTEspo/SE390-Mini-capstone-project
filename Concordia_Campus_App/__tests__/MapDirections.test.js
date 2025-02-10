import React from 'react';
import { render } from '@testing-library/react-native';
import MapDirections from '../maps/MapDirections';

jest.mock('react-native-maps-directions', () => {
  return ({ origin, destination, apikey, strokeWidth, strokeColor, testID }) => {
    return <div testID={testID} origin={origin} destination={destination} />;
  };
});

describe('MapDirections component', () => {
  it('should render null when userLocation or destinationLocation is missing', () => {
    const userLocation = { latitude: 37.78825, longitude: -122.4324 };
    const destinationLocation = null;
    
    const tree = render(<MapDirections userLocation={userLocation} destinationLocation={destinationLocation} />);
    expect(tree.toJSON()).toEqual(null);
  });

  it('should render Marker and MapViewDirections when userLocation and destinationLocation are provided', () => {
    const userLocation = { latitude: 37.78825, longitude: -122.4324 };
    const destinationLocation = { latitude: 37.80237, longitude: -122.40557 };
    
    const tree = render(<MapDirections userLocation={userLocation} destinationLocation={destinationLocation} />);
    expect(tree).toBeTruthy();
    expect(tree.getByTestId('marker')).toBeTruthy();
    expect(tree.getByTestId('map-view-directions')).toBeTruthy();
  });

  it('should render MapViewDirections with correct origin and destination coordinates', () => {
    const userLocation = { latitude: 37.78825, longitude: -122.4324 };
    const destinationLocation = { latitude: 37.80237, longitude: -122.40557 };

    const tree = render(<MapDirections userLocation={userLocation} destinationLocation={destinationLocation} />);
    const mapViewDirections = tree.getByTestId('map-view-directions');
    
    // Check that the correct props are passed to MapViewDirections
    expect(mapViewDirections.props.origin.latitude).toBe(userLocation.latitude);
    expect(mapViewDirections.props.origin.longitude).toBe(userLocation.longitude);
    expect(mapViewDirections.props.destination.latitude).toBe(destinationLocation.latitude);
    expect(mapViewDirections.props.destination.longitude).toBe(destinationLocation.longitude);
  });
});

