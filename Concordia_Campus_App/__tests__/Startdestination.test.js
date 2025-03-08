
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import * as locationUtils from '../maps/locationUtils';
import buildingsData from '../maps/buildingCoordinates';
import MapScreen from '../maps/MapScreen';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock') );
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

const johnMolsonBuilding = buildingsData.buildings.find(
  (b) => b.name === 'John Molson School of Business'
);

const simulatedLocation = {
  latitude: johnMolsonBuilding.markerCoord.latitude,
  longitude: johnMolsonBuilding.markerCoord.longitude,
};

let getLocationSpy = null;

describe('BuildingDirectionsMapScreen - Start and Destination Selection', () => {

  beforeEach(() => {
    getLocationSpy = jest.spyOn(locationUtils, 'getLocation')
                         .mockResolvedValue(simulatedLocation); 
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('displays different colored buildings when both start and destination buildings are selected', async () => {

    const startBuildingName = 'John Molson School of Business';
    const destinationBuildingName = 'Faubourg Tower';

    const { getByPlaceholderText, findByText, findByTestId } = render(<MapScreen route={{params: "test"}}/>);

    await act(async () => {
      const directionsButton = await findByText("Building Directions");
      fireEvent.press(directionsButton);
      
      const startInput = getByPlaceholderText('Select Start Building...');
      fireEvent.changeText(startInput, startBuildingName);
      
      const startResult = await waitFor(() => findByText(startBuildingName));
      fireEvent.press(startResult);
  
      //Select the Destination building
      const destinationInput = getByPlaceholderText('Select Destination Building...');
      fireEvent.changeText(destinationInput, destinationBuildingName);
      const destinationResult = await waitFor(() => findByText(destinationBuildingName));
      fireEvent.press(destinationResult);

      const startDestination = await findByTestId("test-"+startBuildingName);
      const endDestination = await findByTestId("test-"+destinationBuildingName);

      expect(startDestination.props.fillColor).toBe("green");
      expect(endDestination.props.fillColor).toBe("blue");

    });

  });

  it('sets the current building as start when "Use My Current Location" is pressed', async () => {       
    const { findByText, getByDisplayValue } = render(<MapScreen route={{params: "test"}} />);

    await act(async () => {
      const directionsButton = await findByText("Building Directions");
      fireEvent.press(directionsButton);
      expect(await findByText("Use My Current Location")).toBeTruthy();
  
      // Press the "Use My Current Location" button.
      const useMyLocationButton = await findByText('Use My Current Location');
      fireEvent.press(useMyLocationButton);
    });

      
    // Verify that the Start input is updated with "John Molson School of Business"
    const startInput = await waitFor(() =>
      getByDisplayValue('John Molson School of Business')
    );
    expect(startInput).toBeTruthy();
    expect(getLocationSpy).toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(await findByText("Get Directions"));
      fireEvent.press(await findByText("Return"));
    });
  });
});
