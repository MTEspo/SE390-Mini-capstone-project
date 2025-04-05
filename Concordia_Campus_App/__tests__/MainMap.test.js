import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import * as locationUtils from '../maps/locationUtils';
import MapScreen from '../maps/MapScreen';

jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock') );
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');


describe('Main map SGW and LOY Button Preeses', () => { 
    beforeEach(() => {
        jest.spyOn(locationUtils, 'getLocation').mockResolvedValue({ latitude: 10, longitude: 10 }); 
    });

    test("clicking on SGW and LOY buttons", async () => {
        const { findByTestId } = render(<MapScreen route={{params: null}} />);

        const sgwButton = await findByTestId("sgwButton");
        const loyButton = await findByTestId("loyolaButton");

        expect(sgwButton.props.style.backgroundColor).toBe("#800000");
        expect(loyButton.props.style.backgroundColor).toBe("#800000");
        
        await act(async () => {
            fireEvent.press(sgwButton);
        });
        
        expect(sgwButton.props.style.backgroundColor).toBe("white");
        expect(loyButton.props.style.backgroundColor).toBe("#800000");

        await act(async () => {
            fireEvent.press(sgwButton);
            fireEvent.press(loyButton);
        });

        expect(sgwButton.props.style.backgroundColor).toBe("#800000");
        expect(loyButton.props.style.backgroundColor).toBe("white");

        await act(async () => {
            fireEvent.press(loyButton);
        });
    })
 })