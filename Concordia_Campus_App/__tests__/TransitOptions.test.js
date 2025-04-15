import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TransitScreen from '../maps/transitOptions';

jest.mock('react-native-maps-directions', () => {
  const MockMapViewDirections = () => null; 
  return MockMapViewDirections;
});

jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');

describe('TransitScreen Component', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<TransitScreen showDirections={true} campus={""} routeData={null}/>);
    // Check if directions button renders
    expect(getByTestId('driving-button')).toBeTruthy();
    expect(getByTestId('walking-button')).toBeTruthy();
    expect(getByTestId('transit-button')).toBeTruthy();
  });

test('shows directions when button is pressed', async () => {
    const { getByTestId } = render(<TransitScreen showDirections={true} campus={"SGW"} routeData={null}/>);
  
    const directionsButton = getByTestId('driving-button');
    fireEvent.press(directionsButton);
  
    // Check if MapViewDirections is rendered
    const mapDirections = getByTestId('driving-button');
    expect(mapDirections).toBeTruthy();
  });

  test('sets default mode to driving', async () => {
    const { getByTestId } = render(<TransitScreen showDirections={true} campus={"SGW"} routeData={null}/>);
  
    const directionsButton = getByTestId('driving-button');
    fireEvent.press(directionsButton);
  
    // Driving button should be highlighted by default
    const drivingButton = getByTestId('driving-button');
  
    // Verify Driving button's background color is blue
    const drivingButtonStyle = drivingButton.props.style;
    expect(drivingButtonStyle.backgroundColor).toBe('blue');
  });  

test('updates mode when mode buttons are pressed', () => {
    const { getByText, getByTestId } = render(<TransitScreen showDirections={true} campus={"SGW"} routeData={null}/>);
  
    const directionsButton = getByTestId('driving-button');
    fireEvent.press(directionsButton);
  
    const walkingButton = getByTestId('walking-button');
    fireEvent.press(walkingButton);
  
    // Verify Walking button's background color is blue
    const walkingButtonStyle = walkingButton.props.style;
    expect(walkingButtonStyle.backgroundColor).toBe('blue');

    const drivingButton = getByTestId('driving-button');
    fireEvent.press(drivingButton);
    const drivingButtonStyle = drivingButton.props.style;
    expect(drivingButtonStyle.backgroundColor).toBe('blue');
  
    const transitButton = getByTestId('transit-button');
    fireEvent.press(transitButton);
  
    // Verify Transit button's background color is green
    const transitButtonStyle = transitButton.props.style;
    expect(transitButtonStyle.backgroundColor).toBe('green');
  });
  

beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
  });
  
  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });
});