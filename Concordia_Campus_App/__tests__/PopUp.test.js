import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import BuildingPopup from '../maps/BuildingPopup';
import MapScreen from '../maps/MapScreen';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock') );

jest.mock('react-native-vector-icons', () => ({
  FontAwesome: () => <mock-Icon />,
}));

jest.mock('@expo/vector-icons', () => ({
  __esModule: true,
  default: ({ name }) => <mock-Icon>{name}</mock-Icon>,
  Icon: 'Icon',
}));

jest.mock('@expo/vector-icons/FontAwesome', () => 'Icon');

jest.mock('expo-font', () => ({
  Font: {
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn(() => Promise.resolve()), 
  },
}));

jest.mock('expo-modules-core', () => ({
  __esModule: true,
  requireNativeModule: jest.fn(),
  LegacyEventEmitter: jest.fn(),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => ({ status: 'granted' })),
  LocationEventEmitter: jest.fn(() => ({})),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({ coords: { latitude: 45.4215, longitude: -75.6972 } })),
}));

process.env.EXPO_OS = 'ios';

describe('BuildingPopup', () => {
  it('renders correctly', () => {
    const building = {
      popUp: {
        name: 'Building Name',
        address: 'Building Address',
        codes: 'Building Codes',
      },
    };
    const onClose = jest.fn();
    const tree = render(<BuildingPopup building={building} onClose={onClose} />);
    expect(tree).toMatchSnapshot();
  });

  it('calls onClose when close button is pressed', () => {
    const building = {
      popUp: {
        name: 'Building Name',
        address: 'Building Address',
        codes: 'Building Codes',
      },
    };
    const onClose = jest.fn();
    const tree = render(<BuildingPopup building={building} onClose={onClose} />);
    const closeButton = tree.getByText('X');
    fireEvent.press(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when building is null', () => {
    const building = null;
    const onClose = jest.fn();
    const tree = render(<BuildingPopup building={building} onClose={onClose} />);
    expect(tree).toBeTruthy();
  });
});

describe('MapScreen', () => {
    it('renders polygons with correct colors', async () => {
        const { getAllByTestId } = render(<MapScreen route={{params: "test"}} />);
      
        // Wrap async state update in act()
        await act(async () => {

            const polygons = getAllByTestId(/^polygon-/); 
      
            expect(polygons.length).toBeGreaterThan(0);
            polygons.forEach((polygon) => {
              expect(polygon.props.fillColor).not.toBeNull();

          });
        });
      });

  it('renders BuildingPopup when polygon is pressed', async () => {
    const { getByTestId, findByTestId } = render(<MapScreen route={{params: "test"}} />);

    const polygon = getByTestId('polygon-0');

    await act(async () => {
      fireEvent.press(polygon);
    });

    const buildingPopup = await findByTestId('building-popup');

    expect(buildingPopup).toBeDefined();
  });
});

  

