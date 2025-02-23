import MapScreen from '../maps/MapScreen';
import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react-native';

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

describe('MapScreen Toggle Button Tests', () => {

    it('should render toggle buttons correctly', async () => {
        render(<MapScreen route={{params: "test"}} />);
        await act(async () => {
            const sgwButton =  screen.findByTestId('sgwButton');
            const loyolaButton =  screen.findByTestId('loyolaButton');
            const userLocationButton =  screen.findByTestId('userLocationButton');
        
            expect(sgwButton).toBeTruthy();
            expect(loyolaButton).toBeTruthy();
            expect(userLocationButton).toBeTruthy();
      
      });
    });


    it('should update active button correctly when pressing SGW, Loyola, or User Location', async () => {
        render(<MapScreen route={{params: "test"}} />);
      
        await act(async () => {
          const sgwButton = screen.getByTestId('sgwButton');
          const loyolaButton = screen.getByTestId('loyolaButton');
          const userLocationButton = screen.getByTestId('userLocationButton');
      
          expect(sgwButton.props.style.backgroundColor).toBe('#800000');
          expect(loyolaButton.props.style.backgroundColor).toBe('#800000');
          expect(userLocationButton.props.style.backgroundColor).toBe('white');
      
          fireEvent.press(sgwButton);
          await new Promise(resolve => setTimeout(resolve, 0));
          expect(sgwButton.props.style.backgroundColor).toBe('white');
          expect(loyolaButton.props.style.backgroundColor).toBe('#800000');
          expect(userLocationButton.props.style.backgroundColor).toBe('#800000');
      
          fireEvent.press(loyolaButton);
          await new Promise(resolve => setTimeout(resolve, 0));
          expect(loyolaButton.props.style.backgroundColor).toBe('white');
      
          fireEvent.press(userLocationButton);
          await new Promise(resolve => setTimeout(resolve, 0));
          expect(userLocationButton.props.style.backgroundColor).toBe('white');
        });
      });

});
