import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import * as locationUtils from '../maps/locationUtils';
import MapScreen from '../maps/MapScreen';

jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock') );
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons')

describe("Tests for outdoor points of interest", () => {
    beforeEach(() => {
        jest.spyOn(locationUtils, 'getLocation').mockResolvedValue({ latitude: 10, longitude: 10 }); 
    });

    test("get poi from filter error with responce", async () => {
        const { findByTestId, findByText } = render(<MapScreen route={{params: null}}/>);

        await act(async () => {
            const filterBTN = await findByTestId("test-filter");
            fireEvent.press(filterBTN);

            const coffeeShop = await findByText("Coffee Shops");
            fireEvent.press(coffeeShop);
        });
    });
});